import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

export default class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftCardsCouponCodes: []
        }
    }

    componentDidMount = () => {
        let tempToken = queryString.parse(this.props.location.search);
        console.log(tempToken.temp);
        axios.get(`https://0c4dd1cd.ngrok.io/orders/gift_cards?tempCode=${tempToken.temp}`)
        .then((response) => {
            console.log(response.data);
            this.setState({ data: response.data })
        })
        .catch((err) => { console.log(err) })
    }

    render() {
        const { giftCardsCouponCodes } = this.state;
        return (
            <div>
                Landing in Display Page!
                <h1>Coupon Codes</h1>
                <ul>
                    {giftCardsCouponCodes.map((code, index) => {
                        return (
                            <li key={index}>
                                {code}
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}
