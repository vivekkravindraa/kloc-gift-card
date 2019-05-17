import React, { Component } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';
// import queryString from 'query-string';

export default class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            shop: '',
            customerId: ''
        }
    }

    componentDidMount = () => {
        // let userData = this.props.location.search;
        // let data = queryString.parse(userData);
        // console.log(data);
        // this.setState({
        //     shop: data.shop,
        //     customerId: data.customerId
        // })
        // axios.get(`https://402b76da.ngrok.io?shop={data.shop}`)
        // .then((response) => { console.log(response.data) })
        // .catch((err) => { console.log(err) })
    }

    render() {
        const { shop } = this.state;

        return (
            <div>
                Welcome to Shop {shop}
                <Link to="/generate_gift_cards">Generate Gift Cards</Link>
            </div>
        )
    }
}
