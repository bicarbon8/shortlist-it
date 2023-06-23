import React, { createRef, useState } from "react";
import { Criteria } from "../../types/criteria/criteria";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Alert, Anchor, Button, Col, FloatingLabel, Form } from "react-bootstrap";
import { ShortlistItTooltip } from "../utilities/shortlist-it-tooltip";
import { BootstrapIcon } from "../utilities/bootstrap-icon";
import { getList, updateList } from "../../component-actions/list-actions";
import { Entry } from "../../types/entries/entry";
import { getEntry, stopEditingEntry } from "../../component-actions/list-entry-actions";
import { startEditingCriteria } from "../../component-actions/list-criteria-actions";

function Multiselect(props: {id: string, label: string, selectedValues: Array<string>, allValues: Array<string>}) {
    return (
        <Form.Group as={Col} controlId={props.id}>
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

function Dropdown(props: {id: string, label: string, selectedValues: Array<string>, allValues: Array<string>}) {
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
        <FloatingLabel className="w-100 pb-1" controlId={`values-select-${props.label}`} label={props.label}>
            <Form.Select
                id={props.id}
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
    entryId: string;
    criteria: Criteria;
    selectedValues: Array<string>;
    stateMgr: ShortlistItStateManager;
}

function ShortlistItEntryValue(props: ShortlistItEntryValueProps) {
    const id = `${Criteria.nameToElementId(props.criteria.name)}-${props.entryId}`;
    const allValues = props.criteria.values || new Array<string>();
    return (
        <>
            {(props.criteria.allowMultiple)
                ? <Multiselect
                    id={id}
                    label={props.criteria.name}
                    selectedValues={props.selectedValues}
                    allValues={allValues}/>
                : <Dropdown 
                    id={id}
                    label={props.criteria.name}
                    selectedValues={props.selectedValues}
                    allValues={allValues} />
            }
            <div className="text-start">
                <Anchor
                    style={{display: "inline-block"}}
                    onClick={() => {
                        stopEditingEntry(props.stateMgr);
                        startEditingCriteria(props.criteria.id, props.stateMgr);
                    }}>
                    <p className="text-muted text-truncate" style={{fontSize: '0.65em'}}>edit Criteria: "<em>{props.criteria.name}</em>" instead</p>
                </Anchor>
            </div>
        </>
    );
}

type ShortlistItEntryEditModalProps = {
    stateMgr: ShortlistItStateManager;
};

export default function ShortlistItEntryEditModal(props: ShortlistItEntryEditModalProps) {
    const entry = (props.stateMgr.state.editingEntryId) ? getEntry(props.stateMgr.state.editingEntryId, props.stateMgr) : null;
    const list = (entry) ? getList(entry.listId, props.stateMgr) : null;
    const [showSaveError, setShowSaveError] = useState(false);
    const entryRef = createRef<HTMLDivElement>();
    const onSaveError = () => {
        setShowSaveError(true);
        window.setTimeout(() => setShowSaveError(false), 5000);
    }
    const isEntryValid = (ref: React.RefObject<HTMLDivElement>): Entry => {
        const desc = ref.current?.querySelector<HTMLInputElement>(`#description-${entry?.id}`)?.value;
        if (desc == null || desc == '') {
            return null;
        }
        const values = new Map<string, string[]>();
        list.criteria.forEach(c => {
            const options = Array.from(ref.current?.querySelectorAll<HTMLOptionElement>(`#${Criteria.nameToElementId(c.name)}-${entry.id} option`)?.values());
            values.set(c.name, options?.filter(o => o.selected).map(o => o.value));
        });
        return {
            id: entry?.id,
            description: desc,
            values: values,
            listId: list?.id
        };
    };
    const confirmDeleteEntry = (entryId: string, stateMgr: ShortlistItStateManager): void => {
        stopEditingEntry(stateMgr);
        stateMgr.state.entryToBeDeleted = entryId;
        stateMgr.setState({...stateMgr.state});
    };
    const saveEntry = (): boolean => {
        const entry = isEntryValid(entryRef);
        if (entry) {
            const cIndex = list.entries.findIndex(e => e.id === entry?.id);
            if (cIndex >= 0) {
                list.entries.splice(cIndex, 1, entry);
                updateList(list?.id, list, props.stateMgr);
                return true;
            }
        }
        return false;
    };
    
    return (
        <ShortlistItModal
            variant="light"
            dismissible={true}
            onClose={() => stopEditingEntry(props.stateMgr)}
            show={entry != null}
            heading={() => {
                return (
                    <div className="d-flex flex-row ps-1">
                        <p className="flex-grow-1">Edit Entry</p>
                        <ShortlistItTooltip id={`save-entry-${entry?.id}`} className="pe-1" text="Save Entry">
                            <Button
                                variant="success"
                                aria-label="Save Entry"
                                onClick={() => {
                                    if (saveEntry()) {
                                        stopEditingEntry(props.stateMgr);
                                    } else {
                                        onSaveError();
                                    }
                                }}>
                                <BootstrapIcon icon="check" />
                            </Button>
                        </ShortlistItTooltip>
                        <ShortlistItTooltip id={`delete-entry-${entry?.id}`} text="Delete Entry">
                            <Button variant="danger" aria-label="Delete Entry" onClick={() => {
                                stopEditingEntry(props.stateMgr);
                                confirmDeleteEntry(entry?.id, props.stateMgr); // ...and open confirmation modal
                            }}>
                                <BootstrapIcon icon="trash" />
                            </Button>
                        </ShortlistItTooltip>
                    </div>
                )
            }}
        >
            <div ref={entryRef} className="d-flex flex-row justify-content-between" style={{minWidth: "70dvw"}}>
                <div className="d-flex flex-column justify-content-evently flex-grow-1 pe-1">
                    <Alert variant="danger" dismissible show={showSaveError} onClose={() => setShowSaveError(false)}>
                        Entry must have all values set to valid values in order to be Saved
                    </Alert>
                    <FloatingLabel controlId={`description-${entry?.id}`} label="Description">
                        <Form.Control type="text" defaultValue={entry?.description} />
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
                                selectedValues={selectedValues}
                                stateMgr={props.stateMgr} />
                        );
                    })}
                </div>
            </div>
        </ShortlistItModal>
    );
}