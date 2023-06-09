import React from "react";
import { ShortlistItListBodyProps, addNewEntry } from "../shortlist-it-list-body";
import ShortlistItListEntryWide from "./shortlist-it-list-entry-wide";
import { BootstrapIcon } from "../bootstrap-icon";
import { Button } from "react-bootstrap";

function getAddEntryButton(props: ShortlistItListBodyWideProps) {
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

type ShortlistItListBodyWideProps = ShortlistItListBodyProps & {

};

export default function ShortlistItListBodyWide(props: ShortlistItListBodyWideProps) {
    const variant = (props.list.archived) ? 'table-secondary' : 'table-dark';
    return (
        <table className="table table-hover table-striped">
            <thead>
                <tr className={variant}>
                    <th scope="col">rank</th>
                    <th scope="col">description</th>
                    {props.list.criteria.map(c => {
                        return (
                            <th scope="col" key={c.name}>{c.name}</th>
                        );
                    })}
                    {(props.list.archived) ? <></> : <th scope="col">controls</th>}
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