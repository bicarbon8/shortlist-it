import { Shortlist } from "../types/shortlist";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { rankingCalculator } from "../utilities/ranking-calculator";
import { store } from "../utilities/storage";

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

/**
 * calls `setEditingListState` setting the `editing` argument to a value of `true`
 * @param listId the UUID of the list to start editing
 * @param stateMgr the `ShortlistItStateManager` instance used to read and update state
 */
export function startEditingList(listId: string, stateMgr: ShortlistItStateManager): void {
    setEditingListState(listId, true, stateMgr);
}

/**
 * updates the `ShortlistItState.editingListMap` to indicate if the specified list is being
 * edited or not
 * @param listId the UUID of the list to set state for
 * @param editing `true` if the list is being edited, otherwise `false`
 * @param stateMgr the `ShortlistItStateManager` instance used to read and update state
 */
export function setEditingListState(listId: string, editing: boolean, stateMgr: ShortlistItStateManager): void {
    const editingMap = stateMgr.state.editingListMap;
    editingMap.set(listId, editing);
    stateMgr.setState({
        ...stateMgr.state,
        editingListMap: editingMap
    });
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
        const lists = stateMgr.state.lists;
        lists[listIndex].archived = archived;
        store.set('lists', lists);
        stateMgr.setState({
            ...stateMgr.state,
            lists: lists
        });
    }
}