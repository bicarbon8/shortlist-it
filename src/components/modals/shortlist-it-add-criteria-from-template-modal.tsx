import React, { useMemo } from "react";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import ShortlistItCriteriaTemplateItem from "../shortlist-it-criteria-template-item";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { ListGroup } from "react-bootstrap";
import { generateCriteriaFromTemplate as generateCriteriaFromTemplate } from "../../component-actions/list-criteria-actions";
import ShortlistItCriteriaEditModal from "./shortlist-it-criteria-edit-modal";
import { Shortlist } from "../../types/shortlist";
import { Criteria } from "../../types/criteria/criteria";

type ShortlistItAddCriteriaFromTemplateModalProps = {
    stateMgr: ShortlistItStateManager;
    show: boolean;
    list: Shortlist;
    onClose: () => void;
}

export default function ShortlistItAddCriteriaFromTemplateModal(props: ShortlistItAddCriteriaFromTemplateModalProps) {
    if (!props.show || !props.list) {
        return <></>;
    }

    if (props.stateMgr.state.criteriaTemplates.size > 0) {
        // show criteria template selection list
        return (
            <ShortlistItModal
                dismissible
                heading="Add Criteria From Template"
                onClose={() => props.onClose()}
                show={props.show}
                variant="light">
                <ListGroup>
                    <ShortlistItCriteriaTemplateItem
                        list={props.list}
                        stateMgr={props.stateMgr}
                        onClose={() => props.onClose()} />
                    {Array.from(props.stateMgr.state.criteriaTemplates.values()).map(t => {
                        return (
                            <ShortlistItCriteriaTemplateItem
                                key={t.name}
                                list={props.list}
                                stateMgr={props.stateMgr}
                                template={t}
                                onClose={() => props.onClose()} />
                        );
                    })}
                </ListGroup>
            </ShortlistItModal>
        );
    } else {
        // create empty criteria and show edit criteria modal instead
        const criteria = useMemo<Criteria>(() => generateCriteriaFromTemplate(props.list.id, props.stateMgr), [props.list.id]);
        return (
            <ShortlistItCriteriaEditModal
                stateMgr={props.stateMgr}
                criteria={criteria}
                listId={props.list.id}
                show={props.show}
                onClose={() => props.onClose()}
                onSave={() => null}
                onDelete={() => null} />
        );
    }
}