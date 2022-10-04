import React from "react";
import { Button, Col, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { ShortlistEntry } from "./shortlist-entry";

export class ShortlistBody extends React.Component<{entries: Array<Entry>}> {
    render() {
        return (
            <ListGroup>
                {this.props.entries.map((entry: Entry, i: number) => 
                    <ShortlistEntry entry={entry} ranking={i+1} />
                )}
                <ListGroupItem>
                    <Row className="justify-content-md-center">
                        <Col xs={2}><Button variant="outline-primary" size="lg" onClick={() => this.displayAddEntryModal()}>+</Button></Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
        );
    }

    displayAddEntryModal() {

    }
}