import React from "react";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { ShortlistItModal } from "./shortlist-it-modal";
import { Button } from "react-bootstrap";
import { store } from "../utilities/storage";
import { Shortlist } from "../types/shortlist";

type ShortlistItCriteriaDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
};

function hideDeleteConfirmation(stateMgr: ShortlistItStateManager) {
    stateMgr.setState({
        ...stateMgr.state,
        criteriaToBeDeleted: null
    });
}

function confirmDeletion(criteriaId: string, stateMgr: ShortlistItStateManager): void {
    const listIndex = stateMgr.state.lists.findIndex(l => l.criteria.find(c => c.id === criteriaId));
    if (listIndex >= 0) {
        const list = stateMgr.state.lists[listIndex];
        const criteriaIndex = list.criteria.findIndex(c => c.id === criteriaId);
        if (criteriaIndex >= 0) {
            list.criteria.splice(criteriaIndex, 1);
            store.set('lists', stateMgr.state.lists);
            stateMgr.setState({
                ...stateMgr.state,
                criteriaToBeDeleted: null
            });
        }
    }
}

export function ShortlistItCriteriaDeletionModal(props: ShortlistItCriteriaDeletionModalProps) {
    const criteriaId = props.stateMgr.state.criteriaToBeDeleted;
    let list: Shortlist;
    let criteriaName: string;
    if (criteriaId) {
        list = props.stateMgr.state.lists.find(l => l.criteria.find(c => c.id === criteriaId) != null);
        criteriaName = list.criteria.find(l => l.id === criteriaId)?.name;
    }
    return (
        <ShortlistItModal 
            id={`delete-${criteriaId}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={!!(criteriaId && list && criteriaName)}
            onClose={() => hideDeleteConfirmation(props.stateMgr)}>
            <p>
            are you certain you want to delete Criteria named: <i>{criteriaName}</i> from list titled: <i>{list?.title}</i>? once deleted it can not be recovered.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {
                    confirmDeletion(criteriaId, props.stateMgr);
                }} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}