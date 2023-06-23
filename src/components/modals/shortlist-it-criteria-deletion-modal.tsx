import React from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Button } from "react-bootstrap";
import { store } from "../../utilities/storage";
import { Shortlist } from "../../types/shortlist";

function hideDeleteConfirmation(stateMgr: ShortlistItStateManager) {
    stateMgr.state.criteriaToBeDeleted = null;
    stateMgr.setState({...stateMgr.state});
}

function confirmDeletion(criteriaId: string, stateMgr: ShortlistItStateManager): void {
    const listIndex = stateMgr.state.lists.findIndex(l => l.criteria.find(c => c.id === criteriaId));
    if (listIndex >= 0) {
        const criteriaIndex = stateMgr.state.lists[listIndex].criteria.findIndex(c => c.id === criteriaId);
        if (criteriaIndex >= 0) {
            stateMgr.state.lists[listIndex].criteria.splice(criteriaIndex, 1);
            store.set('lists', stateMgr.state.lists);
            hideDeleteConfirmation(stateMgr);
            stateMgr.setState({...stateMgr.state});
        }
    }
}

type ShortlistItCriteriaDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
};

export function ShortlistItCriteriaDeletionModal(props: ShortlistItCriteriaDeletionModalProps) {
    const criteriaId = props.stateMgr.state.criteriaToBeDeleted;
    let list: Shortlist;
    let criteriaName: string;
    if (criteriaId) {
        list = props.stateMgr.state.lists.find(l => l.criteria.find(c => c.id === criteriaId) != null);
        criteriaName = list?.criteria.find(l => l.id === criteriaId)?.name;
    }
    if (list) {
        return (
            <ShortlistItModal 
                id={`delete-${criteriaId}`}
                variant="danger"
                heading="Warning!"
                dismissible={true}
                show={!!(criteriaId)}
                onClose={() => hideDeleteConfirmation(props.stateMgr)}>
                <p>
                are you certain you want to delete Criteria named: '<em>{criteriaName}</em>' from list titled: '<em>{list.title}</em>'? once deleted it can not be recovered.
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
    return <></>;
}