import React from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Button } from "react-bootstrap";
import { store } from "../../utilities/storage";
import { Shortlist } from "../../types/shortlist";

type ShortlistItEntryDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
};

function hideDeleteConfirmation(stateMgr: ShortlistItStateManager) {
    stateMgr.state.entryToBeDeleted = null;
    stateMgr.setState({...stateMgr.state});
}

function confirmDeletion(entryId: string, stateMgr: ShortlistItStateManager): void {
    const listIndex = stateMgr.state.lists.findIndex(l => l.entries.find(c => c.id === entryId));
    if (listIndex >= 0) {
        const entryIndex = stateMgr.state.lists[listIndex].entries.findIndex(e => e.id === entryId);
        if (entryIndex >= 0) {
            stateMgr.state.lists[listIndex].entries.splice(entryIndex, 1);
            store.set('lists', stateMgr.state.lists);
            hideDeleteConfirmation(stateMgr);
            stateMgr.setState({...stateMgr.state});
        }
    }
}

export function ShortlistItEntryDeletionModal(props: ShortlistItEntryDeletionModalProps) {
    const entryId = props.stateMgr.state.entryToBeDeleted;
    let list: Shortlist;
    let entryDesc: string;
    if (entryId) {
        list = props.stateMgr.state.lists.find(l => l.entries.find(c => c.id === entryId) != null);
        entryDesc = list?.entries.find(l => l.id === entryId)?.description;
    }
    return (
        <ShortlistItModal 
            id={`delete-${entryId}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={!!(entryId)}
            onClose={() => hideDeleteConfirmation(props.stateMgr)}>
            <p>
            are you certain you want to delete Entry: <i>{entryDesc ?? "''"}</i> from list titled: <i>{list?.title}</i>? once deleted it can not be recovered.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {
                    confirmDeletion(entryId, props.stateMgr);
                }} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}