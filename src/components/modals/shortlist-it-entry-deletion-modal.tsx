import React, { useEffect } from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Button } from "react-bootstrap";
import { store } from "../../utilities/storage";
import { Entry } from "../../types/entries/entry";
import { deleteEntry, getEntry } from "../../component-actions/list-entry-actions";

type ShortlistItEntryDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
    entry: Entry;
    show: boolean;
    onClose?: () => void;
    onConfirmed?: () => void;
};

export function ShortlistItEntryDeletionModal(props: ShortlistItEntryDeletionModalProps) {
    const entry = getEntry(props.entry?.id, props.stateMgr);
    if (!props.show || !entry) {
        return <></>;
    }

    let list = props.stateMgr.state.lists.find(l => l.entries.find(c => c.id === entry.id) != null);
    let entryDesc = entry.description;
    return (
        <ShortlistItModal 
            id={`delete-${entry.id}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={props.show && entry != null}
            onClose={() => props.onClose?.()}>
            <p>
            are you certain you want to delete Entry: <i>{entryDesc ?? "''"}</i> from list titled: <i>{list?.title}</i>? once deleted it can not be recovered.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {
                    deleteEntry(list.id, entry.id, props.stateMgr);
                    props.onClose?.();
                    props.onConfirmed?.();
                }} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}