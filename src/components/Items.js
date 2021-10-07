import React, { Component } from "react";

class Items extends Component {

    render() {
        console.log("items", this.props);

        return (
            <div>
            {
                this.props.items.map(item => {
                    return <button key={item.filename.toString()} onClick={(f) => this.props.openContent(item.filename.toString(), f)}> {item.filename} </button>;
                    // return <Item key={item.id} data={item} />
                })
            }
            </div>
        );
    }
}

export default Items
