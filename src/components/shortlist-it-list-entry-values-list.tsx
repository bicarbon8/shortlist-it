import React from "react";
import { ListGroup } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { EntryValuesRefContainer } from "../types/entries/entry-values-ref-container";
import { Shortlist } from "../types/shortlist";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListEntryValuesListItem } from "./shortlist-it-list-entry-values-list-item";

type ShortlistItListEntryValuesListProps = {
    app: ShortlistIt;
    listId: string;
    entryId: string;
    valuesRefs: Array<EntryValuesRefContainer>;
}

export class ShortlistItListEntryValuesList extends React.Component<ShortlistItListEntryValuesListProps> {
    render() {
        const criteriaNames = Array.from(this.list.criteria.map(c => c.name));
        return (
            <ListGroup>
                {criteriaNames.map(criteriaName => <ShortlistItListEntryValuesListItem 
                    valuesRef={this.props.valuesRefs.find(r => r.criteriaName === criteriaName)}
                    key={criteriaName} 
                    parent={this} 
                    criteriaName={criteriaName} 
                    multiselect={this.isMultiselect(criteriaName)} />
                )}
            </ListGroup>
        );
    }

    get app(): ShortlistIt {
        return this.props.app;
    }

    get list(): Shortlist {
        return this.app.getList(this.props.listId);
    }

    get entry(): Entry {
        return this.app.getEntry(this.props.listId, this.props.entryId);
    }

    isMultiselect(criteriaName: string): boolean {
        return this.list.criteria.find(c => c.name === criteriaName)?.allowMultiple || false;
    }
}