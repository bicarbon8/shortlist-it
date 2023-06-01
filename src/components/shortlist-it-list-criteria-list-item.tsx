import React, { useState } from "react";
import { Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItStateManager, deleteCriteria } from "./shortlist-it";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

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

export function ShortlistItListCriteriaListItem(props: ShortlistItListCriteriaListItemProps) {
    const [state, setState] = useState<ShortlistItListCriteriaListItemState>({
        multiselectAllowed: !!(props.criteria.type !== 'yes-no'),
        valuesAllowed: !!(props.criteria.type !== 'yes-no'),
        nameError: false,
        valuesError: false
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
                <Form.Check 
                    ref={props.criteriaRef.multi}
                    type="switch" 
                    label="Allow Multiselect?" 
                    defaultChecked={(state.multiselectAllowed) ? props.criteria.allowMultiple : false}
                    disabled={!state.multiselectAllowed} /> 
            </div>
            <div className="d-flex flex-column justify-content-between ps-1">
                <ShortlistItTooltip id={`delete-criteria-${props.criteria.id}`} text="Delete Criteria">
                    <Button variant="danger" onClick={() => deleteCriteria(props.list.id, props.criteria.id, props.stateMgr)}>
                        <BootstrapIcon icon="trash" />
                    </Button>
                </ShortlistItTooltip>
            </div>
        </ListGroupItem>
    );
}