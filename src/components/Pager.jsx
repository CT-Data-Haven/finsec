import React from 'react';
import { Pagination } from 'react-bootstrap';
// import '../styles/Pager.css';


export default class Pager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePage: 1
        };
        this.onPageChange = props.onPageChange.bind(this);
    }

    render() {
        return (
            <div className="Pager center-block">
                <Pagination
                    prev
                    next
                    first
                    last
                    ellipsis
                    onSelect={this.onPageChange}
                    items={this.props.items}
                    maxButtons={4}
                    activePage={this.props.activePage}
                    bsSize="small"
                />
            </div>
        )
    }

}
