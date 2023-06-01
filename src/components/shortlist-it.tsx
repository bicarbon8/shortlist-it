import React, { useState } from "react";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Button } from "react-bootstrap";
import { Storage } from "../utilities/storage";
import { ShortlistItList } from "./shortlist-it-list";
import { ShortlistItModal } from "./shortlist-it-modal";
import { ShortlistItNav } from "./shortlist-it-nav";
import { rankingCalculator } from "../utilities/ranking-calculator";

export type ShortlistItState = {
    lists: Array<Shortlist>,
    showArchived: boolean,
    listToBeDeleted?: string;
    filterText: string;
    editingListMap: Map<string, boolean>
    editingListEntryMap: Map<string, boolean>
};

export type ShortlistItStateManager = {
    readonly state: ShortlistItState,
    setState: React.Dispatch<React.SetStateAction<ShortlistItState>>;
};

export const store = new Storage<ShortlistItState>();

export function refreshState(stateMgr: ShortlistItStateManager): void {
    stateMgr.setState({
        ...stateMgr.state,
        showArchived: store.get('showArchived', false),
        lists: store.get('lists', new Array<Shortlist>()),
        filterText: store.get('filterText', '')
    });
}

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

function getListDeleteConfirmationModal(stateMgr: ShortlistItStateManager) {
    const listId = stateMgr.state.listToBeDeleted ?? '';
    const listTitle = stateMgr.state.lists.find(l => l.id === listId)?.title;
    return (
        <ShortlistItModal 
            id={`delete-${listId}`}
            variant="danger"
            heading="Warning!"
            dismissible={true}
            show={!!(listId && listTitle)}
            onClose={() => hideDeleteConfirmation(stateMgr)}>
            <p>
            are you certain you want to delete list titled: <i>{listTitle}</i> a deleted list can not be recovered. 
            would you rather archive this list instead?
            </p>
            <hr />
            <div className="d-flex justify-content-between">
                <Button onClick={() => archiveList(listId, stateMgr)} variant="outline-dark">
                    Archive
                </Button>
                <Button onClick={() => confirmDeletion(listId, stateMgr)} variant="outline-danger">
                    DELETE
                </Button>
            </div>
        </ShortlistItModal>
    );
}

function hideDeleteConfirmation(stateMgr: ShortlistItStateManager) {
    stateMgr.setState({
        ...stateMgr.state,
        listToBeDeleted: undefined
    });
}

export function addNewList(stateMgr: ShortlistItStateManager): void {
    const list: Shortlist = {
        id: v4(),
        title: `New Shortlist (${stateMgr.state.lists.length + 1})`,
        entries: new Array<Entry>(),
        criteria: new Array<Criteria>()
    };
    const allLists = stateMgr.state.lists;
    allLists.unshift(list);
    store.set('lists', allLists);
    stateMgr.setState({
        ...stateMgr.state,
        lists: allLists
    });
    startEditingList(list.id, stateMgr);
}

export function getList(id: string, stateMgr: ShortlistItStateManager): Shortlist {
    return stateMgr.state.lists.find(l => l.id === id);
}

function updateList(listId:string, updated: Partial<Shortlist>, stateMgr: ShortlistItStateManager): void {
    const allLists = stateMgr.state.lists;
    const index = allLists.findIndex(l => l.id === listId);
    if (index >= 0) {
        const orig = allLists[index];
        const merged = rankingCalculator.rankEntries({...orig, ...updated});
        allLists.splice(index, 1, merged);
        store.set('lists', allLists);
        stateMgr.setState({
            ...stateMgr.state,
            lists: allLists
        });
    }
}

export function startEditingList(listId: string, stateMgr: ShortlistItStateManager): void {
    setEditingListState(listId, true, stateMgr);
}

export function isEditingList(listId: string, stateMgr: ShortlistItStateManager): boolean {
    return stateMgr.state.editingListMap.get(listId) || false;
}

export function saveListEdits(listId: string, updated: Pick<Shortlist, 'title' | 'criteria'>, stateMgr: ShortlistItStateManager): void {
    let valid: boolean = true;
    // TODO validate values
    if (valid) {
        updateList(listId, updated, stateMgr);
        setEditingListState(listId, false, stateMgr);
    }
}

export function cancelListEdits(listId: string, stateMgr: ShortlistItStateManager): void {
    setEditingListState(listId, false, stateMgr);
}

function setEditingListState(listId: string, editing: boolean, stateMgr: ShortlistItStateManager): void {
    const editingMap = stateMgr.state.editingListMap;
    editingMap.set(listId, editing);
    stateMgr.setState({
        ...stateMgr.state,
        editingListMap: editingMap
    });
}

