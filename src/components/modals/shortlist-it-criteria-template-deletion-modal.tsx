import React from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Button } from "react-bootstrap";
import { store } from "../../utilities/storage";

type ShortlistItCriteriaTemplateDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
};

function hideDeleteConfirmation(stateMgr: ShortlistItStateManager) {
    stateMgr.state.criteriaTemplateToBeDeleted = null;
    stateMgr.setState({...stateMgr.state});
}

function confirmDeletion(templateId: string, stateMgr: ShortlistItStateManager): void {
    if (stateMgr.state.criteriaTemplates.has(templateId)) {
        stateMgr.state.criteriaTemplates.delete(templateId);
        store.set('criteriaTemplates', stateMgr.state.criteriaTemplates);
        hideDeleteConfirmation(stateMgr);
        stateMgr.setState({...stateMgr.state});
    }
}

export function ShortlistItCriteriaTemplateDeletionModal(props: ShortlistItCriteriaTemplateDeletionModalProps) {
    const templateId = props.stateMgr.state.criteriaTemplateToBeDeleted;
    if (!templateId) {
        return <></>;
    }
    
    return (
        <ShortlistItModal 
            id={`delete-${templateId}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={!!(templateId && props.stateMgr.state.criteriaTemplates.has(templateId))}
            onClose={() => hideDeleteConfirmation(props.stateMgr)}>
            <p>
            are you certain you want to delete Criteria Template named: <i>{templateId}</i>? once deleted it can not be recovered.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {
                    confirmDeletion(templateId, props.stateMgr);
                }} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}