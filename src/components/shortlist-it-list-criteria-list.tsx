import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListCriteriaListItem } from "./shortlist-it-list-criteria-list-item";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { v4 } from "uuid";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "../component-actions/list-actions";

type ShortlistItListCriteriaListProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    criteria: Array<Criteria>;
    criteriaRefs: Array<CriteriaRefContainer>
};

function addNewCriteria(listId: string, stateMgr: ShortlistItStateManager): void {
    const list = getList(listId, stateMgr);
    if (list) {
        list.criteria.push({id: v4(), values: new Array<string>(), weight: 1});
        updateList(listId, list, stateMgr);
    }
}

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