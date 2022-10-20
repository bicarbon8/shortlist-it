import React from "react";
import { Badge, Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListEntryValuesList } from "./shortlist-it-list-entry-values-list";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListEntryProps = {
    app: ShortlistIt;
    listId: string;
    entryId: string;
};

export class ShortlistItListEntry extends React.Component<ShortlistItListEntryProps> {
    constructor(props: ShortlistItListEntryProps) {
        super(props);
        this.state = {
            editing: (this.entry.description) ? false : true
        };
    }
    
    render() {
        const variant = (this.list.archived) ? 'dark' : 'primary';
        const badgeColour = (this.list.archived) ? 'bg-secondary' : 'bg-primary';

        return (
            <ListGroupItem variant={variant} className="d-flex flex-column justify-content-between align-content-between flex-wrap">
                <div className="d-flex flex-row justify-content-between w-100">
                    <div className="px-1"><Badge pill={true} className={badgeColour}>{this.entry.ranking}</Badge></div> 
                    <span className="xs-8 px-1 text-start flex-grow-1">
                        {this.getDescription()}
                        {this.getValuesList()}
                    </span> 
                    <span className="text-center px-1"> 
                        {this.getEditButton()}
                    </span>
                </div>
            </ListGroupItem>
        );
    }

    get app(): ShortlistIt {
        return this.props.app;
    }

    get list(): Shortlist {
        return this.app.getList(this.props.listId);
    }

    get entry(): Entry {
        return this.list.entries.find(e => e.id === this.props.entryId);
    }

    getDescription() {
        if (this.app.isEditingEntry(this.props.listId, this.props.entryId)) {
            return (
                <FloatingLabel controlId="entryDescription" label="Entry Description">
                    <Form.Control type="text" defaultValue={this.entry.description} />
                </FloatingLabel>
            )
        } else {
            const textColour = (this.list.archived) ? 'text-muted' : 'text-dark';
            return <span className={textColour}>{this.entry.description}</span>;
        }
    }

    getEditButton() {
        if (this.list.archived) {
            return <></>;
        } else {
            if (this.app.isEditingEntry(this.props.listId, this.props.entryId)) {
                return (
                    <div className="d-flex flex-column justify-content-evenly align-content-start">
                        <ShortlistItTooltip id={`save-changes-${this.entry.id}`} text="Save Changes" className="mb-2">
                            <Button variant="success" onClick={() => this.app.saveListEntryEdits(this.props.listId, this.props.entryId)}>
                                <BootstrapIcon icon="check" />
                            </Button>
                        </ShortlistItTooltip>
                        <ShortlistItTooltip id={`cancel-edits-${this.entry.id}`} text="Cancel Edits" className="my-2">
                            <Button variant="warning" onClick={() => this.app.cancelListEntryEdits(this.props.listId, this.props.entryId)}>
                                <BootstrapIcon icon="x-circle" />
                            </Button>
                        </ShortlistItTooltip>
                        <ShortlistItTooltip id={`delete-entry-${this.entry.id}`} text="Delete Entry" className="mt-2">
                            <Button variant="danger" onClick={() => this.app.deleteEntry(this.props.listId, this.props.entryId)}>
                                <BootstrapIcon icon="trash" />
                            </Button>
                        </ShortlistItTooltip>
                    </div>
                );
            } else {
                return (
                    <div onClick={() => this.app.startEditingEntry(this.props.listId, this.props.entryId)}>
                        <BootstrapIcon className="clickable" icon="pencil-square" />
                    </div>
                );
            }
        }
    }

    getValuesList() {
        if (this.app.isEditingEntry(this.props.listId, this.props.entryId)) {
            return (
                <>
                    <hr />
                    <ShortlistItListEntryValuesList app={this.app} listId={this.props.listId} entryId={this.props.entryId} />
                </>
            );
        } else {
            return <></>;
        }
    }
}