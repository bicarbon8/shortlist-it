import React from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { Shortlist } from "../types/shortlist";
import { ShortlistItListCriteriaItem } from "./shortlist-it-list-criteria-item";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import ShortlistItListCriteriaAddNewDropdown from "./shortlist-it-list-criteria-add-new-dropdown";
import { createCriteriaRef, isEditingList } from "./shortlist-it-list-header";

export type ShortlistItListCriteriaProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
};

export function ShortlistItListCriteria(props: ShortlistItListCriteriaProps) {
    if (isEditingList(props.list.id, props.stateMgr)) {
        const criteriaRefs = props.list.criteria.map(c => createCriteriaRef(c));
        return (
            <ListGroup className="critiera-list py-2">
                {props.list.criteria.map(c => <ShortlistItListCriteriaItem
                    key={c.id} 
                    stateMgr={props.stateMgr}
                    list={props.list}
                    criteria={c} 
                    criteriaRef={criteriaRefs.find(r => r.id === c.id)} />)}
                <ListGroupItem
                    variant="info"
                    key={`add_new_criteria_${props.list.id}`}
                    className="d-flex justify-content-center">
                    <ShortlistItListCriteriaAddNewDropdown
                        stateMgr={props.stateMgr}
                        list={props.list} />
                </ListGroupItem>
            </ListGroup>
        );
    } else {
        return <></>;
    }
}