import { Badge, Button, ListGroupItem } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { BootstrapIcon } from "./utilities/bootstrap-icon";
import React, { useState } from "react";
import { Shortlist } from "../types/shortlist";
import { generateCriteriaFromTemplate } from "../component-actions/list-criteria-actions";
import ShortlistItCriteriaEditModal from "./modals/shortlist-it-criteria-edit-modal";
import { ShortlistItCriteriaTemplateDeletionModal } from "./modals/shortlist-it-criteria-template-deletion-modal";

type ShortlistItCriteriaTemplateItemProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    template?: Omit<Criteria, 'id'>;
    onClose: () => void;
};

export default function ShortlistItCriteriaTemplateItem(props: ShortlistItCriteriaTemplateItemProps) {
    const name = (props.template) ? props.template.name : 'New Blank Criteria';
    const cType = (props.template) ? props.template.type : '';
    const [criteria, setCriteria] = useState(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    
    return (
        <ListGroupItem>
            <div className="d-flex flex-row justify-content-between">
                <Button
                    className="flex-col pe-1 flex-grow-1"
                    variant="outline-primary"
                    onClick={() => setCriteria(generateCriteriaFromTemplate(props.list.id, props.stateMgr, props.template?.name))}>
                    <p className="mb-0">{name}</p>
                    <p className="mb-0 text-muted" style={{fontSize: '0.65em'}}>{cType}</p>
                </Button>
                <div> &nbsp; </div>
                <div className="flex-col">
                    {(props.template) && <Badge pill bg="danger" onClick={() => setShowDeleteConfirmation(true)}>
                        <BootstrapIcon icon="trash" />
                    </Badge>}
                    <div className="flex-grow-1"> </div>
                </div>
                <ShortlistItCriteriaEditModal
                    show={criteria != null}
                    criteria={criteria}
                    listId={props.list.id}
                    stateMgr={props.stateMgr}
                    onClose={() => {
                        props.onClose();
                        setCriteria(null);
                    }}
                    onSave={() => null}
                    onDelete={() => null} />
                <ShortlistItCriteriaTemplateDeletionModal
                    show={showDeleteConfirmation}
                    stateMgr={props.stateMgr}
                    template={props.template}
                    onClose={() => setShowDeleteConfirmation(false)} />
            </div>
        </ListGroupItem>
    );
}