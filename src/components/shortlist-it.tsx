import React, { useState } from "react";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { store } from "../utilities/storage";
import { ShortlistItList } from "./shortlist-it-list";
import { ShortlistItNav } from "./shortlist-it-nav";
import { ShortlistItState } from "../types/shortlist-it-state";
import { ShortlistItListDeletionModal } from "./shortlist-it-list-deletion-modal";

function getLists(state: ShortlistItState): Array<Shortlist> {
    let lists = state.lists;
    if (!state.showArchived) {
        lists = lists.filter(l => l.archived !== true)
    }
    if (state.filterText && state.filterText !== '') {
        // create the regex matcher
        const filters: string[] = state.filterText.split(' ');
        let rStr: string = '';
        for (var i=0; i<filters.length; i++) {
            var filter = filters[i].replace(/([-\(\)\[\]\{\}+\?*\.$\^\|,:#<\!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
            rStr += ".*(" + filter + ").*";
        }
        const regex = new RegExp(rStr, "i");
        lists = lists.filter(l => l.title?.match(regex) || l.entries.find(e => e.description?.match(regex)));
    }
    return lists;
}

/**
 * used only when starting a new instance where the user hasn't created any of their own lists
 * to demonstrate how the app can be used
 */
const exampleLists: Array<Shortlist> = [
    {
        id: v4(),
        title: 'Which type of television should I buy?',
        criteria: new Array<Criteria>(
            {id: v4(), name: 'cost', type: 'worst-to-best' as CriteriaType, values: ['$$$$', '$$$', '$$', '$']},
            {id: v4(), name: 'size', type: 'worst-to-best' as CriteriaType, values: ['XS', 'S', 'M', 'L', 'XL']},
            {id: v4(), name: 'audio ports', type: 'worst-to-best' as CriteriaType, values: ['3.5mm', 'RCA', 'optical'], allowMultiple: true}
        ), 
        entries: new Array<Entry>(
            {
                id: v4(),
                description: 'JVC LT-40CA790 Android TV 40" Smart Full HD LED TV with Google Assistant', 
                ranking: 1,
                values: new Map<string, Array<string>>([
                    ['cost', ['$$']],
                    ['size', ['M']],
                    ['audio ports', ['3.5mm', 'optical']]
                ])
            }, {
                id: v4(),
                description: 'TCL 32RS520K Roku 32" Smart HD Ready LED TV',
                ranking: 2,
                values: new Map<string, Array<string>>([
                    ['cost', ['$']],
                    ['size', ['S']]
                ])
            }, {
                id: v4(),
                description: 'LG 28TN515S 28" Smart HD Ready LED TV',
                ranking: 3,
                values: new Map<string, Array<string>>([
                    ['cost', ['$$']],
                    ['size', ['XS']]
                ])
            }, {
                id: v4(),
                description: 'SAMSUNG UE50TU7020KXXU 50" Smart 4K Ultra HD HDR LED TV',
                ranking: 3,
                values: new Map<string, Array<string>>([
                    ['cost', ['$$$$']],
                    ['size', ['L']]
                ])
            }
        )
    }, {
        id: v4(),
        title: 'Which friends should I invest my time in?', 
        criteria: new Array<Criteria>(
            {id: v4(), name: 'giver or taker', type: 'worst-to-best' as CriteriaType, values: ['taker', 'both', 'giver']},
            {id: v4(), name: 'feeling when with them', type: 'worst-to-best' as CriteriaType, values: ['anger', 'agitation', 'sadness', 'nothingness', 'warmth', 'joy', 'elation']},
            {id: v4(), name: 'activity level', type: 'worst-to-best' as CriteriaType, values: ['none', 'extreme', 'low', 'moderate']}, 
            {id: v4(), name: 'makes me a better person', type: 'yes-no' as CriteriaType, values: ['yes', 'no']},
            {id: v4(), name: 'good features', type: 'positives' as CriteriaType, values: ['tidy', 'fashionable', 'kind', 'athletic', 'attractive', 'intelligent'], allowMultiple: true}
        ), 
        entries: new Array<Entry>(
            {
                id: v4(),
                description: 'Mark',
                ranking: 1,
                values: new Map<string, Array<string>>([
                    ['giver or taker', ['giver']],
                    ['feeling when with them', ['joy']],
                    ['activity level', ['moderate']],
                    ['makes me a better person', ['no']],
                    ['good features', ['kind', 'athletic', 'intelligent']]
                ])
            },
            {
                id: v4(),
                description: 'Carl',
                ranking: 2,
                values: new Map<string, Array<string>>([
                    ['giver or taker', ['giver']],
                    ['feeling when with them', ['joy']],
                    ['activity level', ['low']],
                    ['makes me a better person', ['yes']],
                    ['good features', ['kind', 'intelligent']]
                ])
            },
            {
                id: v4(),
                description: 'Sophie',
                ranking: 3,
                values: new Map<string, Array<string>>([
                    ['giver or taker', ['both']],
                    ['feeling when with them', ['warmth']],
                    ['activity level', ['low']],
                    ['makes me a better person', ['no']],
                    ['good features', ['tidy', 'attractive']]
                ])
            },
            {
                id: v4(),
                description: 'Roger',
                ranking: 4,
                values: new Map<string, Array<string>>([
                    ['giver or taker', ['taker']],
                    ['feeling when with them', ['nothingness']],
                    ['activity level', ['moderate']],
                    ['makes me a better person', ['yes']],
                    ['good features', ['athletic', 'intelligent']]
                ])
            }
        )
    }
];

export function ShortlistIt(props: never) {
    const [state, setState] = useState<ShortlistItState>({
        showArchived: store.get('showArchived', false),
        lists: store.get('lists', new Array<Shortlist>(...exampleLists)),
        filterText: store.get('filterText', ''),
        editingListMap: new Map<string, boolean>(),
        editingListEntryMap: new Map<string, boolean>()
    });

    const lists: Array<Shortlist> = getLists(state);

    return (
        <>
            <ShortlistItListDeletionModal stateMgr={{state, setState}} />
            <ShortlistItNav stateMgr={{state, setState}} />
            <div className="d-flex justify-content-evenly align-items-start flex-wrap flex-sm-row flex-column">
                {lists.map((list) => <ShortlistItList key={list.id} stateMgr={{state, setState}} list={list} />)}
            </div>
        </>
    );
}
