import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { ShortlistEntry } from "./shortlist-entry";

export class ShortlistBody extends React.Component<{entries: Array<Entry>}> {
    render() {
        return (
            <ListGroup>
                {this.props.entries.map((entry: Entry) => 
                    <ShortlistEntry entry={entry} />
                )}
                <ListGroup.Item><Button variant="link" size="lg" onClick={() => this.displayAddEntryModal()}>+</Button></ListGroup.Item>
            </ListGroup>
        );
    }

    displayAddEntryModal() {

    }
}