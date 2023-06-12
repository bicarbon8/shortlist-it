import React, { useState } from "react";
import { ShortlistItListBodyProps, addNewEntry } from "../compact/shortlist-it-list-body-compact";
import ShortlistItListEntryWide from "./shortlist-it-list-entry-wide";
import { BootstrapIcon } from "../bootstrap-icon";
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap";
import { Criteria } from "../../types/criteria/criteria";
import { Shortlist } from "../../types/shortlist";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../shortlist-it-modal";
import { CriteriaType } from "../../types/criteria/criteria-type";
import { CriteriaRefContainer } from "../../types/criteria/criteria-ref-container";
import { store } from "../../utilities/storage";
import { ShortlistItTooltip } from "../shortlist-it-tooltip";
import { createCriteriaRef } from "../shortlist-it-list-header";
import ShortlistItListCriteriaAddNewDropdown from "../shortlist-it-list-criteria-add-new-dropdown";
import { getList } from "../../component-actions/list-actions";

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

function validateType(props: ShortlistItCriteriaEditModalProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
    const criteriaEl = document.getElementById(`${props.criteria.id}`) as HTMLDivElement;
    const criteriaType: CriteriaType = (criteriaEl.querySelector('#criteriaType option:checked') as HTMLOptionElement)?.value as CriteriaType || 'worst-to-best';
    const allow: boolean = !!(criteriaType !== 'yes-no');
    setState({
        ...state,
        multiselectAllowed: allow, 
        valuesAllowed: allow
    });
}

function validateName(props: ShortlistItCriteriaEditModalProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
    const criteriaEl = document.getElementById(`${props.criteria.id}`) as HTMLDivElement;
    const criteriaName: string = (criteriaEl.querySelector('#criteriaName') as HTMLInputElement).value;
    const invalid: boolean = (!criteriaName || criteriaName.match(/^[\s]+$/) !== null || props.list.criteria
        .filter(i => i.id !== props.criteria.id)
        .map(i => i.name)
        .includes(criteriaName));
    setState({
        ...state,
        nameError: invalid
    });
}

function validateValues(props: ShortlistItCriteriaEditModalProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
    const criteriaEl = document.getElementById(`${props.criteria.id}`) as HTMLDivElement;
    const criteriaName: string = (criteriaEl.querySelector('#criteriaValues') as HTMLInputElement).value;
    const invalid: boolean = (!criteriaName || criteriaName.match(/^[\s]+$/) !== null || props.list.criteria
        .filter(i => i.id !== props.criteria.id)
        .map(i => i.name)
        .includes(criteriaName));
    setState({
        ...state,
        valuesError: invalid
    });
}

function validateWeight(props: ShortlistItCriteriaEditModalProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
    const criteriaEl = document.getElementById(`${props.criteria.id}`) as HTMLDivElement;
    const criteriaWeight: string = (criteriaEl.querySelector('#criteriaWeight') as HTMLInputElement).value;
    const invalid: boolean = (isNaN(Number(criteriaWeight)) || criteriaWeight.match(/^((\+|-)?([0-9]+)(\.[0-9]+)?)|((\+|-)?\.?[0-9]+)$/) === null);
    setState({
        ...state,
        weightError: invalid
    });
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

function saveCriteria(listId: string, criteriaId: string, criteriaRef: CriteriaRefContainer, stateMgr: ShortlistItStateManager, onClose: () => void): void {
    const valid = validateCriteriaTemplateValues(criteriaRef);
    if (valid) {
        const list = getList(listId, stateMgr);
        if (list) {
            const cIndex = list.criteria.findIndex(c => c.id === criteriaId);
            if (cIndex >= 0) {
                list.criteria.splice(cIndex, 1, {...valid, id: criteriaId});
                const lIndex = stateMgr.state.lists.findIndex(l => l.id === listId);
                if (lIndex >= 0) {
                    stateMgr.state.lists.splice(lIndex, 1, list);
                    stateMgr.setState(stateMgr.state);
                }
            }
        }
        onClose();
    }
}

function deleteCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): void {
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
    show: boolean;
};

