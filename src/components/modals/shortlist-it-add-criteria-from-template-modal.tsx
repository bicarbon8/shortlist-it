import React, { useEffect } from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import ShortlistItCriteriaTemplateItem from "../shortlist-it-criteria-template-item";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { getList } from "../../component-actions/list-actions";
import { ListGroup } from "react-bootstrap";

type ShortlistItAddCriteriaFromTemplateModalProps = {
    stateMgr: ShortlistItStateManager;
}

export default function ShortlistItAddCriteriaFromTemplateModal(props: ShortlistItAddCriteriaFromTemplateModalProps) {
    const list = getList(props.stateMgr.state.addCriteriaFromTemplateToList, props.stateMgr);
    const closeModal = () => {
        props.stateMgr.state.addCriteriaFromTemplateToList = null;
        props.stateMgr.setState({...props.stateMgr.state});
    };
    useEffect(() => {
        closeModal();
    }, [
        props.stateMgr.state.criteriaTemplateToBeDeleted,
        props.stateMgr.state.editingCriteriaId
    ]);
    return (
        <ShortlistItModal
            dismissible
            heading="Add Criteria From Template"
            onClose={() => closeModal()}
            show={list != null}
            variant="light">
            <ListGroup>
                {Array.from(props.stateMgr.state.criteriaTemplates.values()).map(t => {
                    return (
                        <ShortlistItCriteriaTemplateItem
                            key={t.name}
                            list={list}
                            stateMgr={props.stateMgr}
                            template={t}/>
                    );
                })}
            </ListGroup>
        </ShortlistItModal>
    );
}