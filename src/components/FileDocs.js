import React, { Component } from 'react';
import PopUp from "./PopUp";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../App.css';
import socketIOClient from "socket.io-client";

var editorData;
const url='https://jsramverk-editor-qipa19.azurewebsites.net/data';
const urlUser='https://jsramverk-editor-qipa19.azurewebsites.net/users';
//const url='http://localhost:1337/data';
var content;
var tempItems;
var ENDPOINT ;

// console.log(window.location.hostname, window.location.href);
if (window.location.hostname === "localhost") {
    ENDPOINT = "http://127.0.0.1:1337";
} else {
    ENDPOINT = "https://jsramverk-editor-qipa19.azurewebsites.net/";
};

ENDPOINT = "https://jsramverk-editor-qipa19.azurewebsites.net/";

const socket = socketIOClient(ENDPOINT);


class FileDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            currentFile: "",
            currentContent: "",
            listItems:[],
            seen: false,
            isOpenedContent: false,
            users: []
        };

        this.openContent = this.openContent.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.newFile = this.newFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.togglePop = this.togglePop.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyUpDown = this.onKeyUpDown.bind(this);
    };

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    async handleSubmit(e) {
        // alert('Your favorite flavor is: ' + this.state.value);
        e.preventDefault();
        let email = this.state.value;
        let urlAllowed = url + "/allowed";
        // Get the token with await beacuse it is generated by loginbox with async
        const headers = { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.token };

        const requestOptions = {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify({ filename: this.state.currentFile, allowed: email})
        };
        await fetch(urlAllowed, requestOptions)
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            alert(email + "  has been granted!");
        });
    }

    async componentDidMount() {
        socket.on('connect', () => {
            // console.log("Connected to the backend!");
        });
        // The client receive data through an EventListener and update the value in our text editor.
        socket.on("doc", (data) => {
            // console.log("doc", data);
            this.setState({currentContent: data});
        });

        // get all the users from the collection users
        var requestOptions = {
            method: 'GET',
            headers:  { 'Content-Type': 'application/json' },
        };

        await fetch(urlUser, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                //console.log(result);
                this.setState({
                    users: result
                });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                console.log(error);
            }
        )
        // get all the files which belong to this logined user
        requestOptions = {
            method: 'GET',
            headers:  { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.getItem('token') },
        };
        // const urlFiles='http://localhost:1337/data';
        fetch(url, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                tempItems =  result.map((e) => <button key={e.filename.toString()} onClick={(f) => this.openContent(e.filename.toString(), f)}> {e.filename} </button>);
                this.setState({
                    listItems: tempItems
                });
            },
            (error) => {
                console.log(error);
            }
        )
    }

    componentWillUnmount() {
        socket.on('disconnect', function() {
            console.info("Disconnected");
        });

    }


    togglePop() {
        this.setState({
            seen: !this.state.seen
        });
    };

    newFile(e) {
        e.preventDefault();
        this.setState({
            currentFile: "",
            currentContent: "",
            isOpenedContent: false});
        };

        async openContent(filename, e) {
            e.preventDefault();
            let temp;
            let urlOne = url + "/" + filename;
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.token }
            };
            await fetch(urlOne, requestOptions)
            .then(response => response.json())
            .then(function(data) {
                temp = data;
            });

            content = temp.content;
            this.setState({
                currentFile: filename,
                currentContent: content,
                isOpenedContent: true
            });
            // create a room for this opened file
            socket.emit("create", filename);
            console.log("create a room for file: ", filename);
        }


        async saveFile(e) {
            e.preventDefault();

            const filename = this.state.currentFile;
            // if it is a new file go to filesave popup
            if (filename === "") {
                this.togglePop();
            } else {
                //Update a file
                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.token },
                    body: JSON.stringify({ filename: filename, content: window.editorData})
                };
                await fetch(url, requestOptions).then(response => response.json());
            }
        }

        async deleteFile(e) {
            // e.preventDefault();
            const filename = this.state.currentFile;

            if (filename === "") {
                alert("No file selected");
            } else {
                const requestOptions = {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.token },
                    body: JSON.stringify({ filename: filename })
                };
                await fetch(url, requestOptions).then(response => response.json());
                this.props.history.push("/file");
            }
        }

        onKeyUpDown(e) {
            e.preventDefault();
            let data = {
                _id: this.state.currentFile,
                html: editorData
            };
            //  send an update from the client to the server
            socket.emit("doc", data);
        }

        render= () => {
            const { users } = this.state;

            return (
                <div className="App">
                <form>
                <button type="primary"  className="savebutton" onClick={this.newFile}>New File </button>
                <button type="primary"  className="savebutton" onClick={this.deleteFile}>Delete File </button>
                <button type="primary"  className="savebutton" onClick={this.saveFile}>Save File </button>
                </form>
                <p>Logined as: {sessionStorage.getItem('email')}</p>
                <div className="filelist">Your files: {this.state.listItems}</div>
                <div className="isOpenedContent">{this.state.isOpenedContent ?
                    <form onSubmit={this.handleSubmit}>
                    <label>
                    Select allowed user:
                    <select  value={this.state.value} onChange={this.handleChange}>
                    <option value="">Select a user</option>
                    {users.map((e,i) => (
                        <option key={i} value={e.email}>{e.email}</option>)
                    )}
                    </select>
                    <input className="savebutton" type="submit" value="Submit" />
                    </label>
                    </form>
                    : null }</div>
                    <div>{this.state.seen ? <PopUp toggle={this.togglePop} /> : null}</div>

                    <p> Current File: {this.state.currentFile}</p>

                    <div className="text-editor" onKeyUp={this.onKeyUpDown}>
                    <CKEditor
                    editor={ ClassicEditor }
                    config={{
                        toolbar: ['undo', 'redo', '|', 'heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
                        'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed']
                    }}
                    data = { this.state.currentContent }
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        // console.log( 'Editor is ready to use!', editor );
                    } }

                    onChange={ ( event, editor ) => {
                        editorData = editor.getData();
                        window.editorData = editorData;
                    } }
                    />
                    </div>
                    </div>
                );
            }
        }

        // export default FileDocs;
