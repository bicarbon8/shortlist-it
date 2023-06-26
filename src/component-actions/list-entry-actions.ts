import { v4 } from "uuid";
import { Entry } from "../types/entries/entry";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { getList, updateList } from "./list-actions";

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

export function generateNewEntry(listId: string, stateMgr: ShortlistItStateManager): Entry {
    const list = getList(listId, stateMgr);
    if (list) {
        const entry: Entry = {
            id: v4(),
            values: new Map<string, Array<string>>(),
            listId: listId
        }
        return entry;
    }
    return null;
}

export function saveEntry(entry: Entry, stateMgr: ShortlistItStateManager): void {
    const list = getList(entry.listId, stateMgr);
    if (list) {
        list.entries.push(entry);
        updateList(list.id, list, stateMgr);
    }
}

export function deleteEntry(listId: string, entryId: string, stateMgr: ShortlistItStateManager): Entry {
    let entry: Entry;
    const list = getList(listId, stateMgr);
    if (list) {
        const index = list.entries.findIndex(e => e.id === entryId);
        if (index >= 0) {
            entry = list.entries.splice(index, 1)?.[0];
            updateList(list.id, list, stateMgr);
        }
    }
    return entry;
}