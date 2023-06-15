import { Entry } from "../types/entries/entry";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList } from "./list-actions";

export function startEditingEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): void {
    setEditingListEntryState(listId, entryId, true, stateMgr);
}

export function setEditingListEntryState(listId: string, entryId: string, editing: boolean, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingListEntryMap.set(`${listId}_${entryId}`, editing);
    stateMgr.setState({...stateMgr.state});
}

export function getEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): Entry {
    return getList(listId, stateMgr).entries.find(e => e.id === entryId);
}