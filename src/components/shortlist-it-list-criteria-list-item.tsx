import React from "react";
import { Button, FloatingLabel, Form, InputGroup, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListCriteriaList } from "./shortlist-it-list-criteria-list";

type ShortlistItListCriteriaListItemProps = {
    parent: ShortlistItListCriteriaList;
    criteria: Criteria;
}

export class ShortlistItListCriteriaListItem extends React.Component<ShortlistItListCriteriaListItemProps> {
    render() {
        return (
            <ListGroupItem id={this.criteria.id} variant="dark" key={this.criteria.name} className="d-flex flex-column justify-content-evenly">
                <InputGroup>
                    <FloatingLabel controlId="criteriaName" label="Criteria Name">
                        <Form.Control type="text" value={this.criteria.name} onChange={() => null} />
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaType" label="Criteria Type">
                        <Form.Select aria-label="Default select example">
                            <option value="worst-to-best" selected={this.criteria.type === 'worst-to-best'}>worst-to-best</option>
                            <option value="boolean" selected={this.criteria.type === 'boolean'}>boolean</option>
                            <option value="positives" selected={this.criteria.type === 'positives'}>positives</option>
                            <option value="negatives" selected={this.criteria.type === 'negatives'}>negatives</option>
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaValues" label="Criteria Values">
                        <Form.Control type="text" placeholder="comma separated values" value={this.criteria.values.join(',')} onChange={() => null} />
                    </FloatingLabel>
                </InputGroup>
                <div className="d-flex flex-row justify-content-between">
                    <Form.Check type="switch" label="Allow Multiselect?" checked={this.criteria.allowMultiple} /> 
                    <Button onClick={() => null}><BootstrapIcon icon="trash" /></Button>
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
}