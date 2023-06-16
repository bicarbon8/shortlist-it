import React, { createRef, useState } from "react";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { ShortlistItModal } from "./shortlist-it-modal";
import { Alert, Button, Col, FloatingLabel, Form } from "react-bootstrap";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";
import { BootstrapIcon } from "./bootstrap-icon";
import { getList, updateList } from "../component-actions/list-actions";
import { stopEditingCriteria } from "../component-actions/list-criteria-actions";
import { Entry } from "../types/entries/entry";
import { getEntry, stopEditingEntry } from "../component-actions/list-entry-actions";

function Multiselect(props: {id: string, label: string, selectedValues: Array<string>, allValues: Array<string>}) {
    return (
        <Form.Group as={Col} controlId={props.id}>
            <Form.Label column="sm">{props.label}</Form.Label>
            <Form.Control
                as="select"
                multiple
                defaultValue={props.selectedValues}>
                {props.allValues.map(val => <ValueNode key={val} val={val} selectedValues={props.selectedValues} />)}
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
        <FloatingLabel className="w-100" controlId={`values-select-${props.label}`} label={props.label}>
            <Form.Select
                id={props.id}
                aria-label={`Values Select for ${props.label}`}
                defaultValue={selected}
                className={invalid}
                onChange={(e) => validateSelection(e.target)}>
                <option value="" disabled={true} hidden={true}>Choose value...</option>
                {props.allValues.map(val => <ValueNode key={val} val={val} selectedValues={props.selectedValues} />)}
            </Form.Select>
        </FloatingLabel>
    );
}

function ValueNode(props: {val: string, selectedValues: Array<string>}) {
    const selected: boolean = !!(props.selectedValues.includes(props.val));
    return <option key={props.val} value={props.val} defaultChecked={selected}>{props.val}</option>;
}

type ShortlistItEntryEditModalProps = {
    stateMgr: ShortlistItStateManager;
};

export default function ShortlistItEntryEditModal(props: ShortlistItEntryEditModalProps) {
    if (!props.stateMgr.state.editingEntryId) {
        return <></>;
    }

    const entry = getEntry(props.stateMgr.state.editingEntryId, props.stateMgr);
    const list = getList(entry.listId, props.stateMgr);
    const [showSaveError, setShowSaveError] = useState(false);
    const entryRef = createRef<HTMLDivElement>();
    const onSaveError = () => {
        setShowSaveError(true);
        window.setTimeout(() => setShowSaveError(false), 5000);
    }
    const isEntryValid = (ref: React.RefObject<HTMLDivElement>): Entry => {
        const desc = ref.current?.querySelector<HTMLInputElement>(`#description-${entry.id}`)?.value;
        if (desc == null || desc == '') {
            return null;
        }
        const values = new Map<string, string[]>();
        list.criteria.forEach(c => {
            const options = Array.from(ref.current?.querySelectorAll<HTMLOptionElement>(`#${Criteria.nameToElementId(c.name)}-${entry.id} option`)?.values());
            values.set(c.name, options?.filter(o => o.selected).map(o => o.value));
        });
        return {
            id: entry.id,
            description: desc,
            values: values
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
            const cIndex = list.entries.findIndex(e => e.id === entry.id);
            if (cIndex >= 0) {
                list.entries.splice(cIndex, 1, entry);
                updateList(list.id, list, props.stateMgr);
            }
            return true;
        }
        return false;
    };
    const allPossibleValues = (criteria: Criteria): Array<string> => {
        return criteria.values || new Array<string>();
    }
    
    return (
        <ShortlistItModal
            variant="light"
            dismissible={true}
            onClose={() => stopEditingEntry(props.stateMgr)}
            heading="Edit Entry"
            show={true}
        >
            <div ref={entryRef} className="d-flex flex-row justify-content-between">
                <div className="d-flex flex-column justify-content-evently flex-grow-1 pe-1">
                    <Alert variant="danger" dismissible show={showSaveError}>
                        Entry must have all values set to valid values in order to be Saved
                    </Alert>
                    <FloatingLabel controlId={`description-${entry.id}`} label="Entry Description">
                        <Form.Control type="text" defaultValue={entry.description} />
                    </FloatingLabel>
                    {list.criteria.map(c => {
                        const selectedValues = entry.values.get(c.name) ?? new Array<string>();
                        const allValues = allPossibleValues(c);
                        const id = `${Criteria.nameToElementId(c.name)}-${entry.id}`;
                        if (c.allowMultiple) {
                            return <Multiselect
                                key={id}
                                id={id}
                                label={c.name}
                                selectedValues={selectedValues}
                                allValues={allValues}/>;
                        } else {
                            return <Dropdown 
                                key={id}
                                id={id}
                                label={c.name}
                                selectedValues={selectedValues}
                                allValues={allValues} />
                        }
                    })}
                </div>
                <div className="d-flex flex-column justify-content-between ps-1">
                    <ShortlistItTooltip id={`save-entry-${entry.id}`} text="Save Entry">
                        <Button variant="success" aria-label="Save Criteria" onClick={() => {
                            if (saveEntry()) {
                                stopEditingEntry(props.stateMgr);
                            } else {
                                onSaveError();
                            }
                        }}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`cancel-edit-entry-${entry.id}`} text="Cancel Edit">
                        <Button variant="warning" aria-label="Cancel Edit" onClick={() => stopEditingEntry(props.stateMgr)}>
                            <BootstrapIcon icon="x-circle" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`delete-entry-${entry.id}`} text="Delete Entry">
                        <Button variant="danger" aria-label="Delete Criteria" onClick={() => {
                            stopEditingCriteria(props.stateMgr);
                            confirmDeleteEntry(entry.id, props.stateMgr); // ...and open confirmation modal
                        }}>
                            <BootstrapIcon icon="trash" />
                        </Button>
                    </ShortlistItTooltip>
                </div>
            </div>
        </ShortlistItModal>
    );
}