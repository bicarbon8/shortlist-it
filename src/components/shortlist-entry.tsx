import React from "react";
import { Badge, CloseButton, Col, ListGroupItem, Row } from "react-bootstrap";
import { Entry } from "../types/entries/entry";

export class ShortlistEntry extends React.Component<{entry: Entry}> {
    render() {
        return (
            <ListGroupItem variant="primary">
                <Row>
                    <Col><Badge pill={true}>{this.props.entry.ranking}</Badge></Col>
                    <Col xs="8">{this.props.entry.description}</Col>
                    <Col className="text-center"><CloseButton /></Col>
                </Row>
            </ListGroupItem>
        );
    }
}