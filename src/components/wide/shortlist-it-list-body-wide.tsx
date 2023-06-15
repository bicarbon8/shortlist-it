import React, { useState } from "react";
import { ShortlistItListBodyProps, addNewEntry } from "../compact/shortlist-it-list-body-compact";
import ShortlistItListEntryWide from "./shortlist-it-list-entry-wide";
import { BootstrapIcon } from "../bootstrap-icon";
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap";
import { Criteria } from "../../types/criteria/criteria";
import { Shortlist } from "../../types/shortlist";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../shortlist-it-modal";
import { CriteriaType, CriteriaTypeArray } from "../../types/criteria/criteria-type";
import { CriteriaRefContainer } from "../../types/criteria/criteria-ref-container";
import { store } from "../../utilities/storage";
import { ShortlistItTooltip } from "../shortlist-it-tooltip";
import { createCriteriaRef } from "../shortlist-it-list-header";
import ShortlistItListCriteriaAddNewDropdown from "../shortlist-it-list-criteria-add-new-dropdown";
import { getList, updateList } from "../../component-actions/list-actions";

function getAddEntryButton(props: ShortlistItListBodyProps) {
    if (props.list.archived) {
        return <></>;
    } else {
        return (
            <tr className="table-secondary">
                <td colSpan={3 + props.list.criteria.length}>
                    <Button size="sm" variant="outline-secondary" onClick={() => addNewEntry(props.list.id, props.stateMgr)}>
                        <BootstrapIcon icon="plus-lg" /> 
                        Add New Entry
                    </Button>
                </td>
            </tr>
        );
    }
}

type ShortlistItListCriteriaListItemState = {
    multiselectAllowed: boolean;
    valuesAllowed: boolean;
    nameError: boolean;
    valuesError: boolean;
    weightError: boolean;
};

function getCriteriaModalElement(criteria: Criteria): HTMLDivElement {
    return document.getElementById(criteria.id) as HTMLDivElement;
}

function getCriteriaModalType(criteria: Criteria): CriteriaType {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaType: CriteriaType;
    if (criteriaEl) {
        criteriaType = (criteriaEl.querySelector('#criteriaType option:checked') as HTMLOptionElement)?.value as CriteriaType;
    } else {
        criteriaType = criteria.type;
    }
    return criteriaType ?? 'worst-to-best';
}

function isCriteriaTypeValid(criteria: Criteria): boolean {
    const criteriaType: CriteriaType = getCriteriaModalType(criteria);
    return CriteriaTypeArray.includes(criteriaType);
}

function isCriteriaMultiselectAllowed(criteria: Criteria): boolean {
    const criteriaType = getCriteriaModalType(criteria);
    return criteriaType !== 'yes-no';
}

function doesCriteriaAllowValues(criteria: Criteria): boolean {
    const criteriaType = getCriteriaModalType(criteria);
    return criteriaType !== 'yes-no';
}

function isCriteriaNameValid(criteria: Criteria, list: Shortlist): boolean {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaName: string;
    if (criteriaEl) {
        criteriaName = (criteriaEl.querySelector('#criteriaName') as HTMLInputElement)?.value;
    } else {
        criteriaName = criteria.name ?? '';
    }
    const invalid: boolean = (!criteriaName || criteriaName.match(/^[\s]+$/) !== null || list.criteria
        .filter(c => c.id !== criteria.id)
        .map(c => c.name)
        .includes(criteriaName));
    return !invalid;
}

function areCritieriaValuesValid(criteria: Criteria): boolean {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaValues: string
    if (criteriaEl) {
        criteriaValues = (criteriaEl.querySelector('#criteriaValues') as HTMLInputElement).value;
    } else {
        criteriaValues = criteria.values.join(',') ?? '';
    }
    const invalid: boolean = (!criteriaValues || criteriaValues.match(/^[\s]+$/) !== null);
    return !invalid;
}

