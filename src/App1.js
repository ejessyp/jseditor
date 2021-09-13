import './App.css';
import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
var editorData;
const url='https://jsramverk-editor-qipa19.azurewebsites.net/data';
const headers = { 'Content-Type': 'application/json' };
var content;
var current_file;
var tempListItems;
var listItems;


//
function openContent(filename) {
    content = "content";
    current_file = filename;
    console.log(current_file);
}

class App extends Component {


    newFile(e) {
        e.preventDefault();
        console.log('You clicked save.', editorData);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: 'file17', content: editorData })
        };
        fetch(url, requestOptions)
        .then(response => response.json());
    }

    async  openFile(e) {
        e.preventDefault();

        // function getData() {
        //     return new Promise((resolve, reject) => {
        //         fetch(url, { headers })
        //         .then(response => {
        //             return response.json();
        //         }).then(data => {
        //             resolve(data);
        //             console.log(data);
        //         })
        //     })
        // }
        // // const getData = () => fetch(url, { headers }).then(response => response.json()).then(({data}) => data);
        //
        // let listItems;
        // getData().then(data => {
        //     listItems = data.map((e) => <li key={e.filename.toString()}> {e.filename} </li>);
        //     console.log(listItems);
        // });



        const element = document.querySelector('#filelist');
        let temp;

        await fetch(url, { headers })
        .then(response => response.json())
        .then(function(data) {
            // tempListItems = data.map((e) => "   <button onClick=openContent("+ e.filename.toString() + " )>" + e.filename.toString() + " </button>");
            // element.innerHTML = tempListItems;
            temp = data;

        });

         listItems = temp.map((e) => <li key={e.filename.toString()}> {e.filename} </li>);
         console.log(listItems);
    }



    render() {
        return (
            <div className="App">
                <h2>Using CKEditor 5 build in React</h2>
                <form>
                <button type="primary"  className="savebutton" onClick={this.newFile}>New File </button>
                <button type="primary"  className="savebutton" onClick={this.openFile}>Open File </button>

                <ul >{ console.log(listItems)}</ul>

                <p>{current_file}</p>
                <CKEditor
                    editor={ ClassicEditor }
                    // data="<p>Hello from CKEditor 5!</p>"
                    data = { content }
                    onReady={ editor => {
                        // You can store the "editor" and use when it is needed.
                        console.log( 'Editor is ready to use!', editor );
                    } }
                    onChange={ ( event, editor ) => {
                        editorData = editor.getData();
                        console.log( { event, editor, editorData } );
                    } }
                    onBlur={ ( event, editor ) => {
                        console.log( 'Blur.', editor );
                    } }
                    onFocus={ ( event, editor ) => {
                        console.log( 'Focus.', editor );
                    } }
                />
                </form>
            </div>
        );
    }
}

export default App;
