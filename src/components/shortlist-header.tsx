import React from "react";
import { CloseButton, Col, Container, Row } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";

export class ShortlistHeader extends React.Component<Shortlist> {
    render() {
        return (
            <Container>
                <Row><Col xs={10}>{this.props.title}</Col><Col><CloseButton></CloseButton></Col></Row>
            </Container>
        );
    }
}