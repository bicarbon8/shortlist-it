import React from "react";
import { Badge, Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { EntryValuesRefContainer } from "../types/entries/entry-values-ref-container";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListEntryValuesList } from "./shortlist-it-list-entry-values-list";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListEntryProps = {
    app: ShortlistIt;
    list: Shortlist;
    entry: Entry;
};

export class ShortlistItListEntry extends React.Component<ShortlistItListEntryProps> {
    private descRefObject: React.RefObject<HTMLInputElement>;
    private valuesRefs: Array<EntryValuesRefContainer>;
    
    constructor(props: ShortlistItListEntryProps) {
        super(props);
        this.state = {
            editing: (this.props.entry.description) ? false : true
        };
        this.descRefObject = React.createRef<HTMLInputElement>();
        this.valuesRefs = this.props.list.criteria.map(c => this.createValuesRefs(c.name));
    }

    shouldComponentUpdate(nextProps: Readonly<ShortlistItListEntryProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        this.descRefObject = React.createRef<HTMLInputElement>();
        this.valuesRefs = nextProps.list.criteria.map(c => this.createValuesRefs(c.name));
        return true;
    }
    
    render() {
        const variant = (this.props.list.archived) ? 'dark' : 'primary';
        const badgeColour = (this.props.list.archived) ? 'bg-secondary' : 'bg-primary';

        return (
            <ListGroupItem variant={variant} className="d-flex flex-column justify-content-between align-content-between flex-wrap">
                <div className="d-flex flex-row justify-content-between w-100">
                    <div className="px-1"><Badge pill={true} className={badgeColour}>{this.props.entry.ranking}</Badge></div> 
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

    getDescription() {
        if (this.app.isEditingEntry(this.props.list.id, this.props.entry.id)) {
            return (
                <FloatingLabel controlId="entryDescription" label="Entry Description">
                    <Form.Control ref={this.descRefObject} type="text" defaultValue={this.props.entry.description} />
                </FloatingLabel>
            )
        } else {
            const textColour = (this.props.list.archived) ? 'text-muted' : 'text-dark';
            return <span className={textColour}>{this.props.entry.description}</span>;
        }
    }

    getEditButton() {
        if (this.props.list.archived) {
            return <></>;
        } else {
            if (this.app.isEditingEntry(this.props.list.id, this.props.entry.id)) {
                return (
                    <div className="d-flex flex-column justify-content-evenly align-content-start sticky">
                        <ShortlistItTooltip id={`save-changes-${this.props.entry.id}`} text="Save Changes" className="mb-2">
                            <Button variant="success" onClick={() => this.saveChanges()}>
                                <BootstrapIcon icon="check" />
                            </Button>
                        </ShortlistItTooltip>
                        <ShortlistItTooltip id={`cancel-edits-${this.props.entry.id}`} text="Cancel Edits" className="my-2">
                            <Button variant="warning" onClick={() => this.app.cancelListEntryEdits(this.props.list.id, this.props.entry.id)}>
                                <BootstrapIcon icon="x-circle" />
                            </Button>
                        </ShortlistItTooltip>
                        <ShortlistItTooltip id={`delete-entry-${this.props.entry.id}`} text="Delete Entry" className="mt-2">
                            <Button variant="danger" onClick={() => this.app.deleteEntry(this.props.list.id, this.props.entry.id)}>
                                <BootstrapIcon icon="trash" />
                            </Button>
                        </ShortlistItTooltip>
                    </div>
                );
            } else {
                return (
                    <div onClick={() => this.app.startEditingEntry(this.props.list.id, this.props.entry.id)}>
                        <BootstrapIcon className="clickable" icon="pencil-square" />
                    </div>
                );
            }
        }
    }

    getValuesList() {
        if (this.app.isEditingEntry(this.props.list.id, this.props.entry.id)) {
            return (
                <>
                    <hr />
                    <ShortlistItListEntryValuesList app={this.app} valuesRefs={this.valuesRefs} listId={this.props.list.id} entryId={this.props.entry.id} />
                </>
            );
        } else {
            return <></>;
        }
    }

    saveChanges(): void {
        const values = new Map<string, Array<string>>();
        this.valuesRefs.forEach(r => {
            const criteriaName = r.criteriaName;
            const vals: Array<string> = [...r.values.current.options]
                .filter(o => o.selected)
                .map(o => o.value);
            values.set(criteriaName, vals);
        });
        const entry: Entry = {
            id: this.props.entry.id,
            description: this.descRefObject.current.value,
            values: values
        };
        this.app.saveListEntryEdits(this.props.list.id, entry);
    }

    private createValuesRefs(criteriaName: string): EntryValuesRefContainer {
        return {
            criteriaName: criteriaName,
            values: React.createRef<HTMLSelectElement>()
        };
    }
}