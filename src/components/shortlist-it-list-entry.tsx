import { Badge } from "react-bootstrap";
import React from "react";
import ShortlistItListEntryEditButton from "./shortlist-it-list-entry-edit-button";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";

type ShortlistItListEntryProps = {
    list: Shortlist;
    stateMgr: ShortlistItStateManager;
    entry: Entry;
}

export default function ShortlistItListEntry(props: ShortlistItListEntryProps) {
    const variant = (props.list.archived) ? 'table-light' : 'table-primary';
    const badgeColour = (props.list.archived) ? 'bg-secondary' : 'bg-primary';
    const textColour = (props.list.archived) ? 'text-muted' : 'text-dark';
    
    return (
        <tr className={variant}>
            <td><Badge pill={true} className={badgeColour}>{props.entry.ranking}</Badge></td>
            <td><span className={textColour}>{props.entry.description}</span></td>
            {props.list.criteria.map(c => {
                const selectedVals: Array<string> = props.entry.values.get(c.name) ?? [];
                return (
                    <td key={c.id} className="d-none d-sm-table-cell">
                        {selectedVals.map(v => {
                            return (
                                <Badge key={v} className="me-1 bg-light">
                                    <span className={textColour}>{v}</span>
                                </Badge>
                            );
                        })}
                    </td>
                );
            })}
            {(!props.list.archived) && (
                <td className="table-fixed-right-col text-end">
                    <ShortlistItListEntryEditButton
                        list={props.list}
                        entry={props.entry}
                        stateMgr={props.stateMgr}/>
                </td>
            )}
        </tr>
    );
}