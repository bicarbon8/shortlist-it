import React, { useState } from "react";
import { Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "../component-actions/list-actions";
import { store } from "../utilities/storage";

type ShortlistItListCriteriaListItemProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    criteria: Criteria;
    criteriaRef: CriteriaRefContainer;
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

function saveAsTemplate(criteriaRef: CriteriaRefContainer, stateMgr: ShortlistItStateManager): void {
    const criteria = validateCriteriaTemplateValues(criteriaRef);
    if (criteria) {
        if (criteria.name) {
            if (stateMgr.state.criteriaTemplates.has(criteria.name)) {
                const result = confirm(`Criteria template named '${criteria.name}' is already in use. Are you sure you wish to overwrite it?`);
                if (!result) {
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
            alert(`new Criteria Template: '${criteria.name}' added`);
        }
    } else {
        alert(`Criteria must have values set for all fields in order to be used as a Template`);
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

function deleteCriteria(listId: string, criteriaId: string, stateMgr: ShortlistItStateManager): void {
    const list = getList(listId, stateMgr);
    if (list) {
        const index = list.criteria.findIndex(c => c.id === criteriaId);
        if (index >= 0) {
            const criteria = list.criteria[index];
            const confirmed: boolean = window.confirm(`are you sure you want to delete criteria: '${criteria.name}' from list '${list.title}'? this action cannot be undone and will remove all values associated with the criteria from any entries in the list`)
            if (confirmed) {
                list.criteria.splice(index, 1);
                updateList(listId, list, stateMgr);
            }
        }
    }
}

export function ShortlistItListCriteriaListItem(props: ShortlistItListCriteriaListItemProps) {
    const [state, setState] = useState<ShortlistItListCriteriaListItemState>({
        multiselectAllowed: !!(props.criteria.type !== 'yes-no'),
        valuesAllowed: !!(props.criteria.type !== 'yes-no'),
        nameError: false,
        valuesError: false,
        weightError: false,
    });
    
    return (
        <ListGroupItem id={props.criteria.id} variant="dark" className="d-flex flex-row justify-content-between criteria-list-item">
            <div className="d-flex flex-column justify-content-evently flex-grow-1 pe-1">
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
                    <Button variant="info" onClick={() => saveAsTemplate(props.criteriaRef, props.stateMgr)}>
                        <BootstrapIcon icon="file-earmark-arrow-down" />
                    </Button>
                </ShortlistItTooltip>
                <ShortlistItTooltip id={`delete-criteria-${props.criteria.id}`} text="Delete Criteria">
                    <Button variant="danger" onClick={() => deleteCriteria(props.list.id, props.criteria.id, props.stateMgr)}>
                        <BootstrapIcon icon="trash" />
                    </Button>
                </ShortlistItTooltip>
            </div>
        </ListGroupItem>
    );
}