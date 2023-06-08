import React from "react";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { ShortlistItModal } from "./shortlist-it-modal";
import { Button } from "react-bootstrap";
import { store } from "../utilities/storage";
import { Shortlist } from "../types/shortlist";

type ShortlistItEntryDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
};

function hideDeleteConfirmation(stateMgr: ShortlistItStateManager) {
    stateMgr.setState({
        ...stateMgr.state,
        entryToBeDeleted: null
    });
}

function confirmDeletion(entryId: string, stateMgr: ShortlistItStateManager): void {
    const listIndex = stateMgr.state.lists.findIndex(l => l.entries.find(c => c.id === entryId));
    if (listIndex >= 0) {
        const list = stateMgr.state.lists[listIndex];
        const entryIndex = list.entries.findIndex(e => e.id === entryId);
        if (entryIndex >= 0) {
            list.entries.splice(entryIndex, 1);
            store.set('lists', stateMgr.state.lists);
            stateMgr.setState({
                ...stateMgr.state,
                entryToBeDeleted: null
            });
        }
    }
}

export function ShortlistItEntryDeletionModal(props: ShortlistItEntryDeletionModalProps) {
    const criteriaId = props.stateMgr.state.entryToBeDeleted;
    let list: Shortlist;
    let entryDesc: string;
    if (criteriaId) {
        list = props.stateMgr.state.lists.find(l => l.entries.find(c => c.id === criteriaId) != null);
        entryDesc = list.entries.find(l => l.id === criteriaId)?.description;
    }
    return (
        <ShortlistItModal 
            id={`delete-${criteriaId}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={!!(criteriaId && list && entryDesc)}
            onClose={() => hideDeleteConfirmation(props.stateMgr)}>
            <p>
            are you certain you want to delete Entry: <i>{entryDesc}</i> from list titled: <i>{list?.title}</i>? once deleted it can not be recovered.
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