import React from "react";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { ShortlistContainer } from "./shortlist-container";

export class ShortlistItApp extends React.Component {
    render() {
        const lists: Array<Shortlist> = new Array<Shortlist>();
        lists.push(...[
                {title: 'Sample List 1 - what is it?', entries: new Array<Entry>()},
                {title: 'A Second List - why use it?', entries: new Array<Entry>()},
                {title: 'The Third List Example - this is fun!', entries: new Array<Entry>()}
            ]);

        return (<>{lists.map((list) => <ShortlistContainer data={list} />)}</>);
    }
}