import React from "react";
import { Card } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListHeader } from "./shortlist-it-list-header";

type ShortlistItListProps = {
    parent: ShortlistIt;
    list: Shortlist;
}

type ShortlistItListState = {
    editing: boolean;
}

export class ShortlistItList extends React.Component<ShortlistItListProps, ShortlistItListState> {
    constructor(props: ShortlistItListProps) {
        super(props);
        this.state = {
            editing: false
        };
    }
    
    render() {
        return (
            <Card className="m-1 min-width-300 max-width-700">
                <Card.Body className="d-flex flex-column justify-content-center align-content-center">
                    <ShortlistItListHeader parent={this} />
                    <ShortlistItListBody parent={this} />
                </Card.Body>
            </Card>
        );
    }

    get parent(): ShortlistIt {
        return this.props.parent
    }

    get list(): Shortlist {
        return this.props.list;
    }

    get editing(): boolean {
        return this.state.editing;
    }

    startEditing(): void {
        this.setState({editing: true});
    }

    doneEditing(): void {
        // TODO: save edits
        this.setState({editing: false});
    }

    archive(): void {
        this.list.archived = true;
        this.parent.forceUpdate();
    }

    unarchive(): void {
        this.list.archived = false;
        this.parent.forceUpdate();
    }

    expandAll(): void {
        
    }

    collapseAll(): void {

    }
}