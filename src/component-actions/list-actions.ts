import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { rankingCalculator } from "../utilities/ranking-calculator";
import { store } from "../utilities/storage";
import { Criteria } from "../types/criteria/criteria";
import { Entry } from "../types/entries/entry";

/**
 * finds the first `Shortlist` stored in the passed in `stateMgr.state`
 * and returns it
 * @param id the UUID of the list to get
 * @param stateMgr the `ShortlistItStateManager` instance to pull from
 * @returns the requested `Shortlist` or `undefined` if not found
 */
export function getList(id: string, stateMgr: ShortlistItStateManager): Shortlist {
    return stateMgr.state.lists.find(l => l.id === id);
}

/**
 * takes in a `Partial<Shortlist>` and merges it on top of an existing `Shortlist` found
 * with an ID of `listId` and then passes the updated `Shortlist` to the `stateMgr.setState`
 * function and the `Storage<ShortlistItState>` manager that saves to localStorage
 * @param listId the UUID of the list to update
 * @param updated a `Partial<Shortlist>` to be merged with the existing
 * @param stateMgr the `ShortlistItStateManager` instance used to read and update state
 */
export function updateList(listId: string, updated: Partial<Shortlist>, stateMgr: ShortlistItStateManager): void {
    const index = stateMgr.state.lists.findIndex(l => l.id === listId);
    if (index >= 0) {
        const orig = stateMgr.state.lists[index];
        const merged = rankingCalculator.rankEntries({...orig, ...updated});
        stateMgr.state.lists.splice(index, 1, merged);
        store.set('lists', stateMgr.state.lists);
        stateMgr.setState({...stateMgr.state});
    }
}

export function archiveList(listId: string, stateMgr: ShortlistItStateManager): void {
    setListArchivedState(listId, true, stateMgr);
}

export function unarchiveList(listId: string, stateMgr: ShortlistItStateManager): void {
    setListArchivedState(listId, false, stateMgr);
}

function setListArchivedState(listId: string, archived: boolean, stateMgr: ShortlistItStateManager) {
    const listIndex = stateMgr.state.lists.findIndex(l => l.id === listId);
    if (listIndex >= 0) {
        stateMgr.state.lists[listIndex].archived = archived;
        store.set('lists', stateMgr.state.lists);
        stateMgr.setState({...stateMgr.state});
    }
}

export function deleteList(listId: string, stateMgr: ShortlistItStateManager): Shortlist {
    let list: Shortlist;
    const index = stateMgr.state.lists.findIndex(l => l.id === listId);
    if (index >= 0) {
        list = stateMgr.state.lists.splice(index, 1)?.[0];
        store.set('lists', stateMgr.state.lists);
        stateMgr.setState({...stateMgr.state});
    }
    return list;
}

export function addNewList(stateMgr: ShortlistItStateManager): Shortlist {
    const list: Shortlist = {
        id: v4(),
        title: `Shortlist: ${stateMgr.state.lists.length + 1}`,
        criteria: new Array<Criteria>(),
        entries: new Array<Entry>()
    };
    stateMgr.state.lists.splice(0, 0, list);
    stateMgr.setState({...stateMgr.state});
    return list;
}