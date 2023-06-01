import React from "react";
import { Card } from "react-bootstrap";
import { ShortlistItStateManager } from "./shortlist-it";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListHeader } from "./shortlist-it-list-header";
import { Shortlist } from "../types/shortlist";

export type ShortlistItListProps = {
    list: Shortlist;
    stateMgr: ShortlistItStateManager;
};

export function ShortlistItList(props: ShortlistItListProps) {
    const bgColor = (props.list.archived) ? 'bg-secondary' : '';
    return (
        <Card id={props.list.id} className={`m-1 min-width-300 max-width-700 ${bgColor}`}>
            <Card.Body className="d-flex flex-column justify-content-center align-content-center">
                <ShortlistItListHeader stateMgr={props.stateMgr} list={props.list} />
                <ShortlistItListBody stateMgr={props.stateMgr} list={props.list} />
            </Card.Body>
        </Card>
    );
}