import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListEntry } from "./shortlist-it-list-entry";

type ShortlistItListBodyProps = {
    app: ShortlistIt;
    list: Shortlist;
}

export class ShortlistItListBody extends React.Component<ShortlistItListBodyProps> {
    render() {
        return (
            <ListGroup>
                {this.props.list.entries.map((entry: Entry) => <ShortlistItListEntry key={entry.id} app={this.app} listId={this.props.list.id} entryId={entry.id} />)}
                {this.getAddEntryButton()}
            </ListGroup>
        );
    }

    get app(): ShortlistIt {
        return this.props.app;
    }

    getAddEntryButton() {
        if (this.props.list.archived) {
            return <></>;
        } else {
            return (
                <ListGroupItem 
                    variant="dark"
                    key="add_new_entry" 
                    onClick={() => this.app.addNewEntry(this.props.list.id)}
                    className="d-flex justify-content-center clickable">
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Entry
                </ListGroupItem>
            );
        }
    }
}