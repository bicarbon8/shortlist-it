import React from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Button } from "react-bootstrap";
import { Shortlist } from "../../types/shortlist";
import { Criteria } from "../../types/criteria/criteria";
import { deleteCriteria } from "../../component-actions/list-criteria-actions";

type ShortlistItCriteriaDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
    criteria: Criteria;
    show: boolean;
    onClose?: () => void;
    onDeleted?: () => void;
};

export function ShortlistItCriteriaDeletionModal(props: ShortlistItCriteriaDeletionModalProps) {
    if (!props.show || !props.criteria) {
        return <></>;
    }

    let list: Shortlist;
    if (props.criteria.id) {
        list = props.stateMgr.state.lists.find(l => l.criteria.find(c => c.id === props.criteria.id) != null);
    }
    if (list) {
        return (
            <ShortlistItModal 
                id={`delete-${props.criteria.id}`}
                variant="danger"
                heading="Warning!"
                dismissible={true}
                show={props.show}
                onClose={() => props.onClose?.()}>
                <p>
                are you certain you want to delete Criteria named: '<em>{props.criteria.name}</em>' from list titled: '<em>{list.title}</em>'? once deleted it can not be recovered.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={() => {
                        deleteCriteria(list.id, props.criteria.id, props.stateMgr);
                        props.onClose?.();
                        props.onDeleted?.();
                    }} variant="outline-danger">
                        DELETE
                    </Button>
                </div>
            </ShortlistItModal>
        );
    }
    return <></>;
}