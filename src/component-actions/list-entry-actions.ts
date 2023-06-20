import { v4 } from "uuid";
import { Entry } from "../types/entries/entry";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "./list-actions";

export function startEditingEntry(entryId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingEntryId = entryId;
    stateMgr.setState({...stateMgr.state});
}

export function stopEditingEntry(stateMgr: ShortlistItStateManager): void {
    stateMgr.state.editingEntryId = null;
    stateMgr.setState({...stateMgr.state});
}

export function getEntry(entryId: string, stateMgr: ShortlistItStateManager): Entry {
    let entry: Entry;
    const list = stateMgr.state.lists.find(l => l.entries.find(e => {
        if (e.id === entryId) {
            entry = e;
        }
        return entry != null;
    }));
    if (entry) {
        entry.listId = list.id;
    }
    return entry;
}

export function addNewEntry(listId: string, stateMgr: ShortlistItStateManager): void {
    let updated = getList(listId, stateMgr);
    if (updated) {
        const entry: Entry = {
            id: v4(),
            values: new Map<string, Array<string>>(),
            listId: listId
        }
        updated.entries.push(entry);
        updateList(listId, updated, stateMgr);
        startEditingEntry(entry.id, stateMgr);
    }
}