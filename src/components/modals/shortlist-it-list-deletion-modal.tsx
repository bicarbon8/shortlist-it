import React from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Button } from "react-bootstrap";
import { archiveList, deleteList } from "../../component-actions/list-actions";
import { Shortlist } from "../../types/shortlist";

type ShortlistItListDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
    show: boolean;
    list: Shortlist;
    onClose?: () => void;
    onDeleted?: () => void;
    onArchived?: () => void;
};

export function ShortlistItListDeletionModal(props: ShortlistItListDeletionModalProps) {
    if (!props.show || !props.list) {
        return <></>;
    }

    return (
        <ShortlistItModal 
            id={`delete-${props.list.id}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={props.show}
            onClose={() => props.onClose?.()}>
            <p>
            are you certain you want to delete list titled: <i>{props.list.title}</i>? a deleted list can not be recovered. 
            would you rather archive this list instead?
            </p>
            <hr />
            <div className="d-flex justify-content-between">
                <Button onClick={() => {
                    archiveList(props.list.id, props.stateMgr);
                    props.onArchived?.();
                }} variant="outline-dark">
                    Archive
                </Button>
                <Button onClick={() => {
                    deleteList(props.list.id, props.stateMgr);
                    props.onDeleted?.();
                }} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}