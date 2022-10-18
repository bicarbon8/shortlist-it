import React from "react";
import { v4 } from "uuid";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListCriteriaListItem } from "./shortlist-it-list-criteria-list-item";

type ShortlistItListCriteriaListProps = {
    parent: ShortlistItListBody;
};

export class ShortlistItListCriteriaList extends React.Component<ShortlistItListCriteriaListProps> {
    render() {
        return (
            <ListGroup>
                {this.criteria.map(c => <ShortlistItListCriteriaListItem parent={this} criteria={c} />)}
                <ListGroupItem
                    variant="info"
                    key="add_new_criteria" 
                    onClick={() => {
                        this.criteria.push({id: v4(), values: new Array<string>()});
                        this.forceUpdate();
                    }}
                    className="d-flex justify-content-center clickable">
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Criteria
                </ListGroupItem>
            </ListGroup>
        );
    }

    get parent(): ShortlistItListBody {
        return this.props.parent;
    }

    get list(): Shortlist {
        return this.parent.list;
    }

    get criteria(): Array<Criteria> {
        return this.list.criteria;
    }
}