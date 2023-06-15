import React, { useState } from "react";
import { ShortlistItListBodyProps, addNewEntry } from "../compact/shortlist-it-list-body-compact";
import ShortlistItListEntryWide from "./shortlist-it-list-entry-wide";
import { BootstrapIcon } from "../bootstrap-icon";
import { Button } from "react-bootstrap";
import { Criteria } from "../../types/criteria/criteria";
import { Shortlist } from "../../types/shortlist";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { ShortlistItTooltip } from "../shortlist-it-tooltip";
import ShortlistItListCriteriaAddNewDropdown from "../shortlist-it-list-criteria-add-new-dropdown";
import ShortlistItCriteriaEditModal from "../shortlist-it-criteria-edit-modal";

function getAddEntryButton(props: ShortlistItListBodyProps) {
    if (props.list.archived) {
        return <></>;
    } else {
        return (
            <tr className="table-secondary">
                <td colSpan={3 + props.list.criteria.length}>
                    <Button size="sm" variant="outline-secondary" onClick={() => addNewEntry(props.list.id, props.stateMgr)}>
                        <BootstrapIcon icon="plus-lg" /> 
                        Add New Entry
                    </Button>
                </td>
            </tr>
        );
    }
}

type ShortlistItListCriteriaProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
    criteria: Criteria;
};

function ShortlistItListCriteria(props: ShortlistItListCriteriaProps) {
    const [editing, setEditing] = useState(false);
    const [editIcon, setEditIcon] = useState('pencil-square');
    return (
        <th scope="col">
            <ShortlistItCriteriaEditModal
                stateMgr={props.stateMgr}
                criteria={props.criteria}
                list={props.list}
                onClose={() => setEditing(false)}
                onSave={() => {
                    setEditIcon('check-circle');
                    setTimeout(() => setEditIcon('pencil-square'), 3000);
                }}
                show={editing} />
            <div className="d-flex flex-nowrap align-items-end">
                {(props.list.archived) ? <></> : <ShortlistItTooltip id={`edit-criteria-${props.criteria.id}`} text="Edit Criteria">
                    <BootstrapIcon
                        icon={editIcon}
                        onClick={() => {
                            if (!editing) {
                                setEditing(true);
                            }
                        }} />
                </ShortlistItTooltip>}<p className="d-flex flex-wrap mb-0 ps-1">{props.criteria.name}</p>
            </div>
        </th>
    )
}

export default function ShortlistItListBodyWide(props: ShortlistItListBodyProps) {
    const variant = (props.list.archived) ? 'table-secondary' : 'table-dark';
    return (
        <table className="table table-hover table-striped">
            <thead>
                <tr className={variant}>
                    <th scope="col">rank</th>
                    <th scope="col">description</th>
                    {props.list.criteria.map(c => <ShortlistItListCriteria key={c.id} criteria={c} list={props.list} stateMgr={props.stateMgr} />)}
                    {(props.list.archived) ? <></> : <th scope="col"><ShortlistItListCriteriaAddNewDropdown stateMgr={props.stateMgr} list={props.list} /></th>}
                </tr>
            </thead>
            <tbody>
                {props.list.entries.map(e => {
                    return (
                        <ShortlistItListEntryWide
                            key={e.id}
                            stateMgr={props.stateMgr}
                            list={props.list}
                            entry={e}
                        />
                    );
                })}
                {getAddEntryButton(props)}
            </tbody>
        </table>
    );
}