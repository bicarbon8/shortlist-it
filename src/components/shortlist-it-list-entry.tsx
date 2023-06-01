import React from "react";
import { Badge, Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Entry } from "../types/entries/entry";
import { EntryValuesRefContainer } from "../types/entries/entry-values-ref-container";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItStateManager, cancelListEntryEdits, deleteEntry, isEditingEntry, saveListEntryEdits, startEditingEntry } from "./shortlist-it";
import { ShortlistItListEntryValuesList } from "./shortlist-it-list-entry-values-list";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListEntryProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    entry: Entry;
};

function getDescription(props: ShortlistItListEntryProps, descRefObject: React.RefObject<HTMLInputElement>) {
    if (isEditingEntry(props.list.id, props.entry.id, props.stateMgr)) {
        return (
            <FloatingLabel controlId="entryDescription" label="Entry Description">
                <Form.Control ref={descRefObject} type="text" defaultValue={props.entry.description} />
            </FloatingLabel>
        )
    } else {
        const textColour = (props.list.archived) ? 'text-muted' : 'text-dark';
        return <span className={textColour}>{props.entry.description}</span>;
    }
}

function getEditButton(props: ShortlistItListEntryProps, descRefObject: React.RefObject<HTMLInputElement>, valuesRefs: Array<EntryValuesRefContainer>) {
    if (props.list.archived) {
        return <></>;
    } else {
        if (isEditingEntry(props.list.id, props.entry.id, props.stateMgr)) {
            return (
                <div className="d-flex flex-column justify-content-evenly align-content-start sticky">
                    <ShortlistItTooltip id={`save-changes-${props.entry.id}`} text="Save Changes" className="mb-2">
                        <Button variant="success" onClick={() => saveChanges(props, descRefObject, valuesRefs)}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`cancel-edits-${props.entry.id}`} text="Cancel Edits" className="my-2">
                        <Button variant="warning" onClick={() => cancelListEntryEdits(props.list.id, props.entry.id, props.stateMgr)}>
                            <BootstrapIcon icon="x-circle" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`delete-entry-${props.entry.id}`} text="Delete Entry" className="mt-2">
                        <Button variant="danger" onClick={() => deleteEntry(props.list.id, props.entry.id, props.stateMgr)}>
                            <BootstrapIcon icon="trash" />
                        </Button>
                    </ShortlistItTooltip>
                </div>
            );
        } else {
            let icon: string;
            let tooltip: string;
            let iconBackground: string;
            if (hasMissingData(props)) {
                icon = 'exclamation-triangle';
                tooltip = 'Missing Data - click to set values';
                iconBackground = 'bg-warning';
            } else {
                icon = 'pencil-square';
                tooltip = 'Edit Entry';
                iconBackground = '';
            }
            return (
                <ShortlistItTooltip id={`edit-entry-${props.entry.id}`} text={tooltip}>
                    <div className="clickable" onClick={() => startEditingEntry(props.list.id, props.entry.id, props.stateMgr)}>
                        <BootstrapIcon className={iconBackground} icon={icon} />
                    </div>
                </ShortlistItTooltip>
            );
        }
    }
}

function getValuesList(props: ShortlistItListEntryProps, valuesRefs: Array<EntryValuesRefContainer>) {
    if (isEditingEntry(props.list.id, props.entry.id, props.stateMgr)) {
        return (
            <>
                <hr />
                <ShortlistItListEntryValuesList stateMgr={props.stateMgr} valuesRefs={valuesRefs} listId={props.list.id} entryId={props.entry.id} />
            </>
        );
    } else {
        return <></>;
    }
}

function saveChanges(props: ShortlistItListEntryProps, descRefObject: React.RefObject<HTMLInputElement>, valuesRefs: Array<EntryValuesRefContainer>): void {
    const values = new Map<string, Array<string>>();
    valuesRefs.forEach(r => {
        const criteriaName = r.criteriaName;
        const vals: Array<string> = [...r.values.current.options]
            .filter(o => o.selected)
            .map(o => o.value);
        values.set(criteriaName, vals);
    });
    const entry: Entry = {
        id: props.entry.id,
        description: descRefObject.current.value,
        values: values
    };
    saveListEntryEdits(props.list.id, entry, props.stateMgr);
}

function createValuesRefs(criteriaName: string): EntryValuesRefContainer {
    return {
        criteriaName: criteriaName,
        values: React.createRef<HTMLSelectElement>()
    };
}

function hasMissingData(props: ShortlistItListEntryProps): boolean {
    const criteriaNames: Array<string> = Array.from(props.list.criteria.map(c => c.name))
        .filter(name => name && name !== '');
    for (var i=0; i<criteriaNames.length; i++) {
        const key = criteriaNames[i];
        const vals = props.entry.values.get(key);
        if (!vals || vals.length === 0) {
            const criteria: Criteria = props.list.criteria.find(c => c.name === key);
            if (!criteria.allowMultiple) {
                return true;
            }
        }
    }
    return false;
}

export function ShortlistItListEntry(props: ShortlistItListEntryProps) {
    let descRefObject = React.createRef<HTMLInputElement>();
    let valuesRefs = props.list.criteria.map(c => createValuesRefs(c.name));
    
    const variant = (props.list.archived) ? 'dark' : 'primary';
    const badgeColour = (props.list.archived) ? 'bg-secondary' : 'bg-primary';

    return (
        <ListGroupItem variant={variant} className="d-flex flex-column justify-content-between align-content-between flex-wrap">
            <div className="d-flex flex-row justify-content-between w-100">
                <div className="px-1"><Badge pill={true} className={badgeColour}>{props.entry.ranking}</Badge></div> 
                <span className="xs-8 px-1 text-start flex-grow-1">
                    {getDescription(props, descRefObject)}
                    {getValuesList(props, valuesRefs)}
                </span> 
                <span className="text-center px-1"> 
                    {getEditButton(props, descRefObject, valuesRefs)}
                </span>
            </div>
        </ListGroupItem>
    );
}