import React from "react";
import { Card } from "react-bootstrap";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListHeader } from "./shortlist-it-list-header";
import { Shortlist } from "../types/shortlist";

type ShortlistItListProps = {
    app: ShortlistIt;
    list: Shortlist;
}

export class ShortlistItList extends React.Component<ShortlistItListProps> {
    render() {
        const bgColor = (this.props.list.archived) ? 'bg-secondary' : '';
        return (
            <Card id={this.props.list.id} className={`m-1 min-width-300 max-width-700 ${bgColor}`}>
                <Card.Body className="d-flex flex-column justify-content-center align-content-center">
                    <ShortlistItListHeader app={this.props.app} list={this.props.list} />
                    <ShortlistItListBody app={this.props.app} list={this.props.list} />
                </Card.Body>
            </Card>
        );
    }
}