import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
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
                <div className="flex-grow-1">{this.getTitleContent()}</div>
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
            return (
                <FloatingLabel controlId={`title-input-${this.list.id}`} label="List Title">
                    <Form.Control 
                        type="text" 
                        placeholder="enter title or description" 
                        defaultValue={this.list.title}
                        className="list-header-title-input" />
                </FloatingLabel>
            );
        } else {
            return <>{this.list.title}</>;
        }
    }

    getMenuButtonContent() {
        if (this.editing) {
            return <Button onClick={() => this.parent.doneEditing()}>Done</Button>;
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
            items.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => this.parent.unarchive()});
        } else {
            items.push({text: 'edit list', icon: 'pencil-square', action: () => this.parent.startEditing()});
            items.push({text: 'archive', icon: 'archive', action: () => this.parent.archive()});
        }
        items.push(
            {text: 'delete', icon: 'trash', action: () => this.showDeleteConfirmation()}
        );
        return items;
    }

    showDeleteConfirmation(): void {
        this.parent.parent.showDeleteConfirmation(this.list.id);
    }
}