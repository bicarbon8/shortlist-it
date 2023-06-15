import React, { useState } from "react";
import { Alert, Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { store } from "../utilities/storage";

export type ShortlistItListCriteriaListItemProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    criteria: Criteria;
    criteriaRef?: CriteriaRefContainer;
};

type ShortlistItListCriteriaListItemState = {
    multiselectAllowed: boolean;
    valuesAllowed: boolean;
    nameError: boolean;
    valuesError: boolean;
    weightError: boolean;
};

function validateType(props: ShortlistItListCriteriaListItemProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
    const criteriaEl = document.getElementById(`${props.criteria.id}`) as HTMLDivElement;
    const criteriaType: CriteriaType = (criteriaEl.querySelector('#criteriaType option:checked') as HTMLOptionElement)?.value as CriteriaType || 'worst-to-best';
    const allow: boolean = !!(criteriaType !== 'yes-no');
    setState({
        ...state,
        multiselectAllowed: allow, 
        valuesAllowed: allow
    });
}

function validateName(props: ShortlistItListCriteriaListItemProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
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

function validateValues(props: ShortlistItListCriteriaListItemProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
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

function validateWeight(props: ShortlistItListCriteriaListItemProps, state: ShortlistItListCriteriaListItemState, setState: React.Dispatch<React.SetStateAction<ShortlistItListCriteriaListItemState>>): void {
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
            stateMgr.state.criteriaTemplates.set(criteria.name, criteria);
            store.set('criteriaTemplates', stateMgr.state.criteriaTemplates);
            stateMgr.setState({...stateMgr.state});
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

function deleteCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.criteriaToBeDeleted = criteriaId;
    stateMgr.setState({...stateMgr.state});
}

export function ShortlistItListCriteriaItem(props: ShortlistItListCriteriaListItemProps) {
    const [state, setState] = useState<ShortlistItListCriteriaListItemState>({
        multiselectAllowed: !!(props.criteria.type !== 'yes-no'),
        valuesAllowed: !!(props.criteria.type !== 'yes-no'),
        nameError: false,
        valuesError: false,
        weightError: false,
    });

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
        <ListGroupItem id={props.criteria.id} variant="dark" className="d-flex flex-row justify-content-between criteria-list-item">
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
                                saveAsTemplate(props.criteriaRef, props.stateMgr, onShowSuccess, onShowExists, onShowError, true);
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
                        ref={props.criteriaRef.name}
                        type="text" 
                        defaultValue={props.criteria.name} 
                        className={(state.nameError) ? 'is-invalid' : ''} 
                        onChange={() => validateName(props, state, setState)} />
                </FloatingLabel>
                <FloatingLabel controlId="criteriaType" label="Criteria Type">
                    <Form.Select 
                        ref={props.criteriaRef.type}
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
                        ref={props.criteriaRef.values}
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
                            ref={props.criteriaRef.multi}
                            type="switch" 
                            aria-label="Allow Multiselect?" 
                            defaultChecked={(state.multiselectAllowed) ? props.criteria.allowMultiple : false}
                            disabled={!state.multiselectAllowed}
                        />
                    </div>
                    <FloatingLabel controlId="criteriaWeight" label="Weighting">
                        <Form.Control
                            ref={props.criteriaRef.weight}
                            type="text" 
                            placeholder="numeric points multiplier"
                            defaultValue={props.criteria.weight ?? 1} 
                            className={(state.weightError) ? 'is-invalid' : ''}
                            onChange={() => validateWeight(props, state, setState)} />
                    </FloatingLabel>
                </div>
            </div>
            <div className="d-flex flex-column justify-content-between ps-1">
                <ShortlistItTooltip id={`save-criteria-template-${props.criteria.id}`} text="Save as Template">
                    <Button variant="info" onClick={() => saveAsTemplate(props.criteriaRef, props.stateMgr, onShowSuccess, onShowExists, onShowError)}>
                        <BootstrapIcon icon="file-earmark-arrow-down" />
                    </Button>
                </ShortlistItTooltip>
                <ShortlistItTooltip id={`delete-criteria-${props.criteria.id}`} text="Delete Criteria">
                    <Button variant="danger" onClick={() => deleteCriteria(props.criteria.id, props.stateMgr)}>
                        <BootstrapIcon icon="trash" />
                    </Button>
                </ShortlistItTooltip>
            </div>
        </ListGroupItem>
    );
}