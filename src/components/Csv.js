import React, { Component } from 'react';
import { CSVLink } from "react-csv";

export default class Csv extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {

        const headers = [
            { label: "First Name", key: "firstname" },
            { label: "Last Name", key: "lastname" },
            { label: "Email", key: "email" }
        ];

        const csvData = [
            ["firstname", "lastname", "email"],
            ["Ahmed", "Tomi", "ah@smthing.co.com"],
            ["Raed", "Labes", "rl@smthing.co.com"],
            ["Yezzi", "Min l3b", "ymin@cocococo.com"]
        ];

        return (
            <div>
                <CSVLink data={csvData} headers={headers}>Download as CSV</CSVLink>
            </div>
        )
    }
}
