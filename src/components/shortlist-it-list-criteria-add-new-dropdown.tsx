import React from "react";
import { Badge, Button, ButtonGroup, Dropdown, ListGroupItem } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "../component-actions/list-actions";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Criteria } from "../types/criteria/criteria";
import { store } from "../utilities/storage";

function addNewCriteria(listId: string, stateMgr: ShortlistItStateManager, templateId?: string): void {
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

function deleteCriteriaTemplate(templateId: string, stateMgr: ShortlistItStateManager): void {
    if (confirm(`are you sure you want to delete Criteria Template: '${templateId}'?`)) {
        const criteriaTemplates = stateMgr.state.criteriaTemplates;
        criteriaTemplates.delete(templateId);
        store.set('criteriaTemplates', criteriaTemplates);
        stateMgr.setState({
            ...stateMgr.state,
            criteriaTemplates: criteriaTemplates
        });
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
                <Dropdown as={ButtonGroup} align="start">
                    <Button variant="info" onClick={() => addNewCriteria(props.list.id, props.stateMgr)}>
                        <BootstrapIcon icon="plus-lg" /> 
                        Add New Criteria
                    </Button>
                    {(props.stateMgr.state.criteriaTemplates.size > 0) ? (
                        <>
                            <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />

                            <Dropdown.Menu>
                                {Array.from(props.stateMgr.state.criteriaTemplates.values()).map(c => {
                                    return (
                                        <Dropdown.Item key={c.name} onClick={() => null}>
                                            <div className="d-flex flex-row justify-content-between">
                                                <div className="flex-grow-1 pe-1" onClick={() => addNewCriteria(props.list.id, props.stateMgr, c.name)}>
                                                    {c.name}
                                                </div>
                                                <Badge pill bg="danger">
                                                    <BootstrapIcon icon="trash" onClick={() => deleteCriteriaTemplate(c.name, props.stateMgr)} />
                                                </Badge>
                                            </div>
                                        </Dropdown.Item>
                                    );
                                })}
                            </Dropdown.Menu>
                        </>) : <></>
                    }
                </Dropdown>
                
            </ListGroupItem>
        </>
    );
}