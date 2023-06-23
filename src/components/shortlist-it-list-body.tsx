import React, { useState } from "react";
import ShortlistItListEntry from "./shortlist-it-list-entry";
import { BootstrapIcon } from "./utilities/bootstrap-icon";
import { Button } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { ShortlistItTooltip } from "./utilities/shortlist-it-tooltip";
import { addNewEntry } from "../component-actions/list-entry-actions";
import ShortlistItCriteriaEditModal from "./modals/shortlist-it-criteria-edit-modal";
import ShortlistItAddCriteriaFromTemplateModal from "./modals/shortlist-it-add-criteria-from-template-modal";

function ShortlistItListBodyFinalRow(props: ShortlistItListBodyProps) {
    const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);

    return (
        <tr className="table-secondary">
            <td>
                <ShortlistItAddCriteriaFromTemplateModal
                    show={showAddCriteriaModal}
                    stateMgr={props.stateMgr}
                    onClose={() => setShowAddCriteriaModal(false)}
                    list={props.list} />
            </td>
            <td>
                <Button size="sm" variant="outline-secondary" className="sticky-horizontal text-nowrap" onClick={() => addNewEntry(props.list.id, props.stateMgr)}>
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Entry
                </Button>
            </td>
            {(props.list.criteria.length > 0) 
                && <td colSpan={props.list.criteria.length} className="d-none d-sm-table-cell">
                    <Button
                        variant="outline-secondary"
                        size="sm"
                        aria-label="Add New Criteria"
                        className="text-nowrap"
                        onClick={() => setShowAddCriteriaModal(true)}>
                        <BootstrapIcon icon="plus-lg" />
                        Add New Criteria
                    </Button>
                </td>}
            <td className="table-fixed-right-col"> &nbsp; </td>
        </tr>
    );
}

type ShortlistItListCriteriaProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    criteria: Criteria;
};

function ShortlistItListCriteria(props: ShortlistItListCriteriaProps) {
    const [editIcon, setEditIcon] = useState('pencil-square');
    const [showEditModal, setShowEditModal] = useState(false);
    return (
        <th scope="col" className="d-none d-sm-table-cell">
            <ShortlistItCriteriaEditModal
                stateMgr={props.stateMgr}
                show={showEditModal}
                criteria={props.criteria}
                listId={props.list.id}
                onClose={() => setShowEditModal(false)}
                onSave={() => {
                    setEditIcon('check-circle');
                    setTimeout(() => setEditIcon('pencil-square'), 2000);
                }}
                onDelete={() => null} />
            <div className="d-flex flex-nowrap align-items-end">
                {(!props.list.archived) && <ShortlistItTooltip id={`edit-criteria-${props.criteria.id}`} text="Edit Criteria">
                    <BootstrapIcon
                        icon={editIcon}
                        onClick={() => setShowEditModal(true)} />
                </ShortlistItTooltip>}
                <ShortlistItTooltip id={`criteria-${props.criteria.id}`} text={props.criteria.name}>
                    <p className="text-nowrap mb-0 ps-1 text-truncate" aria-label={props.criteria.name}>{props.criteria.name}</p>
                </ShortlistItTooltip>
            </div>
        </th>
    )
}

type ShortlistItListBodyProps = {
    list: Shortlist;
    stateMgr: ShortlistItStateManager;
}

export default function ShortlistItListBody(props: ShortlistItListBodyProps) {
    const variant = (props.list.archived) ? 'table-secondary' : 'table-dark';
    return (
        <div className="table-responsive">
            <table className="table table-hover table-striped table-fixed-2-cols pb-0 mb-0">
                <thead>
                    <tr className={variant}>
                        <th scope="col">rank</th>
                        <th scope="col">description</th>
                        {props.list.criteria.map(c => <ShortlistItListCriteria key={c.id} criteria={c} list={props.list} stateMgr={props.stateMgr} />)}
                        <th scope="col" className="table-fixed-right-col"> </th>
                    </tr>
                </thead>
                <tbody>
                    {props.list.entries.map(e => {
                        return (
                            <ShortlistItListEntry
                                key={e.id}
                                stateMgr={props.stateMgr}
                                list={props.list}
                                entry={e}
                            />
                        );
                    })}
                    {(!props.list.archived) && <ShortlistItListBodyFinalRow {...props} />}
                </tbody>
            </table>
        </div>
    );
}