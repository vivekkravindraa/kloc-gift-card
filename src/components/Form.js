import React, { Component } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import Loader from 'react-loader';
import queryString from 'query-string';
import Rodal from 'rodal';
import validateInput from '../validation/form';

export default class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shop: '',
            customerId: '',
            giftCardsQty: '',
            expiryDate: '',
            email: '',
            amount: '',
            prefix: '',
            isSubmitted: false,
            visible: false,
            loaded: false,
            errors: {},
            error: {
                statusCode: '',
                data: ''
            }
        }
    }

    componentDidMount = () => {
        let userData = this.props.location.search;
        let data = queryString.parse(userData);
        // console.log(data);
        this.setState({
            shop: data.shop,
            customerId: data.customerId
        })
        localStorage.setItem('shopDomain', data.shop);
        localStorage.setItem('customerId', data.customerId);
    }

    handleOnChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleDate = (e) => {
        this.setState({ expiryDate: e.target.value })
    }

    show = () => {
        const {
            giftCardsQty,
            email,
            amount
        } = this.state;

        const data = {
            giftCardsQty,
            email,
            amount
        }

        this.setState({ isSubmitted: true });

        let { errors, isValid } = validateInput(data)

        if (!isValid || giftCardsQty < 1 || amount < 100) {
            this.setState({
                errors,
                visible: false
            })
        } else {
            this.setState({ visible: true })
        }
    }

    hide = () => { this.setState({ visible: false }) }

    handleConfirm = (e) => {
        e.preventDefault();

        const {
            shop,
            customerId,
            giftCardsQty,
            expiryDate,
            email,
            amount,
            prefix
        } = this.state;

        const giftCardData = {
            shop,
            customerId,
            numberOfGiftCardsToGenerate: giftCardsQty,
            expiryDate: expiryDate,
            giftCardHolderEmail: email,
            amountOfEachGiftCard: amount,
            prefix: prefix,
            price: String(giftCardsQty * amount),
            body_html: `${shop} ${customerId} ${giftCardsQty} ${expiryDate} ${email} ${amount} ${prefix}`
        }

        this.setState({
            isSubmitted: true,
            loaded: true
        });
        // console.log(giftCardData);

        axios.post(`https://402b76da.ngrok.io/products/app/create-product`, giftCardData)
            .then((response) => {
                // console.log(response.data, "axios data")
                this.setState({
                    visible: false,
                    loaded: false
                })
                const variantId = response.data.variants[0].id;
                window.location.href = `https://klocapp.myshopify.com/cart/${variantId}:1`;
            })
            .catch((err) => {
                // console.log(err);
                // console.log(err.response.status, err.response.data)
                this.setState({
                    visible: false,
                    loaded: false,
                    error: {
                        ...this.state.error,
                        statusCode: err.response.status,
                        data: err.response.data
                    }
                })
            })
    }

    render() {
        const {
            giftCardsQty,
            expiryDate,
            email,
            amount,
            prefix,
            isSubmitted,
            loaded,
            errors,
            error,
        } = this.state;

        let today = new Date();
        let month = today.getMonth() + 1;
        let resultMonth = String(month).length > 1 ? String(month) : '0' + String(month);
        let dateNow =  today.getFullYear() + '-' + resultMonth + '-' + today.getDate();

        return (
            <div className="container">
                {error.data ?
                    <h6 className="card-panel teal lighten-2">
                        You haven't installed the app! Please install it.
                    </h6>
                    : null}
                <h1>Generate Gift Cards</h1>
                <div>
                    <label htmlFor="giftCardsQty" style={{ color: "black" }}>
                        Enter the number of gift cards
                    </label>
                    <input
                        className={classnames("", {
                            invalid: errors.giftCardsQty
                        })}
                        type="number"
                        name="giftCardsQty"
                        value={giftCardsQty}
                        error={errors.giftCardsQty}
                        min="1"
                        onChange={this.handleOnChange}
                    />
                    {isSubmitted && (!giftCardsQty || giftCardsQty < 1) &&
                        <div className="help-block" style={{ color: "red" }}>
                            Gift card is required. You should enter atleast 1 gift card.
                        </div>
                    }
                </div>
                <div>
                    <label htmlFor="expiryDate" style={{ color: "black" }}>
                        Enter the date of expiry for the gift cards
                    </label>
                    <input
                        type="date"
                        name="expiryDate"
                        value={expiryDate}
                        min={dateNow}
                        max="2050-01-01"
                        onChange={this.handleDate}
                    />
                </div>
                <div>
                    <label htmlFor="email" style={{ color: "black" }}>
                        Enter the email id of the person to whom you want to send the gift cards
                    </label>
                    <input
                        className={classnames("", {
                            invalid: errors.email || errors.emailnotfound
                        })}
                        type="email"
                        name="email"
                        value={email}
                        error={errors.email}
                        pattern="[^ @]*@[^ @]*"
                        onChange={this.handleOnChange}
                    />
                    {isSubmitted && !email &&
                        <div className="help-block" style={{ color: "red" }}>Email is required</div>
                    }
                    {isSubmitted && errors['email'] === 'Email is invalid' &&
                        <div className="help-block" style={{ color: "red" }}>Email is invalid</div>
                    }
                </div>
                <div>
                    <label htmlFor="amount" style={{ color: "black" }}>
                        Select the amount for each gift card
                    </label>
                    <input
                        className={classnames("", {
                            invalid: errors.amount
                        })}
                        type="number"
                        name="amount"
                        value={amount}
                        error={errors.amount}
                        min="100"
                        onChange={this.handleOnChange}
                    />
                    {isSubmitted && (!amount || amount < 100) &&
                        <div className="help-block" style={{ color: "red" }}>
                            Amount is required. You should enter a minimum of 100 rupees.
                        </div>
                    }
                </div>
                <div>
                    <label htmlFor="prefix" style={{ color: "black" }}>
                        Select the prefix with which you want to generate random codes for the gift cards
                    </label>
                    <input
                        type="text"
                        name="prefix"
                        value={prefix}
                        onChange={this.handleOnChange}
                    />
                </div>
                <button className="btn btn-secondary" onClick={this.show}>Generate</button>
                <Rodal visible={this.state.visible} onClose={this.hide}>
                    <p>You have selected <b>{this.state.giftCardsQty ? this.state.giftCardsQty : '0'}</b> gift cards of <b>{this.state.amount ? this.state.amount : '0'}</b> rupees.</p>
                    <p>You have to pay an overall of <b>{this.state.giftCardsQty * this.state.amount}</b> rupees.</p>
                    <button className="btn btn-secondary" onClick={this.handleConfirm}>Confirm</button>
                    <pre>  OR  </pre>
                    <button className="btn btn-secondary" onClick={this.hide}>Cancel</button>
                </Rodal>
                {loaded ? <Loader loaded={loaded} /> : null}
            </div>
        )
    }
}
