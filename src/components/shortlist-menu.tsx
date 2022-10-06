import React, { MouseEventHandler } from "react";
import { Col, ListGroup, ListGroupItem, OverlayTrigger, Popover, Row } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";

type ShortlistMenuProps = {
    id: string,
    headerText?: string,
    menuItems: Array<ShortlistMenuItem>,
    children: React.ReactElement
};

export type ShortlistMenuItem = {
    text: string,
    icon: string,
    action: MouseEventHandler<Element>,
};

export class ShortlistMenu extends React.Component<ShortlistMenuProps> {
    popover = (props) => {
        const id = this.props.id;
        const head = (this.props.headerText) ? this.renderHeader(this.props.headerText) : <></>;
        const menuItems = this.props.menuItems || new Array<ShortlistMenuItem>();
        return (
            <Popover id={id} {...props}>
                {head}
                <Popover.Body>
                    <ListGroup>
                        {menuItems.map(item => this.renderListItem(item))}
                    </ListGroup>
                </Popover.Body>
            </Popover>
        );
    }
    
    render() {
        return (
            <OverlayTrigger
                trigger="click"
                placement="auto"
                overlay={this.popover}>
                <span>{this.props.children}</span>
            </OverlayTrigger>
        );
    }

    renderHeader(text: string) {
        return (<Popover.Header as="h3">{text}</Popover.Header>);
    }

    renderListItem(item: ShortlistMenuItem) {
        return (
            <ListGroupItem key={item.text} onClick={item.action}>
                <Row>
                    <Col>{item.text}:</Col>
                    <Col><BootstrapIcon icon={item.icon} /></Col>
                </Row>
            </ListGroupItem>
        );
    }
}