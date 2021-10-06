import React, { Component } from "react";
import  { urlGraph } from './url.js';


class PopUp extends Component {
    constructor(props) {
        super(props);
        this.state = {inputFilename: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    handleClick = () => {
        this.props.toggle();
    };

    handleChange(event) {
        this.setState({inputFilename: event.target.value});
    };

    handleSubmit = (event) => {
        event.preventDefault();
        // let inputFilename;
        // inputFilename = this.state.inputFilename;

        if (this.state.inputFilename !== "") {
            //add a new file with graphql
            const query = JSON.stringify({
                query: `mutation test($filename: String!, $content: String!, $owner: String!)  {
                    newFile(filename: $filename, content: $content, owner: $owner) {
                        filename
                        content
                        owner
                    }
                }
                `,
                variables: {
                    filename: this.state.inputFilename,
                    content: window.editorData,
                    owner: sessionStorage.getItem("email")
                },
            });
            //console.log(query);
            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    "x-access-token": sessionStorage.token
                },
                body: query
            };
            console.log("popup",urlGraph);
            fetch(urlGraph, requestOptions)
            .then(r => r.json())
            .then(data => console.log('data returned:', data));
            // add a new file with rest api
            // console.log("popup", this.state.inputFilename);
            // const requestOptions = {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json', "x-access-token": sessionStorage.token },
            //     body: JSON.stringify({ filename: this.state.inputFilename, content: window.editorData })
            // };
            // fetch(url, requestOptions)
            // .then(response => response.json());
        }
        this.props.toggle();
        // window.location.reload();
    }

    render() {

        return (
            <div className="modal">
            <div className="modal_content">
            <span className="close" onClick={this.handleClick}>
            &times;
            </span>

            <form  onSubmit={this.handleSubmit}>
            <label>
            FileName:
            <input type="text" value={this.state.inputFilename} onChange={this.handleChange} />
            </label>
            <br />
            <button type="submit">Submit</button>
            </form>
            </div>
            </div>
        );
    }
}

export default PopUp;
