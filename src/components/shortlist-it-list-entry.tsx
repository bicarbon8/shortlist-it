import { Badge } from "react-bootstrap";
import React from "react";
import ShortlistItListEntryEditButton from "./shortlist-it-list-entry-edit-button";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { ShortlistItMarkdown } from "./utilities/shortlist-it-markdown";

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
            <td className="shortlist-it"><Badge pill={true} className={badgeColour}>{props.entry.ranking}</Badge></td>
            <td className="shortlist-it"><span className={textColour}><ShortlistItMarkdown>{props.entry.description}</ShortlistItMarkdown></span></td>
            {props.list.criteria.map(c => {
                const selectedVals: Array<string> = props.entry.values.get(c.name) ?? [];
                return (
                    <td key={c.id} className="shortlist-it d-none d-sm-table-cell">
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
            <td className="shortlist-it table-fixed-right-col text-end">
                {(!props.list.archived) && (<ShortlistItListEntryEditButton
                        list={props.list}
                        entry={props.entry}
                        stateMgr={props.stateMgr}/>
                )}
            </td>
        </tr>
    );
}