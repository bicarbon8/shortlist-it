import { Badge } from "react-bootstrap";
import { ShortlistItListEntryProps, createValuesRefs, getDescription, getEditButton, isEditingEntry } from "../compact/shortlist-it-list-entry-compact";
import React from "react";
import { EntryValuesRefContainer } from "../../types/entries/entry-values-ref-container";
import { ShortlistItListEntryValuesListItem } from "../shortlist-it-list-entry-values-list-item";
import { isMultiselect } from "../shortlist-it-list-entry-values-list";

function getValue(props: ShortlistItListEntryProps, refContainer: EntryValuesRefContainer) {
    if (refContainer) {
        if (isEditingEntry(props.list.id, props.entry.id, props.stateMgr)) {
            return (
                <ShortlistItListEntryValuesListItem
                    valuesRef={refContainer}
                    listId={props.list.id}
                    entryId={props.entry.id} 
                    criteriaName={refContainer.criteriaName} 
                    stateMgr={props.stateMgr}
                    multiselect={isMultiselect(refContainer.criteriaName, props.list)}
                />
            );
        } else {
            const textColour = (props.list.archived) ? 'text-muted' : 'text-dark';
            const selectedVals: Array<string> = props.entry.values.get(refContainer.criteriaName) ?? [];
            return (
                <>
                {selectedVals.map(v => {
                    return (
                        <Badge key={v} className="me-1 bg-light">
                            <span className={textColour}>{v}</span>
                        </Badge>
                    );
                })}
                </>
            );
        }
    }
    return <></>;
}

export default function ShortlistItListEntryWide(props: ShortlistItListEntryProps) {
    const descRefObject = React.createRef<HTMLInputElement>();
    const valuesRefs: Array<EntryValuesRefContainer> = props.list.criteria.map(c => createValuesRefs(c.name));
    
    const variant = (props.list.archived) ? 'table-light' : 'table-primary';
    const badgeColour = (props.list.archived) ? 'bg-secondary' : 'bg-primary';
    return (
        <tr className={variant}>
            <td><Badge pill={true} className={badgeColour}>{props.entry.ranking}</Badge></td>
            <td>{getDescription(props, descRefObject)}</td>
            {props.list.criteria.map(c => <td key={c.id}>{getValue(props, valuesRefs.find(e => e.criteriaName === c.name))}</td>)}
            {(props.list.archived) ? <></> : <td>{getEditButton(props, descRefObject, valuesRefs)}</td>}
        </tr>
    );
}