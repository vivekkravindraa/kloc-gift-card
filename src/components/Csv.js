import React, { Component } from 'react';
import { CSVLink } from "react-csv";

export default class Csv extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        const csvData = [
            ["firstname", "lastname", "email"],
            ["Ahmed", "Tomi", "ah@smthing.co.com"],
            ["Raed", "Labes", "rl@smthing.co.com"],
            ["Yezzi", "Min l3b", "ymin@cocococo.com"]
        ];

        return (
            <div>
                {csvData.length > 0 ? <CSVLink data={csvData}>Download as CSV</CSVLink> : null}
            </div>
        )
    }
}
