import React from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Button } from "react-bootstrap";
import { deleteCriteriaTemplate } from "../../component-actions/list-criteria-actions";
import { Criteria } from "../../types/criteria/criteria";
import { ElementHelper } from "../../utilities/element-helper";

type ShortlistItCriteriaTemplateDeletionModalProps = {
    stateMgr: ShortlistItStateManager;
    template: Omit<Criteria, 'id'>;
    show: boolean;
    onClose?: () => void;
    onDeleted?: () => void;
};

export function ShortlistItCriteriaTemplateDeletionModal(props: ShortlistItCriteriaTemplateDeletionModalProps) {
    if (!props.show || !props.template) {
        return <></>;
    }
    
    return (
        <ShortlistItModal 
            id={`delete-${ElementHelper.idEncode(props.template.name)}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={props.show}
            onClose={() => props.onClose?.()}>
            <p>
            are you certain you want to delete Criteria Template named: <i>{props.template.name}</i>? once deleted it can not be recovered.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
                <Button onClick={() => {
                    deleteCriteriaTemplate(props.template.name, props.stateMgr);
                    props.onClose?.();
                    props.onDeleted?.();
                }} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}