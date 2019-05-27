import React, { Component }     from 'react';
import axios                    from 'axios';
import { baseURL }              from '../baseURL';
import { CSVLink }              from 'react-csv';
import queryString              from 'query-string';
import Clipboard                from 'clipboard';

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
        if (tempToken.temp) {
            axios.get(`${baseURL}/orders/gift_cards?tempCode=${tempToken.temp}`)
                .then((response) => {
                    this.setState({ giftCardCodes: response.data })
                })
                .catch((err) => { console.log(err) })
        }
    }

    render() {
        const { giftCardCodes } = this.state;
        // const giftCardCodes = [
        //     { code: "kloc-FR6bwx1qFR6bwx1q" },
        //     { code: "kloc-ByamOdWVByamOdWV" },
        //     { code: "kloc-7roFwfQs7roFwfQs" }, 
        //     { code: "kloc-rmWlwvllrmWlwvll" },
        //     { code: "kloc-pgih5eABpgih5eAB" }
        // ];
        return (
            <div className="container">
                <h1>Generated Gift Card Codes:</h1>
                {giftCardCodes.length > 0 ?
                    <CSVLink
                        data={giftCardCodes}
                    >
                        Download as CSV
                    </CSVLink>
                    : null}
                {giftCardCodes.length > 0 ?
                    giftCardCodes.map((item, index) => {
                        return (
                            <div key={index}>
                                <button
                                    className="btn"
                                    data-clipboard-target={"#copy" + index}
                                    style={{
                                        "float": "right"
                                    }}
                                >
                                    Copy Code<i className="material-icons right">content_copy</i>
                                </button>
                                <div
                                    id={"copy" + index}
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
                    : <h6 className="card-panel teal lighten-2">
                        ERROR - NOT FOUND :: You haven't generated any gift card codes!
                    </h6>
                }
            </div>
        )
    }
}
