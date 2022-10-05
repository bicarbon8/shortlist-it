import React from "react";
import { Button, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { ShortlistEntry } from "./shortlist-entry";

export class ShortlistBody extends React.Component<{entries: Array<Entry>}> {
    render() {
        return (
            <ListGroup>
                {this.props.entries.map((entry: Entry, i: number) => 
                    <ShortlistEntry key={i} entry={entry} ranking={i+1} />
                )}
                <ListGroupItem key="add_new_entry">
                    <Row className="justify-content-lg-center">
                        <Col xs="auto"><Button variant="outline-primary" size="lg" onClick={() => this.displayAddEntryModal()}>+</Button></Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
        );
    }

    displayAddEntryModal() {

    }
}