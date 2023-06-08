import React from "react";
import { Button, ButtonGroup, Dropdown, DropdownButton, ListGroupItem } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "../component-actions/list-actions";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Criteria } from "../types/criteria/criteria";

function addNewCriteria(listId: string, stateMgr: ShortlistItStateManager, templateId?: string): void {
    const list = getList(listId, stateMgr);
    if (list) {
        let criteria: Criteria;
        if (templateId) {

        } else {
            criteria = {id: v4(), values: new Array<string>(), weight: 1};
        }
        list.criteria.push(criteria);
        updateList(listId, list, stateMgr);
    }
}

type ShortlistItListCriteriaAddNewDropdownProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
};

export default function ShortlistItListCriteriaAddNewDropdown(props: ShortlistItListCriteriaAddNewDropdownProps) {
    return (
        <>
            <ListGroupItem
                variant="info"
                key={`add_new_criteria_${props.list.id}`}
                className="d-flex justify-content-center"
            >
                <Dropdown as={ButtonGroup}>
                    <Button variant="info" onClick={() => addNewCriteria(props.list.id, props.stateMgr)}>
                        <BootstrapIcon icon="plus-lg" /> 
                        Add New Criteria
                    </Button>

                    <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                
            </ListGroupItem>
        </>
    );
}