export function archiveList(listId: string, stateMgr: ShortlistItStateManager): void {
    hideDeleteConfirmation(stateMgr);
    setArchivedState(listId, true, stateMgr);
}

export function unarchiveList(listId: string, stateMgr: ShortlistItStateManager): void {
    setArchivedState(listId, false, stateMgr);
}

export function deleteList(listId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.setState({
        ...stateMgr.state,
        listToBeDeleted: listId
    });
}

function setArchivedState(listId: string, archived: boolean, stateMgr: ShortlistItStateManager) {
    const listIndex = stateMgr.state.lists.findIndex(l => l.id === listId);
    if (listIndex >= 0) {
        const lists = stateMgr.state.lists;
        lists[listIndex].archived = archived;
        store.set('lists', lists);
        stateMgr.setState({
            ...stateMgr.state,
            lists: lists
        });
    }
}

export function addNewEntry(listId: string, stateMgr: ShortlistItStateManager): void {
    let updated = getList(listId, stateMgr);
    if (updated) {
        const entry: Entry = {
            id: v4(),
            values: new Map<string, Array<string>>()
        }
        updated.entries.push(entry);
        updateList(listId, updated, stateMgr);
        startEditingEntry(listId, entry.id, stateMgr);
    }
}

export function startEditingEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): void {
    setEditingListEntryState(listId, entryId, true, stateMgr);
}

export function isEditingEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): boolean {
    return stateMgr.state.editingListEntryMap.get(`${listId}_${entryId}`) || false;
}

export function saveListEntryEdits(listId: string, entry: Entry, stateMgr: ShortlistItStateManager): void {
    const list = getList(listId, stateMgr);
    if (list) {
        const index = list.entries.findIndex(e => e.id === entry.id);
        if (index >= 0) {
            list.entries.splice(index, 1, entry);
            updateList(listId, list, stateMgr);
            setEditingListEntryState(listId, entry.id, false, stateMgr);
        }
    }
}

export function cancelListEntryEdits(listId: string, entryId: string, stateMgr: ShortlistItStateManager): void {
    setEditingListEntryState(listId, entryId, false, stateMgr);
}

function setEditingListEntryState(listId: string, entryId: string, editing: boolean, stateMgr: ShortlistItStateManager): void {
    const editingMap = stateMgr.state.editingListEntryMap;
    editingMap.set(`${listId}_${entryId}`, editing);
    stateMgr.setState({
        ...stateMgr.state,
        editingListEntryMap: editingMap
    });
}

export function deleteEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): void {
    const list = getList(listId, stateMgr);
    const entry = getEntry(listId, entryId, stateMgr);
    const confirmed: boolean = window.confirm(`Are you sure you want to delete entry described by: '${entry.description}' from list '${list.title}'? This action cannot be undone.`);
    if (confirmed) {
        const index = list.entries.findIndex(e => e.id === entryId);
        if (index >= 0) {
            let updated = list;
            updated.entries.splice(index, 1);
            updateList(listId, updated, stateMgr);
        }
    }
}

export function getEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): Entry {
    return getList(listId, stateMgr).entries.find(e => e.id === entryId);
}

function confirmDeletion(listId: string, stateMgr: ShortlistItStateManager): void {
    hideDeleteConfirmation(stateMgr);

    const listIndex = stateMgr.state.lists.findIndex(l => l.id === listId);
    if (listIndex >= 0) {
        const tmp = stateMgr.state.lists;
        tmp.splice(listIndex, 1);
        store.set('lists', tmp);
        stateMgr.setState({
            ...stateMgr.state,
            lists: tmp
        });
    }
}

export function addNewCriteria(listId: string, stateMgr: ShortlistItStateManager): void {
    const list = getList(listId, stateMgr);
    if (list) {
        list.criteria.push({id: v4(), values: new Array<string>()});
        updateList(listId, list, stateMgr);
    }
}

export function deleteCriteria(listId: string, criteriaId: string, stateMgr: ShortlistItStateManager): void {
    const list = getList(listId, stateMgr);
    if (list) {
        const index = list.criteria.findIndex(c => c.id === criteriaId);
        if (index >= 0) {
            const criteria = list.criteria[index];
            const confirmed: boolean = window.confirm(`are you sure you want to delete criteria: '${criteria.name}' from list '${list.title}'? this action cannot be undone and will remove all values associated with the criteria from any entries in the list`)
            if (confirmed) {
                list.criteria.splice(index, 1);
                updateList(listId, list, stateMgr);
            }
        }
    }
}

