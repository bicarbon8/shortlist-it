import React from "react";
import { Col, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { EntryValuesRefContainer } from "../types/entries/entry-values-ref-container";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getEntry } from "../component-actions/list-entry-actions";
import { getList } from "../component-actions/list-actions";

type ShortlistItListEntryValuesListItemProps = {
    listId: string;
    entryId: string;
    criteriaName: string;
    multiselect: boolean;
    valuesRef: EntryValuesRefContainer;
    stateMgr: ShortlistItStateManager;
};

function selectedValues(props: ShortlistItListEntryValuesListItemProps): Array<string> {
    const entry = getEntry(props.listId, props.entryId, props.stateMgr)
    return entry.values.get(props.criteriaName) || new Array<string>();
}

function allPossibleValues(props: ShortlistItListEntryValuesListItemProps): Array<string> {
    const list = getList(props.listId, props.stateMgr);
    return list.criteria
        .find(c => c.name === props.criteriaName)
        ?.values || new Array<string>();
}

function getValuesSelector(props: ShortlistItListEntryValuesListItemProps) {
    if (props.multiselect) {
        return (
            <Form.Group as={Col} controlId="entryValues">
                <Form.Label column="sm">{props.criteriaName}</Form.Label>
                <Form.Control ref={props.valuesRef.values} as="select" multiple defaultValue={selectedValues(props)}>
                    {allPossibleValues(props).map(val => getValueNode(val, props))}
                </Form.Control>
            </Form.Group>
        );
    } else {
        let selected: string;
        let invalid: string;
        if (selectedValues(props).length === 0) {
            selected = '';
            invalid = 'is-invalid';
        } else {
            selected = selectedValues(props)[0];
            invalid = '';
        }
        return (
            <FloatingLabel className="w-100" controlId={`values-select-${props.criteriaName}`} label={props.criteriaName}>
                <Form.Select 
                    ref={props.valuesRef.values} 
                    aria-label="Values Select" 
                    defaultValue={selected}
                    className={invalid}
                    onChange={(e) => validateSelection(e.target)}>
                    <option value="" disabled={true} hidden={true}>Choose value...</option>
                    {allPossibleValues(props).map(val => getValueNode(val, props))}
                </Form.Select>
            </FloatingLabel>
        )
    }
}

function getValueNode(val: string, props: ShortlistItListEntryValuesListItemProps) {
    const selected: boolean = !!(selectedValues(props).includes(val));
    return <option key={val} value={val} defaultChecked={selected}>{val}</option>;
}

function validateSelection(target: HTMLSelectElement) {
    if (target.value !== '') {
        target.className = [...target.classList].filter(c => c !== 'is-invalid').join(' ');
    }
}

export function ShortlistItListEntryValuesListItem(props: ShortlistItListEntryValuesListItemProps) {
    return (
        <ListGroupItem key={props.criteriaName} className="d-flex justify-content-between align-content-start flex-wrap" variant="secondary">
            {getValuesSelector(props)}
        </ListGroupItem>
    );
}