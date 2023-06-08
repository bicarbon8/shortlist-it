import { Badge, Dropdown } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { store } from "../utilities/storage";
import { BootstrapIcon } from "./bootstrap-icon";
import React from "react";
import { addNewCriteria } from "./shortlist-it-list-criteria-add-new-dropdown";
import { Shortlist } from "../types/shortlist";

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

type ShortlistItCriteriaTemplateItemProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    template: Omit<Criteria, 'id'>;
};

export default function ShortlistItCriteriaTemplateItem(props: ShortlistItCriteriaTemplateItemProps) {
    return (
        <Dropdown.Item key={props.template.name} onClick={() => null}>
            <div className="d-flex flex-row justify-content-between">
                <div className="flex-col pe-1" onClick={() => addNewCriteria(props.list.id, props.stateMgr, props.template.name)}>
                    <p className="mb-0">{props.template.name}</p>
                    <p className="mb-0 text-muted" style={{fontSize: '0.65em'}}>{props.template.type}</p>
                </div>
                <div className="flex-col">
                    <Badge pill bg="danger" onClick={() => deleteCriteriaTemplate(props.template.name, props.stateMgr)}>
                        <BootstrapIcon icon="trash" />
                    </Badge>
                    <div className="flex-grow-1"> </div>
                </div>
            </div>
        </Dropdown.Item>
    );
}