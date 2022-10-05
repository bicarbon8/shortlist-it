import React from "react";
import { Badge, Col, ListGroupItem, Row } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistTooltip } from "./shortlist-tooltip";

export class ShortlistEntry extends React.Component<{entry: Entry}> {
    render() {
        return (
            <ListGroupItem variant="primary">
                <Row>
                    <Col><Badge pill={true}>{this.props.entry.ranking}</Badge></Col>
                    <Col xs="8">{this.props.entry.description}</Col>
                    <Col className="text-center">
                        <ShortlistTooltip id={this.props.entry.description} text="open list entry menu">
                            <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                        </ShortlistTooltip>
                    </Col>
                </Row>
            </ListGroupItem>
        );
    }
}