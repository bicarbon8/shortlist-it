import React from "react";
import { Card } from "react-bootstrap";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListHeader } from "./shortlist-it-list-header";
import { Shortlist } from "../types/shortlist";

type ShortlistItListProps = {
    app: ShortlistIt;
    listId: string;
}

export class ShortlistItList extends React.Component<ShortlistItListProps> {
    render() {
        const bgColor = (this.list.archived) ? 'bg-secondary' : '';
        return (
            <Card id={this.props.listId} className={`m-1 min-width-300 max-width-700 ${bgColor}`}>
                <Card.Body className="d-flex flex-column justify-content-center align-content-center">
                    <ShortlistItListHeader app={this.app} listId={this.props.listId} />
                    <ShortlistItListBody app={this.app} listId={this.props.listId} />
                </Card.Body>
            </Card>
        );
    }

    get app(): ShortlistIt {
        return this.props.app
    }

    get list(): Shortlist {
        return this.app.getList(this.props.listId);
    }
}