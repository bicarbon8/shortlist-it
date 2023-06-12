import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { ShortlistItListBodyCompact } from "./compact/shortlist-it-list-body-compact";
import { ShortlistItListHeader } from "./shortlist-it-list-header";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import ShortlistItListBodyWide from "./wide/shortlist-it-list-body-wide";

export type ShortlistItListProps = {
    list: Shortlist;
    stateMgr: ShortlistItStateManager;
};

function isWide(width: number): boolean {
    return width >= 768;
}

export function ShortlistItList(props: ShortlistItListProps) {
    const bgColor = (props.list.archived) ? 'bg-secondary' : '';
    const [wide, setWide] = useState(isWide(window.innerWidth));
    function handleResize() {
        setWide(isWide(window.innerWidth));
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    return (
        <Card id={props.list.id} className={`m-1 min-width-300 ${bgColor}`}>
            <Card.Body className="d-flex flex-column justify-content-center align-content-center">
                <ShortlistItListHeader stateMgr={props.stateMgr} list={props.list} />
                {(wide)
                    ? <ShortlistItListBodyWide stateMgr={props.stateMgr} list={props.list} />
                    : <ShortlistItListBodyCompact stateMgr={props.stateMgr} list={props.list} />
                }
            </Card.Body>
        </Card>
    );
}