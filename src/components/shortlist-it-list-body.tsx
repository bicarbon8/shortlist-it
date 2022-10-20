import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListEntry } from "./shortlist-it-list-entry";

type ShortlistItListBodyProps = {
    app: ShortlistIt;
    listId: string;
}

export class ShortlistItListBody extends React.Component<ShortlistItListBodyProps> {
    render() {
        return (
            <ListGroup>
                {this.list.entries.map((entry: Entry) => <ShortlistItListEntry key={entry.id} app={this.app} listId={this.props.listId} entryId={entry.id} />)}
                {this.getAddEntryButton()}
            </ListGroup>
        );
    }

    get app(): ShortlistIt {
        return this.props.app;
    }

    get list(): Shortlist {
        return this.app.getList(this.props.listId);
    }

    getAddEntryButton() {
        if (this.list.archived) {
            return <></>;
        } else {
            return (
                <ListGroupItem 
                    variant="dark"
                    key="add_new_entry" 
                    onClick={() => this.app.addNewEntry(this.list.id)}
                    className="d-flex justify-content-center clickable">
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Entry
                </ListGroupItem>
            );
        }
    }
}