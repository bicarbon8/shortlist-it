import React from "react";
import { Col, FloatingLabel, Form, ListGroupItem } from "react-bootstrap";
import { EntryValuesRefContainer } from "../types/entries/entry-values-ref-container";
import { ShortlistItListEntryValuesList } from "./shortlist-it-list-entry-values-list";

type ShortlistItListEntryValuesListItemProps = {
    parent: ShortlistItListEntryValuesList;
    criteriaName: string;
    multiselect: boolean;
    valuesRef: EntryValuesRefContainer;
};

type ShortlistItListEntryValuesListItemState = {
    updatedValues: Array<string>;
}

export class ShortlistItListEntryValuesListItem extends React.Component<ShortlistItListEntryValuesListItemProps, ShortlistItListEntryValuesListItemState> {
    constructor(props: ShortlistItListEntryValuesListItemProps) {
        super(props);
        this.state = {
            updatedValues: new Array<string>()
        };
    }
    
    render() {
        return (
            <ListGroupItem key={this.criteriaName} className="d-flex justify-content-between align-content-start flex-wrap" variant="secondary">
                {this.getValuesSelector()}
            </ListGroupItem>
        );
    }

    get parent(): ShortlistItListEntryValuesList {
        return this.props.parent;
    }

    get criteriaName(): string {
        return this.props.criteriaName;
    }

    get selectedValues(): Array<string> {
        return this.parent.entry.values.get(this.criteriaName) || new Array<string>();
    }

    get allPossibleValues(): Array<string> {
        return this.parent.list.criteria
            .find(c => c.name === this.criteriaName)
            ?.values || new Array<string>();
    }

    getValuesSelector() {
        if (this.props.multiselect) {
            return (
                <Form.Group as={Col} controlId="entryValues">
                    <Form.Label column="sm">{this.criteriaName}</Form.Label>
                    <Form.Control ref={this.props.valuesRef.values} as="select" multiple defaultValue={this.selectedValues}>
                        {this.allPossibleValues.map(val => this.getValueNode(val))}
                    </Form.Control>
                </Form.Group>
            );
        } else {
            let selected: string;
            let invalid: string;
            if (this.selectedValues.length === 0) {
                selected = '';
                invalid = 'is-invalid';
            } else {
                selected = this.selectedValues[0];
                invalid = '';
            }
            return (
                <FloatingLabel className="w-100" controlId={`values-select-${this.criteriaName}`} label={this.criteriaName}>
                    <Form.Select 
                        ref={this.props.valuesRef.values} 
                        aria-label="Values Select" 
                        defaultValue={selected}
                        className={invalid}
                        onChange={(e) => this.validateSelection(e.target)}>
                        <option value="---" disabled={true} hidden={true}>Choose value...</option>
                        {this.allPossibleValues.map(val => this.getValueNode(val))}
                    </Form.Select>
                </FloatingLabel>
            )
        }
    }

    private getValueNode(val: string) {
        const selected: boolean = !!(this.selectedValues.includes(val));
        return <option key={val} value={val} defaultChecked={selected}>{val}</option>;
    }

    private validateSelection(target: HTMLSelectElement) {
        if (target.value !== '') {
            target.className = [...target.classList].filter(c => c !== 'is-invalid').join(' ');
        }
    }
}