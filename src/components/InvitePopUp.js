import React, { Component } from "react";
import  { url, urlEmail, urlGraph, registerLink } from './url.js';
import validator from  "validator";

class InvitePopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            owner: "",
            emailError: "",
            emailSentSuccess: "",
            allowed: []
        };
        console.log(this.props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    async componentDidMount() {
        const file = this.props.file;

        // get the allowed users for this file
        await fetch(urlGraph, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "x-access-token": await sessionStorage.getItem('token')
            },
            body: JSON.stringify({ query: `{ file (filename: "${file}")  {owner allowed} }` })
        })
        .then(r => r.json())
        .then((result) => {
            console.log(result);
            this.setState({
                owner: result.data.file.owner,
                allowed:  result.data.file.allowed,
            });
        });
    };

    handleClick = () => {
        this.props.toggle();
    };


     handleChange (e) {
            this.setState({email: e.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        let email = this.state.email;

        // Check email is valid or not
        if (validator.isEmail(email)) {
            // add this email to the allowed field for this file
            let urlAllowed = url + "/allowed";
            this.setState(prevState => ({
                allowed: [...prevState.allowed, email]
            }))
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', "x-access-token": sessionStorage.token },
                body: JSON.stringify({filename: this.props.file, allowed: email})
            };
            fetch(urlAllowed, requestOptions)
            .then(response => response.json());

            // send an email to this user
            const to = email;
            const from = "qipa19@student.bth.se";
            const subject = "Invitation of editing file " + this.props.file;
            const template = "<strong>Please click to  </strong>" +
            "<a href=" + registerLink + ">Register</a>";
            console.log("template", template);
            const reqOptionsEmail = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({to: to, from: from, subject: subject, template: template})
            };
            fetch(urlEmail, reqOptionsEmail)
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                this.setState({emailSentSuccess: data.message});
            });;
        } else {
            this.setState({emailError:"Please enter valid email!"});
        }


        // this.props.toggle();
    }

    render() {
        const allowed = this.state.allowed;

        return (
            <div className="invite">
            <div className="modal_content">
            <span className="close" onClick={this.handleClick}>
            &times;
            </span>
            <h1>Share Document</h1>
            <form  onSubmit={this.handleSubmit}>
            <label>Email:</label>
            <input type="text" value={this.state.email} onChange={(e) => this.handleChange(e)} />
            <button type="submit" >Submit</button>
            </form>
            <br />
            <span style={{
                fontWeight: 'bold',
                color: 'red',
            }}>{this.state.emailError}</span>
            <span style={{
                fontWeight: 'bold',
                color: 'red',
            }}>{this.state.emailSentSuccess}</span>
            <br />
            <label>Owner:</label>{this.state.owner}
            <br />
            <label>Already invited:</label>
            {allowed !== null ?
                allowed.map((message,i) => <div key={i}>{message} </div>)
                :null
            }
            </div>
            </div>
        );
    }
}

export default InvitePopUp;
