import React from "react";
import { Badge, CloseButton, Col, ListGroupItem, Row } from "react-bootstrap";
import { Entry } from "../types/entries/entry";

export class ShortlistEntry extends React.Component<{entry: Entry, ranking: number}> {
    render() {
        return (
            <ListGroupItem key={this.props.entry.description} variant="primary">
                <Row>
                    <Col><Badge pill={true}>{this.props.ranking}</Badge></Col>
                    <Col xs="8">{this.props.entry.description}</Col>
                    <Col className="text-center"><CloseButton /></Col>
                </Row>
            </ListGroupItem>
        );
    }
}