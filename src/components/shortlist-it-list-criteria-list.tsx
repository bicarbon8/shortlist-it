import React from "react";
import { ListGroup } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Shortlist } from "../types/shortlist";
import { ShortlistItListCriteriaListItem } from "./shortlist-it-list-criteria-list-item";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import ShortlistItListCriteriaAddNewDropdown from "./shortlist-it-list-criteria-add-new-dropdown";

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
            <ShortlistItListCriteriaAddNewDropdown
                stateMgr={props.stateMgr}
                list={props.list}
            />
        </ListGroup>
    );
}