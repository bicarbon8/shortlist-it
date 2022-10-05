import React from "react";
import { Button, Col, ListGroup, ListGroupItem, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistEntry } from "./shortlist-entry";
import { ShortlistTooltip } from "./shortlist-tooltip";

export class ShortlistBody extends React.Component<{entries: Array<Entry>}> {
    render() {
        return (
            <ListGroup>
                {this.props.entries.map((entry: Entry) => 
                    <ShortlistEntry key={entry.description} entry={entry} />
                )}
                <ListGroupItem key="add_new_entry">
                    <Row className="justify-content-lg-center">
                        <Col xs="auto">
                            <ShortlistTooltip id="add_entry" text="add new entry">
                                <BootstrapIcon icon="plus-lg" onClick={() => this.displayAddEntryModal()} />
                            </ShortlistTooltip>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
        );
    }

    displayAddEntryModal() {

    }
}