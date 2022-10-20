import React from "react";
import { Badge, Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListEntryValuesList } from "./shortlist-it-list-entry-values-list";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListEntryProps = {
    parent: ShortlistItListBody;
    entry: Entry;
};

type ShortlistItListEntryState = {
    editing: boolean;
};

export class ShortlistItListEntry extends React.Component<ShortlistItListEntryProps, ShortlistItListEntryState> {
    constructor(props: ShortlistItListEntryProps) {
        super(props);
        this.state = {
            editing: false
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

    get parent(): ShortlistItListBody {
        return this.props.parent;
    }

    get list(): Shortlist {
        return this.parent.list;
    }

    get entry(): Entry {
        return this.props.entry;
    }

    get editing(): boolean {
        return this.state.editing;
    }

    getDescription() {
        if (this.editing) {
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
            if (this.editing) {
                return (
                    <div className="d-flex flex-column justify-content-evenly align-content-between h-100">
                        <Button variant="outline-success" onClick={() => this.doneEditing()}>
                            <BootstrapIcon icon="check" />
                        </Button>
                        <Button variant="outline-danger" onClick={() => this.deleteEntry()}>
                            <BootstrapIcon icon="trash" />
                        </Button>
                    </div>
                );
            } else {
                return (
                    <div onClick={() => this.startEditing()}>
                        <BootstrapIcon icon="pencil-square" />
                    </div>
                );
            }
        }
    }

    getValuesList() {
        if (this.editing) {
            return (
                <>
                    <hr />
                    <ShortlistItListEntryValuesList parent={this} />
                </>
            );
        } else {
            return <></>;
        }
    }

    startEditing(): void {
        this.setState({editing: true});
    }

    doneEditing(): void {
        this.setState({editing: false});
    }

    cancelEditing(): void {
        this.setState({editing: false});
    }

    deleteEntry(): void {
        const confirmed: boolean = window.confirm(`Are you sure you want to delete entry described by: ${this.entry.description}? This action cannot be undone.`);
        if (confirmed) {
            this.parent.parent.deleteEntry(this.entry.id);
        }
    }
}