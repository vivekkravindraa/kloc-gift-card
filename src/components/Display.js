import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import Clipboard from 'clipboard';
export default class Display extends Component {
    constructor(props) {
        super(props);
        this.state = {
            giftCardCodes: []
        }
    }

    componentDidMount = () => {
        new Clipboard('.btn');
        let tempToken = queryString.parse(this.props.location.search);
        // console.log(tempToken.temp);
        if(tempToken.temp) {
            axios.get(`https://0c4dd1cd.ngrok.io/orders/gift_cards?tempCode=${tempToken.temp}`)
            .then((response) => {
                // console.log(response.data);
                this.setState({ giftCardCodes: response.data })
            })
            .catch((err) => { console.log(err) })
        }
    }

    render() {
        const { giftCardCodes } = this.state;
        // const giftCardCodes = [
        //     { code: "FR6bwx1q" },
        //     { code: "ByamOdWV" },
        //     { code: "7roFwfQs" }, 
        //     { code: "rmWlwvll" },
        //     { code: "pgih5eAB" }
        // ];

        return (
            <div className="container">
                <h1>Generated Gift Card Codes:</h1>
                {giftCardCodes.length > 0 ?
                    giftCardCodes.map((item, index) => {
                        return (
                            <div key={index}>
                                <button
                                    className="btn"
                                    data-clipboard-target={"#copy"+index}
                                    style={{
                                        "float":"right"
                                    }}
                                >
                                    Copy Code<i className="material-icons right">content_copy</i>
                                </button>
                                <div
                                    id={"copy"+index}
                                    style={{
                                        "fontWeight": "bold",
                                        "textAlign": "center",
                                        "backgroundColor": "teal",
                                        "color": "white",
                                        "borderLeft": "20px solid red",
                                        "padding": "10px",
                                        "marginBottom": "10px",
                                        "borderRadius": "4px 4px 4px 4px"
                                    }}
                                >
                                {item.code.toUpperCase()}
                                </div>
                            </div>
                        )
                    })
                :   <h6 className="card-panel teal lighten-2">
                        NOT FOUND :: You haven't genreated any gift card codes!
                    </h6>
                }
            </div>
        )
    }
}
