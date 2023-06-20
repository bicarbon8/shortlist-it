import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { ShortlistItListHeader } from "./shortlist-it-list-header";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import ShortlistItListBody from "./shortlist-it-list-body";

export type ShortlistItListProps = {
    list: Shortlist;
    stateMgr: ShortlistItStateManager;
};

export default function ShortlistItList(props: ShortlistItListProps) {
    const isWide = (width: number): boolean => {
        return width >= 768;
    };
    const bgColor = (props.list.archived) ? 'bg-secondary' : '';
    const [wide, setWide] = useState(isWide(window.innerWidth));
    const handleResize = () => {
        setWide(isWide(window.innerWidth));
    }
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    return (
        <Card id={props.list.id} className={`m-1 w-100 ${bgColor}`}>
            <Card.Body className="d-flex flex-column justify-content-center align-content-center">
                <ShortlistItListHeader stateMgr={props.stateMgr} list={props.list} />
                <ShortlistItListBody stateMgr={props.stateMgr} list={props.list} />
            </Card.Body>
        </Card>
    );
}