import React from "react";
import { CloseButton, Col, Container } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";

export class ShortlistHeader extends React.Component<Shortlist> {
    render() {
        return (
            <Container fluid="xs">
                <Col xs={11}>{this.props.title}</Col><Col><CloseButton></CloseButton></Col>
            </Container>
        );
    }
}