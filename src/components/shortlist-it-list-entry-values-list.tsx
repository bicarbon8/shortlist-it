import React from "react";
import { ListGroup } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListEntryValuesListItem } from "./shortlist-it-list-entry-values-list-item";

type ShortlistItListEntryValuesListProps = {
    app: ShortlistIt;
    listId: string;
    entryId: string;
}

export class ShortlistItListEntryValuesList extends React.Component<ShortlistItListEntryValuesListProps> {
    render() {
        const criteriaNames = Array.from(this.entry.values.keys());
        return (
            <ListGroup>
                {criteriaNames.map(criteriaName => <ShortlistItListEntryValuesListItem 
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