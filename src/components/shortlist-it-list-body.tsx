import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItList } from "./shortlist-it-list";
import { ShortlistItListCriteriaList } from "./shortlist-it-list-criteria-list";
import { ShortlistItListEntry } from "./shortlist-it-list-entry";

type ShortlistItListBodyProps = {
    parent: ShortlistItList;
}

export class ShortlistItListBody extends React.Component<ShortlistItListBodyProps> {
    render() {
        return (
            <ListGroup>
                {this.getCriteriaList()}
                {this.list.entries.map((entry: Entry) => <ShortlistItListEntry key={entry.id} parent={this} entry={entry} />)}
                {this.getAddEntryButton()}
            </ListGroup>
        );
    }

    get parent(): ShortlistItList {
        return this.props.parent;
    }

    get list(): Shortlist {
        return this.parent.list;
    }

    get editing(): boolean {
        return this.parent.editing;
    }

    getCriteriaList() {
        if (this.editing) {
            return <ListGroupItem variant="warning"><ShortlistItListCriteriaList parent={this} /></ListGroupItem>;
        } else {
            return <></>;
        }
    }

    getAddEntryButton() {
        if (this.list.archived) {
            return <></>;
        } else {
            return (
                <ListGroupItem 
                    variant="dark"
                    key="add_new_entry" 
                    onClick={() => this.startAddNewEntry()}
                    className="d-flex justify-content-center clickable">
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Entry
                </ListGroupItem>
            );
        }
    }

    startAddNewEntry(): void {
        // TODO: append new ListGroupItem to bottom of list in Edit mode
    }

    doneAddNewEntry(): void {
        // TODO: save new entry to list and localstorage
    }
}