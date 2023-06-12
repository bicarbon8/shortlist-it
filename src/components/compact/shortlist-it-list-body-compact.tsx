import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Entry } from "../../types/entries/entry";
import { Shortlist } from "../../types/shortlist";
import { BootstrapIcon } from "../bootstrap-icon";
import { ShortlistItListEntryCompact } from "./shortlist-it-list-entry-compact";
import { v4 } from "uuid";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { getList, updateList } from "../../component-actions/list-actions";
import { startEditingEntry } from "../../component-actions/list-entry-actions";

export type ShortlistItListBodyProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
}

function getAddEntryButton(props: ShortlistItListBodyProps) {
    if (props.list.archived) {
        return <></>;
    } else {
        return (
            <ListGroupItem 
                variant="dark"
                key="add_new_entry" 
                onClick={() => addNewEntry(props.list.id, props.stateMgr)}
                className="d-flex justify-content-center clickable">
                <BootstrapIcon icon="plus-lg" /> 
                Add New Entry
            </ListGroupItem>
        );
    }
}

export function addNewEntry(listId: string, stateMgr: ShortlistItStateManager): void {
    let updated = getList(listId, stateMgr);
    if (updated) {
        const entry: Entry = {
            id: v4(),
            values: new Map<string, Array<string>>()
        }
        updated.entries.push(entry);
        updateList(listId, updated, stateMgr);
        startEditingEntry(listId, entry.id, stateMgr);
    }
}

export function ShortlistItListBodyCompact(props: ShortlistItListBodyProps) {
    return (
        <ListGroup>
            {props.list.entries.map((entry: Entry) => <ShortlistItListEntryCompact key={entry.id} stateMgr={props.stateMgr} list={props.list} entry={entry} />)}
            {getAddEntryButton(props)}
        </ListGroup>
    );
}