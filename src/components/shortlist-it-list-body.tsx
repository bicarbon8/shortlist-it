import React, { useState } from "react";
import ShortlistItListEntry from "./shortlist-it-list-entry";
import { BootstrapIcon } from "./bootstrap-icon";
import { Button } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";
import ShortlistItListCriteriaAddNewDropdown from "./shortlist-it-list-criteria-add-new-dropdown";
import { startEditingCriteria } from "../component-actions/list-criteria-actions";
import { addNewEntry } from "../component-actions/list-entry-actions";

function AddEntryButton(props: ShortlistItListBodyProps) {
    return (
        <tr className="table-secondary">
            <td colSpan={3 + props.list.criteria.length}>
                <Button size="sm" variant="outline-secondary" className="sticky-horizontal" onClick={() => addNewEntry(props.list.id, props.stateMgr)}>
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Entry
                </Button>
            </td>
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
    return (
        <th scope="col" className="d-none d-sm-table-cell">
            <div className="d-flex flex-nowrap align-items-end">
                {(props.list.archived) ? <></> : <ShortlistItTooltip id={`edit-criteria-${props.criteria.id}`} text="Edit Criteria">
                    <BootstrapIcon
                        icon={editIcon}
                        onClick={() => {
                            if (props.stateMgr.state.editingCriteriaId == null) {
                                startEditingCriteria(props.criteria.id, props.stateMgr);
                            }
                        }} />
                </ShortlistItTooltip>}<p className="text-nowrap mb-0 ps-1">{props.criteria.name}</p>
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
                        {(!props.list.archived) && (
                            <th scope="col" className="d-flex justify-content-end table-fixed-right-col">
                                <ShortlistItListCriteriaAddNewDropdown stateMgr={props.stateMgr} list={props.list} />
                            </th>
                        )}
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
                    {(!props.list.archived) && <AddEntryButton {...props} />}
                </tbody>
            </table>
        </div>
    );
}