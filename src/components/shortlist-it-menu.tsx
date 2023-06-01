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

function renderHeader(text: string) {
    return (<Popover.Header as="h3">{text}</Popover.Header>);
}

function renderListItem(item: ShortlistItMenuItem) {
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

export function ShortlistItMenu(props: ShortlistItMenuProps) {
    const popover = (popoverProps: JSX.IntrinsicAttributes & PopoverProps & React.RefAttributes<HTMLDivElement>) => {
        const id = props.id;
        const head = (props.headerText) ? renderHeader(props.headerText) : <></>;
        const menuItems = props.menuItems || new Array<ShortlistItMenuItem>();
        return (
            <Popover id={id} {...popoverProps}>
                {head}
                <Popover.Body>
                    <ListGroup>
                        {menuItems.map(item => renderListItem(item))}
                    </ListGroup>
                </Popover.Body>
            </Popover>
        );
    }
    
    return (
        <OverlayTrigger
            trigger="click"
            placement="auto"
            rootClose
            overlay={popover}>
            <span className="clickable">{props.children}</span>
        </OverlayTrigger>
    );
}