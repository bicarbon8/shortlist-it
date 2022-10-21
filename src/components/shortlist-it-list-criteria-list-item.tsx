import React from "react";
import { Button, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListCriteriaListItemProps = {
    app: ShortlistIt
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

export class ShortlistItListCriteriaListItem extends React.Component<ShortlistItListCriteriaListItemProps, ShortlistItListCriteriaListItemState> {
    constructor(props: ShortlistItListCriteriaListItemProps) {
        super(props);
        this.state = {
            multiselectAllowed: !!(this.props.criteria.type !== 'yes-no'),
            valuesAllowed: !!(this.props.criteria.type !== 'yes-no'),
            nameError: false,
            valuesError: false
        };
    }
    
    render() {
        return (
            <ListGroupItem id={this.criteria.id} variant="dark" className="d-flex flex-row justify-content-between criteria-list-item">
                <div className="d-flex flex-column justify-content-evently flex-grow-1 pe-1">
                    <FloatingLabel controlId="criteriaName" label="Criteria Name">
                        <Form.Control 
                            ref={this.props.criteriaRef.name}
                            type="text" 
                            defaultValue={this.criteria.name} 
                            className={(this.nameError) ? 'is-invalid' : ''} 
                            onChange={() => this.validateName()} />
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaType" label="Criteria Type">
                        <Form.Select 
                            ref={this.props.criteriaRef.type}
                            aria-label="Criteria Type Select" 
                            defaultValue={this.criteria.type} 
                            onChange={() => this.validateType()}>
                            <option value="worst-to-best">worst-to-best</option>
                            <option value="yes-no">yes-no</option>
                            <option value="positives">positives</option>
                            <option value="negatives">negatives</option>
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaValues" label="Criteria Values">
                        <Form.Control 
                            ref={this.props.criteriaRef.values}
                            type="text" 
                            placeholder="comma separated values" 
                            defaultValue={(this.valuesAllowed) ? this.criteria.values.join(',') : 'yes,no'} 
                            disabled={!this.valuesAllowed} 
                            className={(this.valuesError) ? 'is-invalid' : ''}
                            onChange={() => this.validateValues()} />
                    </FloatingLabel>
                    <Form.Check 
                        ref={this.props.criteriaRef.multi}
                        type="switch" 
                        label="Allow Multiselect?" 
                        defaultChecked={(this.multiselectAllowed) ? this.criteria.allowMultiple : false}
                        disabled={!this.multiselectAllowed} /> 
                </div>
                <div className="d-flex flex-column justify-content-between ps-1">
                    <ShortlistItTooltip id={`delete-criteria-${this.criteria.id}`} text="Delete Criteria">
                        <Button variant="danger" onClick={() => this.props.app.deleteCriteria(this.props.list.id, this.criteria.id)}>
                            <BootstrapIcon icon="trash" />
                        </Button>
                    </ShortlistItTooltip>
                </div>
            </ListGroupItem>
        );
    }

    get criteria(): Criteria {
        return this.props.criteria;
    }

    get allCriteriaItems(): Array<Criteria> {
        return this.props.list.criteria;
    }

    get multiselectAllowed(): boolean {
        return this.state.multiselectAllowed;
    }

    get valuesAllowed(): boolean {
        return this.state.valuesAllowed;
    }

    get nameError(): boolean {
        return this.state.nameError;
    }

    get valuesError(): boolean {
        return this.state.valuesError;
    }

    validateType(): void {
        const criteriaEl = document.getElementById(`${this.criteria.id}`) as HTMLDivElement;
        const criteriaType: CriteriaType = (criteriaEl.querySelector('#criteriaType option:checked') as HTMLOptionElement)?.value as CriteriaType || 'worst-to-best';
        const allow: boolean = !!(criteriaType !== 'yes-no');
        this.setState({multiselectAllowed: allow, valuesAllowed: allow});
    }

    validateName(): void {
        const criteriaEl = document.getElementById(`${this.criteria.id}`) as HTMLDivElement;
        const criteriaName: string = (criteriaEl.querySelector('#criteriaName') as HTMLInputElement).value;
        const invalid: boolean = (!criteriaName || criteriaName.match(/^[\s]+$/) !== null || this.allCriteriaItems
            .filter(i => i.id !== this.criteria.id)
            .map(i => i.name)
            .includes(criteriaName));
        this.setState({nameError: invalid});
    }

    validateValues(): void {
        const criteriaEl = document.getElementById(`${this.criteria.id}`) as HTMLDivElement;
        const criteriaName: string = (criteriaEl.querySelector('#criteriaValues') as HTMLInputElement).value;
        const invalid: boolean = (!criteriaName || criteriaName.match(/^[\s]+$/) !== null || this.allCriteriaItems
            .filter(i => i.id !== this.criteria.id)
            .map(i => i.name)
            .includes(criteriaName));
        this.setState({valuesError: invalid});
    }
}