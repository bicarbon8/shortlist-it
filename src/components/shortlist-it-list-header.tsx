import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListCriteriaList } from "./shortlist-it-list-criteria-list";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListHeaderProps = {
    app: ShortlistIt;
    listId: string;
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

    get app(): ShortlistIt {
        return this.props.app;
    }

    get list(): Shortlist {
        return this.app.getList(this.props.listId);
    }

    getTitleContent() {
        if (this.app.isEditingList(this.list.id)) {
            return (
                <>
                    <FloatingLabel controlId={`title-input-${this.list.id}`} label="List Title">
                        <Form.Control 
                            type="text" 
                            placeholder="enter title or description" 
                            defaultValue={this.list.title}
                            className="list-header-title-input" />
                    </FloatingLabel>
                    <ShortlistItListCriteriaList app={this.app} parent={this} />
                </>
            );
        } else {
            return <>{this.list.title}</>;
        }
    }

    getMenuButtonContent() {
        if (this.app.isEditingList(this.list.id)) {
            return (
                <div className="d-flex flex-column justify-content-evenly align-content-start">
                    <ShortlistItTooltip id={`save-list-edits-${this.list.id}`} text="Save Changes" className="mb-2">
                        <Button variant="success" onClick={() => this.app.saveListEdits(this.props.listId)}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`cancel-list-edits-${this.list.id}`} text="Cancel Edits" className="mt-2">
                        <Button variant="warning" onClick={() => this.app.cancelListEdits(this.props.listId)}>
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
            items.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => this.app.unarchiveList(this.props.listId)});
        } else {
            items.push({text: 'edit list', icon: 'pencil-square', action: () => this.app.startEditingList(this.props.listId)});
            items.push({text: 'archive', icon: 'archive', action: () => this.app.archiveList(this.props.listId)});
        }
        items.push(
            {text: 'delete', icon: 'trash', action: () => this.app.deleteList(this.props.listId)}
        );
        return items;
    }
}