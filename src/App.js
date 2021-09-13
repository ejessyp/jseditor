import React, { Component } from 'react';
import PopUp from "./PopUp";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './App.css';

var editorData;
var url='https://jsramverk-editor-qipa19.azurewebsites.net/data';
const headers = { 'Content-Type': 'application/json' };
var content;
var tempItems;
// var listItems;


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentFile: "",
            currentContent: "",
            listItems:[],
            seen: false
        };
        this.openFile = this.openFile.bind(this);
        this.openContent = this.openContent.bind(this);
        this.saveFile = this.saveFile.bind(this);
        this.newFile = this.newFile.bind(this);
        this.deleteFile = this.deleteFile.bind(this);
        this.togglePop = this.togglePop.bind(this);
    };

    togglePop() {
        this.setState({
            seen: !this.state.seen
        });
    };

    newFile(e) {
        e.preventDefault();
        this.setState({
            currentFile: "",
            currentContent: ""});
        };

    async openContent(filename, e) {
        e.preventDefault();
        let temp;
        let urlOne = url + "/" + filename;
        await fetch(urlOne, { headers })
        .then(response => response.json())
        .then(function(data) {
            // tempListItems = data.map((e) => "   <button onClick=openContent("+ e.filename.toString() + " )>" + e.filename.toString() + " </button>");
            // element.innerHTML = tempListItems;
            temp = data;
        });

        content = temp.content;
        this.setState({
            currentFile: filename,
        currentContent: content});
    };

    async saveFile(e) {
        e.preventDefault();

        const filename = this.state.currentFile;
        if (filename === "") {
            this.togglePop();
        } else {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: filename, content: window.editorData })
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ filename: filename })
            };
            await fetch(url, requestOptions).then(response => response.json());
        }
    }

    async openFile(e) {
        e.preventDefault();
        // const element = document.querySelector('#filelist');
        let temp;

        await fetch(url, { headers })
        .then(response => response.json())
        .then(function(data) {
            // tempListItems = data.map((e) => "   <button onClick=openContent("+ e.filename.toString() + " )>" + e.filename.toString() + " </button>");
            // element.innerHTML = tempListItems;
            temp = data;
        });
        tempItems =  temp.map((e) => <button key={e.filename.toString()} onClick={(f) => this.openContent(e.filename.toString(), f)}> {e.filename} </button>);
        console.log(tempItems);
        if (typeof(tempItems) !== 'undefined' && tempItems != null) {
            this.setState({listItems: tempItems});
        } else {
            console.log('Undefined or Null')
        };
    }



    render() {
        return (
            <div className="App">
                <h2>Using CKEditor 5 build in React</h2>

                <form>
                <button type="primary"  className="savebutton" onClick={this.newFile}>New File </button>
                <button type="primary"  className="savebutton" onClick={this.openFile}>Open File </button>
                <button type="primary"  className="savebutton" onClick={this.deleteFile}>Delete File </button>
                <button type="primary"  className="savebutton" onClick={this.saveFile}>Save File </button>
                </form>
                <ul >{this.state.listItems}</ul>

                <div>
                {this.state.seen ? <PopUp toggle={this.togglePop} /> : null}
                </div>
                <p>Current File: {this.state.currentFile}</p>
                <CKEditor
                    editor={ ClassicEditor }
                    // data="<p>Hello from CKEditor 5!</p>"
                    data = { this.state.currentContent }
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        editorData = editor.getData();
                        window.editorData = editorData;
                        console.log( { event, editor, editorData } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
            </div>
        );
    }
}

export default App;
