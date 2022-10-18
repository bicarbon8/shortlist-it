import React from "react";
import { Button, ListGroupItem } from "react-bootstrap";
import { ShortlistItListEntryValuesList } from "./shortlist-it-list-entry-values-list";

type ShortlistItListEntryValuesListItemProps = {
    parent: ShortlistItListEntryValuesList;
    criteriaName: string;
};

export class ShortlistItListEntryValuesListItem extends React.Component<ShortlistItListEntryValuesListItemProps> {
    render() {
        return (
            <ListGroupItem key={this.criteriaName} className="d-flex justify-content-between align-content-start flex-wrap">
                <span className="fw-bold text-nowrap">{this.criteriaName}:</span>
                <div className="d-flex justify-content-evenly align-content-between flex-wrap">
                    {this.allPossibleValues.map(val => this.getValueNode(val))}
                </div>
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

    getValueNode(val: string) {
        const variant = (this.selectedValues.includes(val)) ? 'primary' : 'outline-primary';
        return <Button key={val} className="my-1" variant={variant}>{val}</Button>
    }
}