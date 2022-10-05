import React, { useState } from "react";
import { Badge, Col, Collapse, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistTooltip } from "./shortlist-tooltip";

export class ShortlistEntry extends React.Component<{entry: Entry}, {show: boolean}> {
    constructor(props) {
        super(props);
        this.state = {show: false};
    }
    
    setShow(show: boolean): void {
        this.setState({show: show});
    }
    
    render() {
        const entry = this.props.entry;
        const criteriaKeys = Array.from(entry.values?.keys() || new Array<string>());

        return (
            <ListGroupItem variant="primary">
                <Row>
                    <Col><Badge pill={true}>{entry.ranking}</Badge></Col>
                    <Col xs="8" onClick={() => this.setShow(!this.state.show)} aria-expanded={this.state.show}>{entry.description}</Col>
                    <Col className="text-center">
                        <ShortlistTooltip id={entry.description} text="open list entry menu">
                            <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                        </ShortlistTooltip>
                    </Col>
                    <Collapse in={this.state.show}>
                        <ListGroup>
                            {criteriaKeys.map((key: string) => (
                                <ListGroupItem variant="outline-primary" key={key}>
                                    <span>{key}:</span> {(Array.isArray(entry.values?.get(key))) ? (entry.values?.get(key) as Array<string>).map(str => (
                                        <Badge key={str}>{str}</Badge>
                                    )) : <Badge>{entry.values?.get(key)}</Badge>}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Collapse>
                </Row>
            </ListGroupItem>
        );
    }
}