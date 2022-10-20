import React from "react";
import { Card } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";
import { CriteriaType } from "../types/criteria/criteria-type";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListHeader } from "./shortlist-it-list-header";
import { Criteria } from "../types/criteria/criteria";

type ShortlistItListProps = {
    parent: ShortlistIt;
    list: Shortlist;
}

type ShortlistItListState = {
    editing: boolean;
}

export class ShortlistItList extends React.Component<ShortlistItListProps, ShortlistItListState> {
    constructor(props: ShortlistItListProps) {
        super(props);
        this.state = {
            editing: false
        };
    }
    
    render() {
        const bgColor = (this.list.archived) ? 'bg-secondary' : '';
        return (
            <Card id={this.list.id} className={`m-1 min-width-300 max-width-700 ${bgColor}`}>
                <Card.Body className="d-flex flex-column justify-content-center align-content-center">
                    <ShortlistItListHeader parent={this} />
                    <ShortlistItListBody parent={this} />
                </Card.Body>
            </Card>
        );
    }

    get parent(): ShortlistIt {
        return this.props.parent
    }

    get list(): Shortlist {
        return this.props.list;
    }

    get editing(): boolean {
        return this.state.editing;
    }

    startEditing(): void {
        this.setState({editing: true});
    }

    doneEditing(): void {
        // get changes
        const cardElement = document.getElementById(`${this.list.id}`);
        if (cardElement) {
            const title = (cardElement.querySelector('.list-header-title-input') as HTMLInputElement)?.value;
            const criteriaList: Array<Criteria> = Array.from(cardElement.querySelectorAll('.criteria-list-item').values())
                .map(criteriaEl => {
                    const criteriaId: string = criteriaEl.id;
                    const criteriaName: string = (criteriaEl.querySelector('#criteriaName') as HTMLInputElement).value;
                    const criteriaType: CriteriaType = (criteriaEl.querySelector('#criteriaType option:checked') as HTMLOptionElement)?.value as CriteriaType || 'worst-to-best';
                    const criteriaValues: Array<string> = (criteriaEl.querySelector('#criteriaValues') as HTMLInputElement).value
                        .split(',')
                        .map(v => v.trim());
                    const criteriaMultiselect: boolean = (criteriaEl.querySelector("input[type='checkbox']") as HTMLInputElement)?.checked || false;
                    return { id: criteriaId, name: criteriaName, type: criteriaType, values: criteriaValues, allowMultiple: criteriaMultiselect } as Criteria;
                });
            const updated: Shortlist = {id: this.list.id, title: title, criteria: criteriaList, entries: this.parent.getList(this.list.id)?.entries || []};
            this.parent.updateList(updated);
            this.setState({editing: false});
        }
    }

    archive(): void {
        this.parent.setArchivedState(this.list.id, true);
    }

    unarchive(): void {
        this.parent.setArchivedState(this.list.id, false);
    }

    expandAll(): void {
        
    }

    collapseAll(): void {

    }
}