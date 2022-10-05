import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Icon from "react-bootstrap-icons";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistTooltip } from "./shortlist-tooltip";

export class ShortlistHeader extends React.Component<Shortlist> {
    render() {
        return (
            <Container>
                <Row>
                    <Col xs={10}>{this.props.title}</Col>
                    <Col className="text-center">
                        <ShortlistTooltip id={this.props.title} text="open list menu">
                            <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                            {/* TODO: await fix for: https://github.com/ismamz/react-bootstrap-icons/issues/39 */}
                            {/* <Icon.List color="royalBlue" size={40} title="toggle display of list" /> */}
                        </ShortlistTooltip>
                    </Col>
                </Row>
            </Container>
        );
    }
}