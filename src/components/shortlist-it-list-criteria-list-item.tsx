import React from "react";
import { Button, FloatingLabel, Form, InputGroup, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListCriteriaList } from "./shortlist-it-list-criteria-list";

type ShortlistItListCriteriaListItemProps = {
    parent: ShortlistItListCriteriaList;
    criteria: Criteria;
};

type ShortlistItListCriteriaListItemState = {
    multiselectAllowed: boolean;
    valuesAllowed: boolean;
};

export class ShortlistItListCriteriaListItem extends React.Component<ShortlistItListCriteriaListItemProps, ShortlistItListCriteriaListItemState> {
    constructor(props: ShortlistItListCriteriaListItemProps) {
        super(props);
        this.state = {
            multiselectAllowed: !!(this.props.criteria.type !== 'yes-no'),
            valuesAllowed: !!(this.props.criteria.type !== 'yes-no')
        };
    }
    
    render() {
        return (
            <ListGroupItem id={this.criteria.id} variant="dark" className="d-flex flex-column justify-content-evenly criteria-list-item">
                <InputGroup>
                    <FloatingLabel controlId="criteriaName" label="Criteria Name">
                        <Form.Control type="text" defaultValue={this.criteria.name} />
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaType" label="Criteria Type">
                        <Form.Select aria-label="Criteria Type Select" defaultValue={this.criteria.type} onChange={() => this.validate()}>
                            <option value="worst-to-best">worst-to-best</option>
                            <option value="yes-no">yes-no</option>
                            <option value="positives">positives</option>
                            <option value="negatives">negatives</option>
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaValues" label="Criteria Values">
                        <Form.Control 
                            type="text" 
                            placeholder="comma separated values" 
                            defaultValue={(this.valuesAllowed) ? this.criteria.values.join(',') : 'yes,no'} 
                            disabled={!this.valuesAllowed} />
                    </FloatingLabel>
                </InputGroup>
                <div className="d-flex flex-row justify-content-between">
                    <Form.Check 
                        type="switch" 
                        label="Allow Multiselect?" 
                        defaultChecked={(this.multiselectAllowed) ? this.criteria.allowMultiple : false}
                        disabled={!this.multiselectAllowed} /> 
                    <Button variant="outline-primary" onClick={() => this.deleteCriteria(this.criteria.id)}><BootstrapIcon icon="trash" /></Button>
                </div>
            </ListGroupItem>
        );
    }

    get parent(): ShortlistItListCriteriaList {
        return this.props.parent;
    }

    get criteria(): Criteria {
        return this.props.criteria;
    }

    get multiselectAllowed(): boolean {
        return this.state.multiselectAllowed;
    }

    get valuesAllowed(): boolean {
        return this.state.valuesAllowed;
    }

    validate(): void {
        const criteriaEl = document.getElementById(`${this.criteria.id}`) as HTMLDivElement;
        const criteriaName: string = (criteriaEl.querySelector('#criteriaName') as HTMLInputElement).value;
        const criteriaType: CriteriaType = (criteriaEl.querySelector('#criteriaType option:checked') as HTMLOptionElement)?.value as CriteriaType || 'worst-to-best';
        const criteriaValues: Array<string> = (criteriaEl.querySelector('#criteriaValues') as HTMLInputElement).value
            .split(',')
            .map(v => v.trim());
        const criteriaMultiselect: boolean = (criteriaEl.querySelector("input[type='checkbox']") as HTMLInputElement)?.checked || false;
        const allow: boolean = !!(criteriaType !== 'yes-no');
        this.setState({multiselectAllowed: allow, valuesAllowed: allow});
    }

    deleteCriteria(id: string): void {
        const index = this.parent.criteria.findIndex(c => c.id === id);
        if (index >= 0) {
            this.parent.criteria.splice(index, 1);
            this.parent.forceUpdate();
        }
    }
}