export function ShortlistIt(props: never) {
    const [state, setState] = useState<ShortlistItState>({
        showArchived: store.get('showArchived', false),
        lists: store.get('lists', new Array<Shortlist>(
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
            },
            {
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
        )),
        filterText: store.get('filterText', ''),
        editingListMap: new Map<string, boolean>(),
        editingListEntryMap: new Map<string, boolean>()
    });

    const lists: Array<Shortlist> = getLists(state);

    return (
        <>
            {getListDeleteConfirmationModal({state, setState})}
            <ShortlistItNav stateMgr={{state, setState}} />
            <div className="d-flex justify-content-evenly align-items-start flex-wrap flex-sm-row flex-column">
                {lists.map((list) => <ShortlistItList key={list.id} stateMgr={{state, setState}} list={list} />)}
            </div>
        </>
    );
}

//     get showArchived(): boolean {
//         return this.state.showArchived ?? false;
//     }

//     get filterText(): string {
//         return this.state.filterText;
//     }

//     private setEditingListEntryState(listId: string, entryId: string, editing: boolean): void {
//         const editingMap = this.state.editingListEntryMap;
//         editingMap.set(`${listId}_${entryId}`, editing);
//         this.setState({editingListEntryMap: editingMap});
//     }

//     startEditingEntry(listId: string, entryId: string): void {
//         this.setEditingListEntryState(listId, entryId, true);
//     }

//     isEditingEntry(listId: string, entryId: string): boolean {
//         return this.state.editingListEntryMap.get(`${listId}_${entryId}`) || false;
//     }

//     cancelListEntryEdits(listId: string, entryId: string): void {
//         this.setEditingListEntryState(listId, entryId, false);
//     }

//     deleteEntry(listId: string, entryId: string): void {
//         const list = this.getList(listId);
//         const entry = this.getEntry(listId, entryId);
//         const confirmed: boolean = window.confirm(`Are you sure you want to delete entry described by: '${entry.description}' from list '${list.title}'? This action cannot be undone.`);
//         if (confirmed) {
//             const index = list.entries.findIndex(e => e.id === entryId);
//             if (index >= 0) {
//                 let updated = list;
//                 updated.entries.splice(index, 1);
//                 this.updateList(listId, updated);
//             }
//         }
//     }

//     private setArchivedState(listId: string, archived: boolean) {
//         const listIndex = this.state.lists.findIndex(l => l.id === listId);
//         if (listIndex >= 0) {
//             const lists = this.state.lists;
//             lists[listIndex].archived = archived;
//             this.store.set('lists', lists);
//             this.setState({lists: lists});
//         }
//     }

//     addNewList(): void {
//         const list: Shortlist = {
//             id: v4(),
//             title: `New Shortlist (${this.state.lists.length + 1})`,
//             entries: new Array<Entry>(),
//             criteria: new Array<Criteria>()
//         };
//         const allLists = this.state.lists;
//         allLists.unshift(list);
//         this.store.set('lists', allLists);
//         this.setState({lists: allLists});
//         this.startEditingList(list.id);
//     }

//     getList(id: string): Shortlist {
//         return this.state.lists.find(l => l.id === id);
//     }

//     updateList(listId:string, updated: Partial<Shortlist>): void {
//         const allLists = this.state.lists;
//         const index = allLists.findIndex(l => l.id === listId);
//         if (index >= 0) {
//             const orig = allLists[index];
//             const merged = rankingCalculator.rankEntries({...orig, ...updated});
//             allLists.splice(index, 1, merged);
//             this.store.set('lists', allLists);
//             this.setState({lists: allLists});
//         }
//     }

//     archiveList(listId: string): void {
//         this.hideDeleteConfirmation();
//         this.setArchivedState(listId, true);
//     }

//     unarchiveList(listId: string): void {
//         this.setArchivedState(listId, false);
//     }

//     getEntry(listId: string, entryId: string): Entry {
//         return this.getList(listId).entries.find(e => e.id === entryId);
//     }

//     addNewEntry(listId: string): void {
//         let updated = this.getList(listId);
//         if (updated) {
//             const entry: Entry = {
//                 id: v4(),
//                 values: new Map<string, Array<string>>()
//             }
//             updated.entries.push(entry);
//             this.updateList(listId, updated);
//             this.startEditingEntry(listId, entry.id);
//         }
//     }

//     private confirmDeletion(listId: string): void {
//         this.hideDeleteConfirmation();

//         const listIndex = this.state.lists.findIndex(l => l.id === listId);
//         if (listIndex >= 0) {
//             const tmp = this.state.lists;
//             tmp.splice(listIndex, 1);
//             this.store.set('lists', tmp);
//             this.setState({lists: tmp});
//         }
//     }

//     setFilterText(filterStr: string): void {
//         this.store.set('filterText', filterStr);
//         this.setState({filterText: filterStr});
//     }
// }