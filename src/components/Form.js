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
            visible: false,
            loaded: false,
            errors: {},
            error: {
                statusCode: '',
                data: '',
                message: ''
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

        // let dateSelected = e.target.value;
        // // console.log('dateSelected', dateSelected);

        // let today = new Date();
        // let month = today.getMonth() + 1;
        // let resultMonth = String(month).length > 1 ? String(month) : '0' + String(month);
        // let dateNow =  today.getFullYear() + '-' + resultMonth + '-' + today.getDate();
        // // console.log('dateNow', dateNow);

        // if(
        //     (dateSelected.slice(0,4) < dateNow.slice(0,4)) ||
        //     (dateSelected.slice(5,7) < dateNow.slice(5,7)) ||
        //     (dateSelected.slice(8,10) < dateNow.slice(8,10))
        // ) {
        //     this.setState({ expiryDate: '' })
        // } else {
        //     this.setState({ expiryDate: e.target.value })
        // }
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

        let { errors, isValid } = validateInput(data)

        if (!isValid) {
            this.setState({
                errors,
                visible: false
            })
        } else {
            console.log(this.state);
            this.setState({ errors: {}, visible: true })
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

        this.setState({ loaded: true });
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
                // console.log(err.response);
                // console.log(err.response.status);
                // console.log(err.response.data);
                // console.log(err.message);
                if(!err.response) {
                    this.setState({
                        visible: false,
                        loaded: false,
                        error: {
                            ...this.state.error,
                            statusCode: '',
                            data: '',
                            message: `There's a network error!`
                        }
                    })
                } else {
                    this.setState({
                        visible: false,
                        loaded: false,
                        error: {
                            ...this.state.error,
                            statusCode: err.response.status,
                            data: err.response.data,
                            message: ''
                        }
                    })
                }
            })
    }

    render() {
        const {
            giftCardsQty,
            expiryDate,
            email,
            amount,
            prefix,
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
                    <h6 className="card-panel red lighten-2">
                        NOT FOUND ERROR :: You haven't installed the app! Please install it.
                    </h6>
                    : null}
                {error.message ?
                    <h6 className="card-panel red lighten-2">
                        NETWORK ERROR :: We're unable to connect to the server right at this moment. Please, try again!
                    </h6>
                    : null}
                <h1>Generate Gift Cards</h1>
                <div>
                    <label htmlFor="giftCardsQty" style={{ color: "black" }}>
                        Enter the number of gift cards
                    </label>
                    <input
                        className={classnames("", {
                            invalid: errors.giftCardsQty || errors.giftCardsQtyIsInvalid
                        })}
                        type="number"
                        name="giftCardsQty"
                        value={giftCardsQty}
                        error={errors.giftCardsQty}
                        min="1"
                        max="100"
                        onChange={this.handleOnChange}
                    />
                    <span className="red-text">
                        {errors.giftCardsQty}
                        {errors.giftCardsQtyIsInvalid}
                    </span>
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
                            invalid: errors.email || errors.emailIsInvalid
                        })}
                        type="email"
                        name="email"
                        value={email}
                        error={errors.email}
                        pattern="[^ @]*@[^ @]*"
                        onChange={this.handleOnChange}
                    />
                    <span className="red-text">
                        {errors.email}
                        {errors.emailIsInvalid}
                    </span>
                </div>
                <div>
                    <label htmlFor="amount" style={{ color: "black" }}>
                        Select the amount for each gift card
                    </label>
                    <input
                        className={classnames("", {
                            invalid: errors.amount || errors.amountIsInvalid
                        })}
                        type="number"
                        name="amount"
                        value={amount}
                        error={errors.amount}
                        min="1"
                        max="10000"
                        onChange={this.handleOnChange}
                    />
                     <span className="red-text">
                        {errors.amount}
                        {errors.amountIsInvalid}
                    </span>
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
