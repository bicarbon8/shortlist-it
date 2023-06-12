import React from "react";
import { Button, ButtonGroup, Dropdown, ListGroupItem } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "../component-actions/list-actions";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Criteria } from "../types/criteria/criteria";
import ShortlistItCriteriaTemplateItem from "./shortlist-it-criteria-template-item";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

export function addNewCriteria(listId: string, stateMgr: ShortlistItStateManager, templateId?: string): void {
    const list = getList(listId, stateMgr);
    if (list) {
        let criteria: Criteria;
        if (templateId && stateMgr.state.criteriaTemplates.has(templateId)) {
            criteria = {
                id: v4(),
                ...stateMgr.state.criteriaTemplates.get(templateId)
            };
        }
        if (!criteria) {
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
        <ShortlistItTooltip id={`add-new-criteria-${props.list.id}`} text="Add New Criteria">
            <Dropdown as={ButtonGroup} align="start">
                <Button variant="outline-secondary" aria-label="Add New Criteria" onClick={() => addNewCriteria(props.list.id, props.stateMgr)}>
                    <BootstrapIcon icon="plus-lg" />
                </Button>
                {(props.stateMgr.state.criteriaTemplates.size > 0) ? (
                    <>
                        <Dropdown.Toggle split variant="outline-secondary" id="dropdown-split-basic" />

                        <Dropdown.Menu>
                            {Array.from(props.stateMgr.state.criteriaTemplates.values()).map(c => <ShortlistItCriteriaTemplateItem 
                                key={c.name}
                                list={props.list}
                                stateMgr={props.stateMgr}
                                template={c}
                            />)}
                        </Dropdown.Menu>
                    </>) : <></>
                }
            </Dropdown>
        </ShortlistItTooltip>
    );
}