
import React from "react";
// const url='http://localhost:1337/users';
const url='https://jsramverk-editor-qipa19.azurewebsites.net/users';
const headers = { 'Content-Type': 'application/json' };

class RegisterBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email:"",
            password:"",
            token: ""
        };
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    async submitRegister(e) {
        e.preventDefault()
        const email = this.state.email;
        const password = this.state.password;
        const urlRegister = url + "/register";
        console.log(urlRegister);
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ email: email, password: password })
        };
        await fetch(urlRegister, requestOptions)
        .then(response => response.json())
        .catch((error) => {
            console.error('Error:', error);
        });
        this.props.history.push("/login");
    }

    render() {
        return (
            <div className="inner-container">
            <div className="header">
            Register
            </div>
            <form>
            <div className="box">

            <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="text" name="email" className="login-input" placeholder="Email"
            value={this.state.email} onChange={this.handleEmailChange}/>
            </div>

            <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" className="login-input" placeholder="Password"
            value={this.state.password} onChange={this.handlePasswordChange.bind(this)}/>
            </div>
            <button type="button" className="login-btn" onClick={this
                .submitRegister
                .bind(this)}>Register
                </button>
                </div>
                </form>
                </div>
            );
        }
    }

    export default RegisterBox;
