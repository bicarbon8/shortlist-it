import React from "react";
import { Badge, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Entry } from "../../types/entries/entry";
import { EntryValuesRefContainer } from "../../types/entries/entry-values-ref-container";
import { Shortlist } from "../../types/shortlist";
import { ShortlistItListEntryValuesList } from "../shortlist-it-list-entry-values-list";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { getList, updateList } from "../../component-actions/list-actions";
import ShortlistItListEntryEditButton from "../shortlist-it-list-entry-edit-button";
import { stopEditingEntry } from "../../component-actions/list-entry-actions";

export type ShortlistItListEntryProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    entry: Entry;
};

export function getDescription(props: ShortlistItListEntryProps, descRefObject: React.RefObject<HTMLInputElement>) {
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

export function saveChanges(props: ShortlistItListEntryProps, descRefObject: React.RefObject<HTMLInputElement>, valuesRefs: Array<EntryValuesRefContainer>): void {
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

export function createValuesRefs(criteriaName: string): EntryValuesRefContainer {
    return {
        criteriaName: criteriaName,
        values: React.createRef<HTMLSelectElement>()
    };
}

export function isEditingEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): boolean {
    return stateMgr.state.editingEntryId === entryId;
}

function saveListEntryEdits(listId: string, entry: Entry, stateMgr: ShortlistItStateManager): void {
    const list = getList(listId, stateMgr);
    if (list) {
        const index = list.entries.findIndex(e => e.id === entry.id);
        if (index >= 0) {
            list.entries.splice(index, 1, entry);
            updateList(listId, list, stateMgr);
            stopEditingEntry(stateMgr);
        }
    }
}

export function ShortlistItListEntryCompact(props: ShortlistItListEntryProps) {
    const descRefObject = React.createRef<HTMLInputElement>();
    const valuesRefs = props.list.criteria.map(c => createValuesRefs(c.name));
    
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
                    <ShortlistItListEntryEditButton
                        list={props.list}
                        entry={props.entry}
                        stateMgr={props.stateMgr} />
                </span>
            </div>
        </ListGroupItem>
    );
}