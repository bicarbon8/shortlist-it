import React, { createRef, useState } from "react";
import { Criteria } from "../../types/criteria/criteria";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Alert, Anchor, Button, Col, FloatingLabel, Form } from "react-bootstrap";
import { ShortlistItTooltip } from "../utilities/shortlist-it-tooltip";
import { BootstrapIcon } from "../utilities/bootstrap-icon";
import { getList, updateList } from "../../component-actions/list-actions";
import { Entry } from "../../types/entries/entry";
import ShortlistItCriteriaEditModal from "./shortlist-it-criteria-edit-modal";
import { ShortlistItEntryDeletionModal } from "./shortlist-it-entry-deletion-modal";
import { getEntry } from "../../component-actions/list-entry-actions";
import ShortlistItAddCriteriaFromTemplateModal from "./shortlist-it-add-criteria-from-template-modal";
import { ElementHelper } from "../../utilities/element-helper";

function Multiselect(props: {label: string, selectedValues: Array<string>, allValues: Array<string>}) {
    return (
        <Form.Group as={Col} controlId={`values-multi-${ElementHelper.idEncode(props.label)}`}>
            <Form.Label column="sm" className="text-truncate">{props.label}</Form.Label>
            <Form.Control
                as="select"
                multiple
                defaultValue={props.selectedValues}>
                {props.allValues.map(val => <ValueOptionNode key={val} val={val} selectedValues={props.selectedValues} />)}
            </Form.Control>
        </Form.Group>
    );
}

function Dropdown(props: {label: string, selectedValues: Array<string>, allValues: Array<string>}) {
    const validateSelection = (target: HTMLSelectElement) => {
        if (target.value !== '') {
            target.className = [...target.classList].filter(c => c !== 'is-invalid').join(' ');
        }
    };
    let selected: string;
    let invalid: string;
    if (props.selectedValues.length === 0) {
        selected = '';
        invalid = 'is-invalid';
    } else {
        selected = props.selectedValues[0];
        invalid = '';
    }
    return (
        <FloatingLabel className="w-100 pb-1" controlId={`values-select-${ElementHelper.idEncode(props.label)}`} label={props.label}>
            <Form.Select
                aria-label={`Values Select for ${props.label}`}
                defaultValue={selected}
                className={invalid}
                onChange={(e) => validateSelection(e.target)}>
                <option value="" disabled={true} hidden={true}>Choose value...</option>
                {props.allValues.map(val => <ValueOptionNode key={val} val={val} selectedValues={props.selectedValues} />)}
            </Form.Select>
        </FloatingLabel>
    );
}

function ValueOptionNode(props: {val: string, selectedValues: Array<string>}) {
    const selected: boolean = !!(props.selectedValues.includes(props.val));
    return <option key={props.val} value={props.val} defaultChecked={selected}>{props.val}</option>;
}

type ShortlistItEntryValueProps = {
    listId: string;
    entryId: string;
    criteria: Criteria;
    selectedValues: Array<string>;
    stateMgr: ShortlistItStateManager;
}

function ShortlistItEntryValue(props: ShortlistItEntryValueProps) {
    const allValues = props.criteria.values || new Array<string>();
    const [showEditCriteriaModal, setShowEditCriteriaModal] = useState(false);
    return (
        <>
            {(props.criteria.allowMultiple)
                ? <Multiselect
                    label={props.criteria.name}
                    selectedValues={props.selectedValues}
                    allValues={allValues}/>
                : <Dropdown 
                    label={props.criteria.name}
                    selectedValues={props.selectedValues}
                    allValues={allValues} />
            }
            <div className="text-start">
                <Anchor
                    style={{display: "inline-block"}}
                    onClick={() => {
                        setShowEditCriteriaModal(true);
                    }}>
                    <p className="text-muted text-truncate" style={{fontSize: '0.65em'}}>edit Criteria: "<em>{props.criteria.name}</em>" instead</p>
                </Anchor>
                <ShortlistItCriteriaEditModal
                    stateMgr={props.stateMgr}
                    criteria={props.criteria}
                    listId={props.listId}
                    show={showEditCriteriaModal}
                    onClose={() => setShowEditCriteriaModal(false)}
                    onSave={() => null}
                    onDelete={() => null} />
            </div>
        </>
    );
}

function isEntryDescValid(description: string, ref?: React.RefObject<HTMLDivElement>): boolean {
    const entryEl = ref?.current?.querySelector<HTMLInputElement>("#entry-description-input");
    let desc: string;
    if (entryEl) {
        desc = entryEl.value;
    } else {
        desc = description ?? '';
    }
    const invalid: boolean = (!desc || desc.match(/^[\s]+$/) !== null);
    return !invalid;
}

type ShortlistItEntryEditModalProps = {
    stateMgr: ShortlistItStateManager;
    entry: Entry;
    show: boolean;
    onClose?: () => void;
};

