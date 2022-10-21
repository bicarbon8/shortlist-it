import React from "react";
import { v4 } from "uuid";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListCriteriaListItem } from "./shortlist-it-list-criteria-list-item";
import { ShortlistIt } from "./shortlist-it";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";

type ShortlistItListCriteriaListProps = {
    app: ShortlistIt;
    list: Shortlist;
    criteria: Array<Criteria>;
    criteriaRefs: Array<CriteriaRefContainer>
};

export class ShortlistItListCriteriaList extends React.Component<ShortlistItListCriteriaListProps> {
    render() {
        return (
            <ListGroup className="critiera-list py-2">
                {this.props.criteria.map(c => <ShortlistItListCriteriaListItem 
                    key={c.id} 
                    app={this.props.app}
                    list={this.props.list}
                    criteria={c} 
                    criteriaRef={this.props.criteriaRefs.find(r => r.id === c.id)} />
                )}
                <ListGroupItem
                    variant="info"
                    key="add_new_criteria" 
                    onClick={() => this.props.app.addNewCriteria(this.props.list.id)}
                    className="d-flex justify-content-center clickable">
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Criteria
                </ListGroupItem>
            </ListGroup>
        );
    }
}