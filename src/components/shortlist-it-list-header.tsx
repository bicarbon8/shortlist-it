import React from "react";
import { Button, Form } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItList } from "./shortlist-it-list";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";

type ShortlistItListHeaderProps = {
    parent: ShortlistItList;
}

export class ShortlistItListHeader extends React.Component<ShortlistItListHeaderProps> {
    render() {
        return (
            <div className="d-flex flex-row justify-content-between">
                <div className="xs-10">{this.getTitleContent()}</div>
                <div className="px-1"> </div>
                <div className="text-center">{this.getMenuButtonContent()}</div>
            </div>
        );
    }

    get parent(): ShortlistItList {
        return this.props.parent;
    }

    get list(): Shortlist {
        return this.parent.list;
    }

    get editing(): boolean {
        return this.parent.editing;
    }

    getTitleContent() {
        if (this.editing) {
            return <Form.Control type="text" placeholder="list title"></Form.Control>;
        } else {
            return <>{this.list.title}</>;
        }
    }

    getMenuButtonContent() {
        if (this.editing) {
            return <Button onClick={this.doneEditing}>Done</Button>;
        } else {
            return (
                <ShortlistItMenu 
                    id={`menu-${this.list.id}`}
                    headerText="List Menu"
                    menuItems={this.getMenuItems()}>
                    <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                </ShortlistItMenu>
            );
        }
    }

    getMenuItems(): Array<ShortlistItMenuItem> {
        const items = new Array<ShortlistItMenuItem>();
        if (this.list.archived) {
            items.push({text: 'restore', icon: 'arrow-counterclockwise', action: this.unarchive});
        } else {
            items.push({text: 'edit', icon: 'pencil-square', action: this.startEditing});
            items.push({text: 'archive', icon: 'archive', action: this.archive});
        }
        items.push(
            {text: 'expand all', icon: 'chevron-bar-expand', action: this.parent.expandAll},
            {text: 'collapse all', icon: 'chevron-bar-contract', action: this.parent.collapseAll},
            {text: 'delete', icon: 'trash', action: this.showDeleteConfirmation}
        );
        return items;
    }

    startEditing(): void {

    }

    doneEditing(): void {

    }

    archive(): void {

    }

    unarchive(): void {

    }

    showDeleteConfirmation(): void {
        this.parent.parent.showDeleteConfirmation(this.list.id);
    }
}