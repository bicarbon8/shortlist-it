import React from "react";
import { Badge, CloseButton, ListGroup } from "react-bootstrap";
import { Entry } from "../types/entries/entry";

export class ShortlistEntry extends React.Component<{entry: Entry}> {
    render() {
        return (
            <ListGroup.Item><Badge></Badge> {this.props.entry.description} <CloseButton /></ListGroup.Item>
        );
    }
}