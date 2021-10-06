
import React from "react";

// const url='http://localhost:1337/users';
const url='https://jsramverk-editor-qipa19.azurewebsites.net/users';
const headers = { 'Content-Type': 'application/json' };


class LoginBox extends React.Component {
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

    async submitLogin(e) {
        e.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        const urlLogin = url + "/login";
        const requestOptions = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ email: email, password: password })
        };

        // const token = async () => {
        //     const response = await fetch(urlLogin, requestOptions);
        //
        //     return response.json();
        // };
        // (async () => {
        //     const token1 = await token();
        //     await sessionStorage.setItem('token',  token1.data.token);
        //     sessionStorage.setItem('email', email);
        //
        // })();
        let history = this.props.history;
        fetch(urlLogin, requestOptions)
        .then(response => response.json())
        .then((result) => {
            if (result.data) {
                console.log(result.data.token);
                sessionStorage.setItem('token', result.data.token);
                sessionStorage.setItem('email',  email);
                history.push("/file");
            };
            if (result.errors) {
                alert(result.errors.title);
            };
        });
    }

    render() {
        return (
            <div className="inner-container">
            <div className="header">
            Login
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

            <button type="button" className="login-btn" onClick={this.submitLogin.bind(this)}>Login</button>
            </div>
            </form>
            </div>
            );
        }

}


export default LoginBox;