function isCritieraWeightValid(criteria: Criteria): boolean {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaWeight: string;
    if (criteriaEl) {
        criteriaWeight = (criteriaEl.querySelector('#criteriaWeight') as HTMLInputElement)?.value;
    } else {
        criteriaWeight = String(criteria.weight) ?? '';
    }
    const invalid: boolean = (isNaN(Number(criteriaWeight)) || criteriaWeight.match(/^((\+|-)?([0-9]+)(\.[0-9]+)?)|((\+|-)?\.?[0-9]+)$/) === null);
    return !invalid;
}

function saveAsTemplate(criteriaRef: CriteriaRefContainer, stateMgr: ShortlistItStateManager, success: () => void, exists: () => void, error: () => void, overwrite?: boolean): void {
    const criteria = validateCriteriaTemplateValues(criteriaRef);
    if (criteria) {
        if (criteria.name) {
            if (stateMgr.state.criteriaTemplates.has(criteria.name)) {
                if (!overwrite) {
                    exists();
                    return;
                }
            }
            const updated = stateMgr.state.criteriaTemplates;
            updated.set(criteria.name, criteria);
            store.set('criteriaTemplates', updated);
            stateMgr.setState({
                ...stateMgr.state,
                criteriaTemplates: updated
            });
            success();
        }
    } else {
        error();
    }
}

function validateCriteriaTemplateValues(criteriaRef: CriteriaRefContainer): Omit<Criteria, 'id'> {
    const cName = criteriaRef.name.current?.value;
    if (cName == null || cName == '') {
        return null;
    }
    const cType = criteriaRef.type.current?.value;
    if (cType == null || cType == '') {
        return null;
    }
    const cValues = criteriaRef.values.current?.value;
    if (cValues == null || cValues == '') {
        return null;
    }
    const cWeight = criteriaRef.weight.current?.value;
    if (cWeight == null || cWeight == '' || isNaN(Number(cWeight))) {
        return null;
    }
    const cMulti = criteriaRef.multi.current?.checked;
    return {
        name: cName,
        type: cType as CriteriaType,
        values: cValues.split(',').map(v => v.trim()),
        weight: Number(cWeight),
        allowMultiple: cMulti
    };
}

function saveCriteria(listId: string, criteriaId: string, criteriaRef: CriteriaRefContainer, stateMgr: ShortlistItStateManager): boolean {
    const valid = validateCriteriaTemplateValues(criteriaRef);
    if (valid) {
        const list = getList(listId, stateMgr);
        if (list) {
            const cIndex = list.criteria.findIndex(c => c.id === criteriaId);
            if (cIndex >= 0) {
                list.criteria.splice(cIndex, 1, {...valid, id: criteriaId});
                updateList(list.id, list, stateMgr);
            }
        }
        return true;
    }
    return false;
}

function confirmDeleteCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.setState({
        ...stateMgr.state,
        criteriaToBeDeleted: criteriaId
    });
}

type ShortlistItCriteriaEditModalProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist
    criteria: Criteria;
    onClose: () => void;
    onSave: () => void;
    show: boolean;
};

