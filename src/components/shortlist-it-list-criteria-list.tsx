import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListCriteriaListItem } from "./shortlist-it-list-criteria-list-item";
import { ShortlistItStateManager, addNewCriteria } from "./shortlist-it";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";

type ShortlistItListCriteriaListProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    criteria: Array<Criteria>;
    criteriaRefs: Array<CriteriaRefContainer>
};

export function ShortlistItListCriteriaList(props: ShortlistItListCriteriaListProps) {
    return (
        <ListGroup className="critiera-list py-2">
            {props.criteria.map(c => <ShortlistItListCriteriaListItem 
                key={c.id} 
                stateMgr={props.stateMgr}
                list={props.list}
                criteria={c} 
                criteriaRef={props.criteriaRefs.find(r => r.id === c.id)} />
            )}
            <ListGroupItem
                variant="info"
                key="add_new_criteria" 
                onClick={() => addNewCriteria(props.list.id, props.stateMgr)}
                className="d-flex justify-content-center clickable">
                <BootstrapIcon icon="plus-lg" /> 
                Add New Criteria
            </ListGroupItem>
        </ListGroup>
    );
}