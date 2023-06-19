import React from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "./shortlist-it-modal";
import { Button } from "react-bootstrap";
import { store } from "../../utilities/storage";
import { archiveList } from "../../component-actions/list-actions";

type ShortlistItListDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
};

function hideDeleteConfirmation(stateMgr: ShortlistItStateManager) {
    stateMgr.state.listToBeDeleted = null;
    stateMgr.setState({...stateMgr.state});
}

function confirmDeletion(listId: string, stateMgr: ShortlistItStateManager): void {
    const listIndex = stateMgr.state.lists.findIndex(l => l.id === listId);
    if (listIndex >= 0) {
        stateMgr.state.lists.splice(listIndex, 1);
        store.set('lists', stateMgr.state.lists);
        hideDeleteConfirmation(stateMgr);
        stateMgr.setState({...stateMgr.state});
    }
}

export function ShortlistItListDeletionModal(props: ShortlistItListDeletionModalProps) {
    const listId = props.stateMgr.state.listToBeDeleted;
    const listTitle = props.stateMgr.state.lists.find(l => l.id === listId)?.title;
    return (
        <ShortlistItModal 
            id={`delete-${listId}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={!!(listId && listTitle)}
            onClose={() => hideDeleteConfirmation(props.stateMgr)}>
            <p>
            are you certain you want to delete list titled: <i>{listTitle}</i>? a deleted list can not be recovered. 
            would you rather archive this list instead?
            </p>
            <hr />
            <div className="d-flex justify-content-between">
                <Button onClick={() => {
                    archiveList(listId, props.stateMgr);
                }} variant="outline-dark">
                    Archive
                </Button>
                <Button onClick={() => {
                    confirmDeletion(listId, props.stateMgr);
                }} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}