export function ShortlistItCriteriaEditModal(props: ShortlistItCriteriaEditModalProps) {
    const criteriaRef = createCriteriaRef(props.criteria);

    const [showSaveTemplateSuccess, setShowSaveTemplateSuccess] = useState(false);
    const onSaveTemplateSuccess = () => {
        setShowSaveTemplateSuccess(true);
        window.setTimeout(() => setShowSaveTemplateSuccess(false), 5000);
    }
    const [showSaveTemplateExists, setShowSaveTemplateExists] = useState(false);
    const onTemplateExists = () => {
        setShowSaveTemplateExists(true);
    }
    const [showSaveError, setShowSaveTemplateError] = useState(false);
    const onSaveError = () => {
        setShowSaveTemplateError(true);
        window.setTimeout(() => setShowSaveTemplateError(false), 5000);
    }

    const [criteriaNameValid, setCriteriaNameValid] = useState(isCriteriaNameValid(props.criteria, props.list));
    const [criteriaTypeValid, setCriteriaTypeValid] = useState(isCriteriaTypeValid(props.criteria));
    const [criteriaValuesValid, setCriteriaValuesValid] = useState(areCritieriaValuesValid(props.criteria));
    const [criteriaWeightValid, setCriteriaWeightValid] = useState(isCritieraWeightValid(props.criteria));
    const [criteriaMultiselectAllowed, setCriteriaMultiselectAllowed] = useState(isCriteriaMultiselectAllowed(props.criteria));
    const [criteriaValuesAllowed, setCriteriaValuesAllowed] = useState(doesCriteriaAllowValues(props.criteria));
    
    return (
        <ShortlistItModal
            variant="light"
            dismissible={true}
            onClose={props.onClose}
            heading="Edit Critieria"
            show={props.show}
        >
            <div id={props.criteria.id} className="d-flex flex-row justify-content-between criteria-list-item">
                <div className="d-flex flex-column justify-content-evently flex-grow-1 pe-1">
                    <Alert variant="danger" dismissible show={showSaveError}>
                        Criteria must have all values set to valid values in order to be Saved or used as a Template
                    </Alert>
                    <Alert variant="warning" dismissible show={showSaveTemplateExists} onClose={() => setShowSaveTemplateExists(false)}>
                        <div className="flex-row">
                            <p className="flex-grow-1 pe-1">Criteria with same name already exists... do you wish to overwrite it?</p>
                            <Button 
                                variant="danger" 
                                onClick={() => {
                                    setShowSaveTemplateExists(false);
                                    saveAsTemplate(criteriaRef, props.stateMgr, onSaveTemplateSuccess, onTemplateExists, onSaveError, true);
                                }}
                            >
                                Overwrite
                            </Button>
                        </div>
                    </Alert>
                    <Alert variant="success" dismissible show={showSaveTemplateSuccess}>
                        Criteria successfully saved as Template
                    </Alert>
                    <FloatingLabel controlId="criteriaName" label="Criteria Name">
                        <Form.Control 
                            ref={criteriaRef.name}
                            type="text" 
                            defaultValue={props.criteria.name} 
                            className={(!criteriaNameValid) ? 'is-invalid' : ''} 
                            onChange={() => setCriteriaNameValid(isCriteriaNameValid(props.criteria, props.list))} />
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaType" label="Criteria Type">
                        <Form.Select 
                            ref={criteriaRef.type}
                            aria-label="Criteria Type Select"
                            defaultValue={props.criteria.type}
                            className={(!criteriaTypeValid) ? 'is-invalid' : ''}
                            onChange={() => {
                                setCriteriaTypeValid(isCriteriaTypeValid(props.criteria));
                                setCriteriaMultiselectAllowed(isCriteriaMultiselectAllowed(props.criteria));
                                setCriteriaValuesAllowed(doesCriteriaAllowValues(props.criteria));
                            }}>
                            <option value="worst-to-best">worst-to-best</option>
                            <option value="yes-no">yes-no</option>
                            <option value="positives">positives</option>
                            <option value="negatives">negatives</option>
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaValues" label="Criteria Values">
                        <Form.Control 
                            ref={criteriaRef.values}
                            type="text" 
                            placeholder="comma separated values" 
                            defaultValue={(criteriaValuesAllowed) ? props.criteria.values.join(',') : 'yes,no'} 
                            disabled={!criteriaValuesAllowed} 
                            className={(!criteriaValuesValid) ? 'is-invalid' : ''}
                            onChange={() => setCriteriaValuesValid(areCritieriaValuesValid(props.criteria))} />
                    </FloatingLabel>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex flex-wrap align-content-around px-1">
                            <p className="pe-1 pt-1 mb-1">Multiselect?</p>
                            <Form.Check
                                className="pt-1"
                                ref={criteriaRef.multi}
                                type="switch" 
                                aria-label="Allow Multiselect?" 
                                defaultChecked={(criteriaMultiselectAllowed) ? props.criteria.allowMultiple : false}
                                disabled={!criteriaMultiselectAllowed}
                            />
                        </div>
                        <FloatingLabel controlId="criteriaWeight" label="Weighting">
                            <Form.Control
                                ref={criteriaRef.weight}
                                type="text" 
                                placeholder="numeric points multiplier"
                                defaultValue={props.criteria.weight ?? 1} 
                                className={(!criteriaWeightValid) ? 'is-invalid' : ''}
                                onChange={() => setCriteriaWeightValid(isCritieraWeightValid(props.criteria))} />
                        </FloatingLabel>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-between ps-1">
                    <ShortlistItTooltip id={`save-criteria-${props.criteria.id}`} text="Save Criteria">
                        <Button variant="success" aria-label="Save Criteria" onClick={() => {
                            if (saveCriteria(props.list.id, props.criteria.id, criteriaRef, props.stateMgr)) {
                                props.onClose();
                                props.onSave?.();
                            } else {
                                onSaveError();
                            }
                        }}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`cancel-edit-criteria-${props.criteria.id}`} text="Cancel Edit">
                        <Button variant="warning" aria-label="Cancel Edit" onClick={() => props.onClose()}>
                            <BootstrapIcon icon="x-circle" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`save-criteria-template-${props.criteria.id}`} text="Save as Template">
                        <Button variant="info" aria-label="Save as Template" onClick={() => saveAsTemplate(criteriaRef, props.stateMgr, onSaveTemplateSuccess, onTemplateExists, onSaveError)}>
                            <BootstrapIcon icon="file-earmark-arrow-down" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`delete-criteria-${props.criteria.id}`} text="Delete Criteria">
                        <Button variant="danger" aria-label="Delete Criteria" onClick={() => {
                            props.onClose(); // close this modal...
                            confirmDeleteCriteria(props.criteria.id, props.stateMgr); // ...and open confirmation modal
                        }}>
                            <BootstrapIcon icon="trash" />
                        </Button>
                    </ShortlistItTooltip>
                </div>
            </div>
        </ShortlistItModal>
    );
}

type ShortlistItListCriteriaProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    criteria: Criteria;
};

function ShortlistItListCriteria(props: ShortlistItListCriteriaProps) {
    const [editing, setEditing] = useState(false);
    const [editIcon, setEditIcon] = useState('pencil-square');
    return (
        <th scope="col">
            <ShortlistItCriteriaEditModal
                stateMgr={props.stateMgr}
                criteria={props.criteria}
                list={props.list}
                onClose={() => setEditing(false)}
                onSave={() => {
                    setEditIcon('check-circle');
                    setTimeout(() => setEditIcon('pencil-square'), 3000);
                }}
                show={editing} />
            <div className="d-flex flex-nowrap align-items-end">
                {(props.list.archived) ? <></> : <ShortlistItTooltip id={`edit-criteria-${props.criteria.id}`} text="Edit Criteria">
                    <BootstrapIcon
                        icon={editIcon}
                        onClick={() => {
                            if (!editing) {
                                setEditing(true);
                            }
                        }} />
                </ShortlistItTooltip>}<p className="d-flex flex-wrap mb-0 ps-1">{props.criteria.name}</p>
            </div>
        </th>
    )
}

export default function ShortlistItListBodyWide(props: ShortlistItListBodyProps) {
    const variant = (props.list.archived) ? 'table-secondary' : 'table-dark';
    return (
        <table className="table table-hover table-striped">
            <thead>
                <tr className={variant}>
                    <th scope="col">rank</th>
                    <th scope="col">description</th>
                    {props.list.criteria.map(c => <ShortlistItListCriteria key={c.id} criteria={c} list={props.list} stateMgr={props.stateMgr} />)}
                    {(props.list.archived) ? <></> : <th scope="col"><ShortlistItListCriteriaAddNewDropdown stateMgr={props.stateMgr} list={props.list} /></th>}
                </tr>
            </thead>
            <tbody>
                {props.list.entries.map(e => {
                    return (
                        <ShortlistItListEntryWide
                            key={e.id}
                            stateMgr={props.stateMgr}
                            list={props.list}
                            entry={e}
                        />
                    );
                })}
                {getAddEntryButton(props)}
            </tbody>
        </table>
    );
}