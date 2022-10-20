import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItList } from "./shortlist-it-list";
import { ShortlistItListCriteriaList } from "./shortlist-it-list-criteria-list";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListHeaderProps = {
    parent: ShortlistItList;
}

export class ShortlistItListHeader extends React.Component<ShortlistItListHeaderProps> {
    render() {
        return (
            <div className="d-flex flex-row justify-content-between">
                <div className="flex-grow-1 pe-1">{this.getTitleContent()}</div>
                <div className="text-center ps-1">{this.getMenuButtonContent()}</div>
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
                <>
                    <FloatingLabel controlId={`title-input-${this.list.id}`} label="List Title">
                        <Form.Control 
                            type="text" 
                            placeholder="enter title or description" 
                            defaultValue={this.list.title}
                            className="list-header-title-input" />
                    </FloatingLabel>
                    <ShortlistItListCriteriaList parent={this} />
                </>
            );
        } else {
            return <>{this.list.title}</>;
        }
    }

    getMenuButtonContent() {
        if (this.editing) {
            return (
                <div className="d-flex flex-column justify-content-evenly align-content-between h-100">
                    <ShortlistItTooltip id={`save-list-edits-${this.list.id}`} text="Save Changes">
                        <Button variant="success" onClick={() => this.saveEdits()}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`cancel-list-edits-${this.list.id}`} text="Cancel Edits">
                        <Button variant="warning" onClick={() => this.cancelEdits()}>
                            <BootstrapIcon icon="x-circle" />
                        </Button>
                    </ShortlistItTooltip>
                </div>
            );
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

    saveEdits(): void {
        this.parent.saveEdits();
    }

    cancelEdits(): void {
        this.parent.cancelEdits();
    }

    showDeleteConfirmation(): void {
        this.parent.parent.deleteList(this.list.id);
    }
}