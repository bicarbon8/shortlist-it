import { Badge, Button, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { BootstrapIcon } from "./utilities/bootstrap-icon";
import React from "react";
import { Shortlist } from "../types/shortlist";
import { addNewCriteria } from "../component-actions/list-criteria-actions";

type ShortlistItCriteriaTemplateItemProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    template: Omit<Criteria, 'id'>;
};

export default function ShortlistItCriteriaTemplateItem(props: ShortlistItCriteriaTemplateItemProps) {
    const deleteCriteriaTemplate = (templateId: string, stateMgr: ShortlistItStateManager): void => {
        stateMgr.state.criteriaTemplateToBeDeleted = templateId;
        stateMgr.setState({...stateMgr.state});
    };
    
    return (
        <ListGroupItem>
            <div className="d-flex flex-row justify-content-between">
                <Button className="flex-col pe-1 flex-grow-1" variant="outline-primary" onClick={() => addNewCriteria(props.list.id, props.stateMgr, props.template.name)}>
                    <p className="mb-0">{props.template.name}</p>
                    <p className="mb-0 text-muted" style={{fontSize: '0.65em'}}>{props.template.type}</p>
                </Button>
                <div> &nbsp; </div>
                <div className="flex-col">
                    <Badge pill bg="danger" onClick={() => deleteCriteriaTemplate(props.template.name, props.stateMgr)}>
                        <BootstrapIcon icon="trash" />
                    </Badge>
                    <div className="flex-grow-1"> </div>
                </div>
            </div>
        </ListGroupItem>
    );
}