export function ShortlistItCriteriaEditModal(props: ShortlistItCriteriaEditModalProps) {
    const [state, setState] = useState<ShortlistItListCriteriaListItemState>({
        multiselectAllowed: !!(props.criteria?.type !== 'yes-no'),
        valuesAllowed: !!(props.criteria?.type !== 'yes-no'),
        nameError: false,
        valuesError: false,
        weightError: false,
    });

    const criteriaRef = createCriteriaRef(props.criteria);

    const [showSaveTemplateSuccess, setShowSaveTemplateSuccess] = useState(false);
    const onShowSuccess = () => {
        setShowSaveTemplateSuccess(true);
        window.setTimeout(() => setShowSaveTemplateSuccess(false), 5000);
    }
    const [showSaveTemplateExists, setShowSaveTemplateExists] = useState(false);
    const onShowExists = () => {
        setShowSaveTemplateExists(true);
    }
    const [showSaveTemplateError, setShowSaveTemplateError] = useState(false);
    const onShowError = () => {
        setShowSaveTemplateError(true);
        window.setTimeout(() => setShowSaveTemplateError(false), 5000);
    }
    
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
                    <Alert variant="danger" dismissible show={showSaveTemplateError}>
                        Criteria must have all values set to valid values in order to be used as a Template
                    </Alert>
                    <Alert variant="warning" dismissible show={showSaveTemplateExists} onClose={() => setShowSaveTemplateExists(false)}>
                        <div className="flex-row">
                            <p className="flex-grow-1 pe-1">Criteria with same name already exists... do you wish to overwrite it?</p>
                            <Button 
                                variant="danger" 
                                onClick={() => {
                                    setShowSaveTemplateExists(false);
                                    saveAsTemplate(criteriaRef, props.stateMgr, onShowSuccess, onShowExists, onShowError, true);
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
                            className={(state.nameError) ? 'is-invalid' : ''} 
                            onChange={() => validateName(props, state, setState)} />
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaType" label="Criteria Type">
                        <Form.Select 
                            ref={criteriaRef.type}
                            aria-label="Criteria Type Select" 
                            defaultValue={props.criteria.type} 
                            onChange={() => validateType(props, state, setState)}>
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
                            defaultValue={(state.valuesAllowed) ? props.criteria.values.join(',') : 'yes,no'} 
                            disabled={!state.valuesAllowed} 
                            className={(state.valuesError) ? 'is-invalid' : ''}
                            onChange={() => validateValues(props, state, setState)} />
                    </FloatingLabel>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex flex-wrap align-content-around px-1">
                            <p className="pe-1 pt-1 mb-1">Multiselect?</p>
                            <Form.Check
                                className="pt-1"
                                ref={criteriaRef.multi}
                                type="switch" 
                                aria-label="Allow Multiselect?" 
                                defaultChecked={(state.multiselectAllowed) ? props.criteria.allowMultiple : false}
                                disabled={!state.multiselectAllowed}
                            />
                        </div>
                        <FloatingLabel controlId="criteriaWeight" label="Weighting">
                            <Form.Control
                                ref={criteriaRef.weight}
                                type="text" 
                                placeholder="numeric points multiplier"
                                defaultValue={props.criteria.weight ?? 1} 
                                className={(state.weightError) ? 'is-invalid' : ''}
                                onChange={() => validateWeight(props, state, setState)} />
                        </FloatingLabel>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-between ps-1">
                    <ShortlistItTooltip id={`save-criteria-${props.criteria.id}`} text="Save Criteria">
                        <Button variant="success" onClick={() => {
                            saveCriteria(props.list.id, props.criteria.id, criteriaRef, props.stateMgr, props.onClose);
                        }}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`save-criteria-template-${props.criteria.id}`} text="Save as Template">
                        <Button variant="info" onClick={() => saveAsTemplate(criteriaRef, props.stateMgr, onShowSuccess, onShowExists, onShowError)}>
                            <BootstrapIcon icon="file-earmark-arrow-down" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`delete-criteria-${props.criteria.id}`} text="Delete Criteria">
                        <Button variant="danger" onClick={() => {
                            props.onClose(); // close this modal...
                            deleteCriteria(props.criteria.id, props.stateMgr); // ...and open confirmation modal
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
    return (
        <th scope="col">
            <ShortlistItCriteriaEditModal
                stateMgr={props.stateMgr}
                criteria={props.criteria}
                list={props.list}
                onClose={() => setEditing(false)}
                show={editing} />
            <div className="d-flex flex-nowrap align-items-end">
                {(props.list.archived) ? <></> : <ShortlistItTooltip id={`edit-criteria-${props.criteria.id}`} text="Edit Criteria">
                    <BootstrapIcon
                        icon="pencil-square"
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