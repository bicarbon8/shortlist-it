import React from "react";
import { ListGroup } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { ShortlistItListEntry } from "./shortlist-it-list-entry";
import { ShortlistItListEntryValuesListItem } from "./shortlist-it-list-entry-values-list-item";

type ShortlistItListEntryValuesListProps = {
    parent: ShortlistItListEntry;
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

    get parent(): ShortlistItListEntry {
        return this.props.parent;
    }

    get list(): Shortlist {
        return this.parent.list;
    }

    get entry(): Entry {
        return this.parent.entry;
    }

    isMultiselect(criteriaName: string): boolean {
        return this.list.criteria.find(c => c.name === criteriaName)?.allowMultiple || false;
    }
}