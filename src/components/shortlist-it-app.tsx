import React from "react";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { ShortlistContainer } from "./shortlist-container";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";

export class ShortlistItApp extends React.Component {
    render() {
        const lists: Array<Shortlist> = new Array<Shortlist>(...[
            {
                title: 'Which type of television should I buy?',
                criteria: new Array<Criteria>(
                    {name: 'cost', criteriaType: 'worst-to-best' as CriteriaType, values: ['$$$$', '$$$', '$$', '$']},
                    {name: 'size', criteriaType: 'worst-to-best' as CriteriaType, values: ['XS', 'S', 'M', 'L', 'XL']},
                    {name: 'audio ports', criteriaType: 'worst-to-best' as CriteriaType, values: ['3.5mm', 'RCA', 'optical'], multiple: true}
                ), 
                entries: new Array<Entry>(
                    {
                        description: 'JVC LT-40CA790 Android TV 40" Smart Full HD LED TV with Google Assistant', 
                        ranking: 1,
                        values: new Map<string, string | Array<string>>([
                            ['cost', '$$'],
                            ['size', 'M'],
                            ['audio ports', ['3.5mm', 'optical']]
                        ])
                    }, {
                        description: 'TCL 32RS520K Roku 32" Smart HD Ready LED TV',
                        ranking: 2,
                        values: new Map<string, string | Array<string>>([
                            ['cost', '$'],
                            ['size', 'S']
                        ])
                    }, {
                        description: 'LG 28TN515S 28" Smart HD Ready LED TV',
                        ranking: 3,
                        values: new Map<string, string | Array<string>>([
                            ['cost', '$$'],
                            ['size', 'XS']
                        ])
                    }, {
                        description: 'SAMSUNG UE50TU7020KXXU 50" Smart 4K Ultra HD HDR LED TV',
                        ranking: 3,
                        values: new Map<string, string | Array<string>>([
                            ['cost', '$$$$'],
                            ['size', 'L']
                        ])
                    }
                )
            },
            {title: 'A Second List - why use it?', criteria: new Array<Criteria>(), entries: new Array<Entry>()},
            {title: 'The Third List Example - this is fun!', criteria: new Array<Criteria>(), entries: new Array<Entry>()}
        ]);

        return (<>{lists.map((list) => <ShortlistContainer key={list.title} data={list} />)}</>);
    }
}