export default function ShortlistItEntryEditModal(props: ShortlistItEntryEditModalProps) {
    if (!props.show || !props.entry) {
        return <></>;
    }

    const entry = (props.entry.listId) ? props.entry : getEntry(props.entry.id, props.stateMgr);
    const list = getList(entry.listId, props.stateMgr);
    const entryRef = createRef<HTMLDivElement>();
    const [showSaveError, setShowSaveError] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [showAddCriteria, setShowAddCriteria] = useState(false);
    const [entryDescValid, setEntryDescValid] = useState(isEntryDescValid(entry.description, entryRef));
    const onSaveError = () => {
        setShowSaveError(true);
        window.setTimeout(() => setShowSaveError(false), 5000);
    }
    const isEntryValid = (): Entry => {
        const desc = entryRef.current?.querySelector<HTMLInputElement>('#entry-description-input')?.value;
        if (!isEntryDescValid(desc, entryRef)) {
            return null;
        }
        const values = new Map<string, string[]>();
        list.criteria.forEach(c => {
            const options = Array.from(entryRef.current?.querySelectorAll<HTMLOptionElement>(`#${Criteria.nameToElementId(c.name)}-${entry.id} option`)?.values());
            values.set(c.name, options?.filter(o => o.selected).map(o => o.value));
        });
        return {
            id: entry?.id,
            description: desc,
            values: values,
            listId: list?.id
        };
    };
    const saveEntry = (): boolean => {
        const entry = isEntryValid();
        if (entry) {
            const cIndex = list.entries.findIndex(e => e.id === entry?.id);
            if (cIndex >= 0) {
                list.entries.splice(cIndex, 1, entry);
            } else {
                list.entries.push(entry);
            }
            updateList(list?.id, list, props.stateMgr);
            return true;
        }
        return false;
    };
    const modalHeader = () => {
        const exists = getEntry(entry?.id, props.stateMgr);
        return (
            <div className="d-flex flex-row ps-1">
                <p className="flex-grow-1">Edit Entry</p>
                <ShortlistItTooltip id="save-entry" className="pe-1" text="Save Entry">
                    <Button
                        variant="success"
                        aria-label="Save Entry"
                        onClick={() => {
                            if (saveEntry()) {
                                props.onClose?.();
                            } else {
                                onSaveError();
                            }
                        }}>
                        <BootstrapIcon icon="check" />
                    </Button>
                </ShortlistItTooltip>
                <ShortlistItTooltip id="add-criteria" className="pe-1" text="Add Criteria">
                    <Button
                        variant="secondary"
                        aria-label="Add Criteria"
                        onClick={() => setShowAddCriteria(true)}>
                        <BootstrapIcon icon="plus" />
                    </Button>
                </ShortlistItTooltip>
                {(exists) && <ShortlistItTooltip id="delete-entry" text="Delete Entry">
                    <Button variant="danger" aria-label="Delete Entry" onClick={() => setShowConfirmDelete(true)}>
                        <BootstrapIcon icon="trash" />
                    </Button>
                </ShortlistItTooltip>}
                <ShortlistItEntryDeletionModal
                    stateMgr={props.stateMgr}
                    entry={props.entry}
                    onClose={() => setShowConfirmDelete(false)}
                    onConfirmed={() => {
                        setShowConfirmDelete(false);
                        props.onClose?.();
                    }}
                    show={showConfirmDelete} />
                <ShortlistItAddCriteriaFromTemplateModal
                    stateMgr={props.stateMgr}
                    list={list}
                    show={showAddCriteria}
                    onClose={() => setShowAddCriteria(false)} />
            </div>
        );
    }
    
    return (
        <ShortlistItModal
            variant="light"
            dismissible={true}
            onClose={() => props.onClose?.()}
            show={props.show && entry != null}
            heading={() => modalHeader()}>
            <div ref={entryRef} className="d-flex flex-row justify-content-between" style={{minWidth: "70dvw"}}>
                <div className="d-flex flex-column justify-content-evently flex-grow-1 pe-1">
                    <Alert variant="danger" dismissible show={showSaveError} onClose={() => setShowSaveError(false)}>
                        Entry must have all values set to valid values in order to be Saved
                    </Alert>
                    <FloatingLabel controlId={`entry-description-input`} label="Description">
                        <Form.Control
                            type="text"
                            defaultValue={entry?.description}
                            className={(!entryDescValid) ? 'is-invalid' : ''} 
                            onChange={() => setEntryDescValid(isEntryDescValid(entry.description, entryRef))} />
                    </FloatingLabel>
                    <hr />
                    {list?.criteria.map(c => {
                        const selectedValues = entry?.values.get(c.name) ?? new Array<string>();
                        const key = `${Criteria.nameToElementId(c.name)}-${entry?.id}`;
                        return (
                            <ShortlistItEntryValue
                                key={key}
                                criteria={c}
                                entryId={entry?.id}
                                listId={list.id}
                                selectedValues={selectedValues}
                                stateMgr={props.stateMgr} />
                        );
                    })}
                </div>
            </div>
        </ShortlistItModal>
    );
}