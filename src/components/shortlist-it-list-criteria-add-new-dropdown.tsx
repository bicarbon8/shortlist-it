import React from "react";
import { Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { Shortlist } from "../types/shortlist";
import ShortlistItCriteriaTemplateItem from "./shortlist-it-criteria-template-item";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";
import { addNewCriteria } from "../component-actions/list-criteria-actions";

type ShortlistItListCriteriaAddNewDropdownProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
};

export default function ShortlistItListCriteriaAddNewDropdown(props: ShortlistItListCriteriaAddNewDropdownProps) {
    return (
        <ShortlistItTooltip id={`add-new-criteria-${props.list.id}`} text="Add New Criteria">
            <Dropdown as={ButtonGroup}>
                <Button variant="outline-secondary" aria-label="Add New Criteria" onClick={() => addNewCriteria(props.list.id, props.stateMgr)}>
                    <BootstrapIcon icon="plus-lg" />
                </Button>
                {(props.stateMgr.state.criteriaTemplates.size > 0) &&
                    <>
                        <Dropdown.Toggle
                            split
                            variant="outline-secondary"
                            id="dropdown-split-basic"
                            onClick={() => {
                                
                            }} />

                        <Dropdown.Menu>
                            {Array.from(props.stateMgr.state.criteriaTemplates.values()).map(c => <ShortlistItCriteriaTemplateItem 
                                key={c.name}
                                list={props.list}
                                stateMgr={props.stateMgr}
                                template={c}
                            />)}
                        </Dropdown.Menu>
                    </>
                }
            </Dropdown>
        </ShortlistItTooltip>
    );
}