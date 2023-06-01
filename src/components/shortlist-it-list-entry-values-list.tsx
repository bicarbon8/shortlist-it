import React from "react";
import { ListGroup } from "react-bootstrap";
import { EntryValuesRefContainer } from "../types/entries/entry-values-ref-container";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager, getList } from "./shortlist-it";
import { ShortlistItListEntryValuesListItem } from "./shortlist-it-list-entry-values-list-item";

type ShortlistItListEntryValuesListProps = {
    stateMgr: ShortlistItStateManager;
    listId: string;
    entryId: string;
    valuesRefs: Array<EntryValuesRefContainer>;
}

function list(props: ShortlistItListEntryValuesListProps): Shortlist {
    return getList(props.listId, props.stateMgr);
}

function isMultiselect(criteriaName: string, props: ShortlistItListEntryValuesListProps): boolean {
    return list(props).criteria.find(c => c.name === criteriaName)?.allowMultiple || false;
}

export function ShortlistItListEntryValuesList(props: ShortlistItListEntryValuesListProps) {
    const criteriaNames = Array.from(list(props).criteria.map(c => c.name));
    return (
        <ListGroup>
            {criteriaNames.map(criteriaName => <ShortlistItListEntryValuesListItem 
                valuesRef={props.valuesRefs.find(r => r.criteriaName === criteriaName)}
                key={criteriaName} 
                listId={props.listId}
                entryId={props.entryId} 
                criteriaName={criteriaName} 
                stateMgr={props.stateMgr}
                multiselect={isMultiselect(criteriaName, props)} />
            )}
        </ListGroup>
    );
}