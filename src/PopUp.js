import React, { Component } from "react";
const url='https://jsramverk-editor-qipa19.azurewebsites.net/data';
// const url='http://localhost:1337/data';

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
            // add a new file
            console.log("popup", this.state.inputFilename);
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', "x-access-token": sessionStorage.token },
                body: JSON.stringify({ filename: this.state.inputFilename, content: window.editorData })
            };
          fetch(url, requestOptions)
            .then(response => response.json());
        }
        this.props.toggle();
        window.location.reload();
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
