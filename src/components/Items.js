import React, { Component } from "react";

class Items extends Component {

    render() {
        console.log("items", this.props);

        return (
            <div>Your files:
            {
                this.props.items.map(item => {
                    return <button key={item.filename.toString()} onClick={(f) => this.props.openContent(item.filename.toString(), f)}> {item.filename} </button>;
                })
            }
            </div>
        );
    }
}

export default Items
