import React, { MouseEventHandler } from "react";
import { ListGroup, ListGroupItem, OverlayTrigger, Popover, PopoverProps } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";

type ShortlistItMenuProps = {
    id: string,
    headerText?: string,
    menuItems: Array<ShortlistItMenuItem>,
    children: React.ReactElement
};

export type ShortlistItMenuItem = {
    text: string,
    icon: string,
    action: MouseEventHandler<Element>,
};

export class ShortlistItMenu extends React.Component<ShortlistItMenuProps> {
    popover = (props: JSX.IntrinsicAttributes & PopoverProps & React.RefAttributes<HTMLDivElement>) => {
        const id = this.props.id;
        const head = (this.props.headerText) ? this.renderHeader(this.props.headerText) : <></>;
        const menuItems = this.props.menuItems || new Array<ShortlistItMenuItem>();
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
                rootClose
                overlay={this.popover}>
                <span className="clickable">{this.props.children}</span>
            </OverlayTrigger>
        );
    }

    renderHeader(text: string) {
        return (<Popover.Header as="h3">{text}</Popover.Header>);
    }

    renderListItem(item: ShortlistItMenuItem) {
        return (
            <ListGroupItem key={item.text} className="d-flex clickable" onClick={(evt) => {
                document.body.click();
                item.action(evt);
            }}>
                <div className="w-100">{item.text}: &nbsp;</div>
                <div className="flex-shrink-0"><BootstrapIcon icon={item.icon} /></div>
            </ListGroupItem>
        );
    }
}