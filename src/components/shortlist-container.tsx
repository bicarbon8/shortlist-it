import React from "react";
import { Container, Row } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { ShortlistBody } from "./shortlist-body";
import { ShortlistHeader } from "./shortlist-header";

export class ShortlistContainer extends React.Component<{data: Shortlist}> {
    render() {
        return (
            <Container className="col-lg-6 pb-4">
                <Row><ShortlistHeader title={this.props.data.title} /></Row>
                <Row><ShortlistBody entries={this.props.data.entries || new Array<Entry>()}></ShortlistBody></Row>
            </Container>
        );
    }
}