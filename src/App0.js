import './App.css';
import React, { Component } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
let editorData;

class App extends Component {

    handleSubmit(e) {
        e.preventDefault();
        console.log('You clicked save.', editorData);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: 'filetesttest', content: editorData })
        };
        fetch('https://jsramverk-editor-qipa19.azurewebsites.net/data', requestOptions)
        .then(response => response.json());
    }

    render() {
        return (
            <div className="App">
                <h2>Using CKEditor 5 build in React</h2>
                <form onSubmit={this.handleSubmit}>
                <input className="savebutton" type="submit" value="New File" id="save" />
                <input className="savebutton" type="submit" value="Open File" id="open" />
                <input className="savebutton" type="submit" value="Save As" id="saveAs" />
                <CKEditor
                    editor={ ClassicEditor }
                    data="<p>Hello from CKEditor 5!</p>"
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
