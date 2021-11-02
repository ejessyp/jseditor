import React, { Component } from 'react';
import PopUp from "./PopUp";
import InvitePopUp from "./InvitePopUp";
import Items from "./Items";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MonacoEditor from "@monaco-editor/react";
import '../App.css';
import  { socket, url, urlUser, urlGraph, urlPdf } from './url.js';

//  import socketIOClient from "socket.io-client";

var editorData;


class FileDocs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            currentFile: "",
            currentContent: "",
            items: [],
            isLoading: false,
            mode: "",
            isCodeModeOn: false,
            seen: false,
            inviteSeen: false,
            isOpenedContent: false,
            output: ""
        };

        this.openContent = this.openContent.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.newFile = this.newFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.togglePop = this.togglePop.bind(this);
        this.execute = this.execute.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.toggleInvitePop = this.toggleInvitePop.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onKeyUpDown = this.onKeyUpDown.bind(this);
        this.handler = this.handler.bind(this);
        this.createPdf = this.createPdf.bind(this);
    };


    togglePop() {
        this.setState({
            seen: !this.state.seen
        });
    };


    async execute() {
        var data = {
            code: btoa(this.state.currentContent)
        };
        let temp;
        await fetch("https://execjs.emilfolino.se/code", {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        })
        .then(function (response) {
            return response.json();
        })
        .then(function(result) {
            let decodedOutput = atob(result.data);
            temp = decodedOutput;
            console.log(temp);
        });
        console.log(temp);
        this.setState({
            output: temp
        });
    }

    toggleMode = () => {
        this.setState(state=>({
            isCodeModeOn: !state.isCodeModeOn
        }));
    }

    handleEditorChange (value, event) {
        this.setState({
            currentContent: value
        });
        console.log("here is the current model value:", value);
    }

    //change itemss state when saving a file from popup so to re-render filelist
    handler(item) {
        console.log(item);
        let items = this.state.items;
        items.push(item);
        this.setState({
            items: items,
            currentFile: item.filename,
            isOpenedContent: true
        })
    }

    toggleInvitePop() {
        this.setState({
            inviteSeen: !this.state.inviteSeen
        });
    };

    //change items
    inviteHandler(item) {
        console.log(item);
        let items = this.state.items;
        items.push(item);
        this.setState({
            items: items,
            currentFile: item.filename,
            isOpenedContent: true
        })
    }

    async createPdf(e) {
        e.preventDefault();
        // console.log(this.state.currentContent);
        const requestOptions = {
            method: 'POST',
            headers : {
                'Content-Type': 'text/plain;charset=UTF-8',
                'Accept': 'application/pdf',
            },
            body: this.state.currentContent

        };
        const  response = await fetch(urlPdf, requestOptions);
        response.arrayBuffer().then(function(buffer) {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(
                new Blob([buffer], { type: 'application/pdf' })
            );
            link.download = 'customName.pdf';
            link.click();
            link.remove();
        });
    }

    handleChange(event) {
        this.setState({value: event.target.value});
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


        // get all the files which belong to this logined user
        // requestOptions = {
        //     method: 'GET',
        //     headers:  { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.getItem('token') },
        // };
        //
        // fetch(url, requestOptions)
        // .then(res => res.json())
        // .then(
        //     (result) => {
        //         tempItems =  result.map((e) => <button key={e.filename.toString()} onClick={(f) => this.openContent(e.filename.toString(), f)}> {e.filename} </button>);
        //         this.setState({
        //             listItems: tempItems
        //         });
        //     },
        //     (error) => {
        //         console.log(error);
        //     }
        // );

        // get all the files which belong to this logined user by graphql
        console.log("files doc", urlGraph);
        const owner = await sessionStorage.getItem("email");
        await fetch(urlGraph, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                "x-access-token": await sessionStorage.getItem('token')
            },
            body: JSON.stringify({ query: `{ files (owner: "${owner}")  {filename} }` })
        })
        .then(r => r.json())
        .then((result) => {
            console.log(result);
            this.setState({
                items: result.data.files
            });
        });
    }

    // componentWillUnmount() {
    //     socket.on('disconnect', function() {
    //         console.info("Disconnected");
    //     });
    // }


    newFile(e) {
        e.preventDefault();
        this.setState({
            currentFile: "",
            currentContent: "",
            isCodeModeOn: false,
            isOpenedContent: false});
    };

    async openContent(filename, e) {
        e.preventDefault();
        let temp;
        let urlOne = url + "/" + filename;
        console.log("opencontent", sessionStorage.token);
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.token }
        };
        await fetch(urlOne, requestOptions)
        .then(response => response.json())
        .then(function(data) {
            temp = data;
        });
        let isCodeModeOn;
        if (temp.mode==="text") {
            isCodeModeOn = false
        }
        if (temp.mode==="code") {
            isCodeModeOn = true
        }
        this.setState({
            currentFile: filename,
            currentContent: temp.content,
            isOpenedContent: true,
            mode: temp.mode,
            isCodeModeOn: isCodeModeOn
        });
        // create a room for this opened file
        socket.emit("create", filename);
        console.log("create a room for file: ", filename);
    }


    async saveFile(e) {
        e.preventDefault();
        let mode;
        const filename = this.state.currentFile;
        if (this.state.isCodeModeOn) {
            mode = "code"
        } else {
            mode = "text"
        }
        console.log("mode", mode);
        // if it is a new file go to filesave popup
        if (filename === "") {
            this.togglePop();
        } else {
            //Update a file
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.token },
                body: JSON.stringify({ filename: filename, content: this.state.currentContent, mode: mode})
            };
            await fetch(url, requestOptions).then(response => response.json());
        }
    }

    async deleteFile(e) {
        e.preventDefault();
        const filename = this.state.currentFile;
        console.log("delete file", url, filename);

        if (filename === "") {
            alert("No file selected");
        } else {
            // console.log(sessionStorage.token);
            const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', "x-access-token": await sessionStorage.token },
                body: JSON.stringify({ filename: filename })
            };
            await fetch(url, requestOptions)
            .then((res) => {
                // if delete is ok, update the items in the this.state to re-render the filelist
                if (res.status === 204) {
                    const itemsFiltered = this.state.items.filter(function(e) {return e.filename !== filename });
                    // console.log("items after delete", itemsFiltered);
                    this.setState(
                        {
                            items: itemsFiltered,
                            isLoading: false,
                            currentFile: "",
                            currentContent: "",
                            isOpenedContent: false
                        })
                    };
                })
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
            let mode;
            if (this.state.isCodeModeOn) {
                mode ="Text Mode"
            } else {
                mode ="Code Mode"
            }


            return (
                <div className="App">
                <form>
                <button type="primary"  className="savebutton" onClick={this.newFile}>New File </button>
                <button type="primary"  className="savebutton" onClick={this.deleteFile}>Delete File </button>
                <button type="primary"  className="savebutton" onClick={this.saveFile}>Save File </button>
                </form>
                <div>{this.state.isOpenedContent ?
                    <div>
                    <button type="primary"  className="savebutton" onClick={this.createPdf}>Create Pdf</button>
                    <button type="primary"  className="savebutton" onClick={this.toggleInvitePop}>Share</button>
                    <button type="primary"  className="savebutton" onClick={this.toggleMode}>{mode}  </button>
                    </div>
                    : null }
                    </div>

                    <p>Logined as: {sessionStorage.getItem('email')}</p>

                    <Items items={this.state.items} isLoading={this.state.isLoading} openContent={this.openContent}/>


                    <div>{this.state.seen ? <PopUp toggle={this.togglePop} handler={this.handler}/> : null}</div>
                    <div>{this.state.inviteSeen ? <InvitePopUp toggle={this.toggleInvitePop} handler={this.inviteHandler} file={this.state.currentFile} /> : null}</div>

                    <p> Current File: {this.state.currentFile}</p>
                    {this.state.isCodeModeOn?
                        <div className="wrap">
                        <div className="monaco-editor">
                        <MonacoEditor
                        height="50vh"
                        theme= "vs-dark"
                        defaultLanguage="javascript"
                        defaultValue={ this.state.currentContent }
                        onChange={this.handleEditorChange}
                        />
                        <button type="primary"  className="savebutton" onClick={this.execute}> Execute  </button>
                        </div>
                        <pre className="output">
                        <p>Output:</p>
                        <p>{this.state.output}</p>
                        </pre>
                        </div>
                        :
                        <div className="text-editor" onKeyUp={this.onKeyUpDown}>
                        <CKEditor
                        editor={ ClassicEditor }
                        config={{ckfinder: {
                            // Upload the images to the server using the CKFinder QuickUpload command
                            // You have to change this address to your server that has the ckfinder php connector
                            uploadUrl: 'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
                        }}}
                        data = { this.state.currentContent }
                        onReady={ editor => {
                            // You can store the "editor" and use when it is needed.
                            // console.log( 'Editor is ready to use!', editor );
                        } }

                        onChange={ ( event, editor ) => {
                            editorData = editor.getData();
                            window.editorData = editorData;
                            this.setState({
                                currentContent: editorData
                            })
                        } }
                        />
                        </div>
                    }
                    </div>
                );
            }
        }

        export default FileDocs;
