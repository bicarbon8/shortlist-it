import React, { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./utilities/bootstrap-icon";
import { ShortlistItMenu, ShortlistItMenuItem } from "./utilities/shortlist-it-menu";
import { ShortlistItTooltip } from "./utilities/shortlist-it-tooltip";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { archiveList, getList, unarchiveList, updateList } from "../component-actions/list-actions";
import { generateNewEntry } from "../component-actions/list-entry-actions";
import ShortlistItAddCriteriaFromTemplateModal from "./modals/shortlist-it-add-criteria-from-template-modal";
import ShortlistItEntryEditModal from "./modals/shortlist-it-entry-edit-modal";
import { ShortlistItListDeletionModal } from "./modals/shortlist-it-list-deletion-modal";
import { store } from "../utilities/storage";

function isTitleInvalid(title: string): boolean {
    if (title.match(/^[\s]+$/) == null) {
        return false;
    }
    return true;
}

function saveListTitle(listId: string, titleRefObject: React.RefObject<HTMLInputElement>, stateMgr: ShortlistItStateManager): boolean {
    const title = titleRefObject.current.value;
    if (isTitleInvalid(title)) {
        return false;
    }
    const list = getList(listId, stateMgr);
    list.title = title;
    updateList(listId, list, stateMgr);
    return true;
}

type ShortlistItHeaderMenuProps = {
    editing: boolean;
    list: Shortlist;
    titleRefObject: React.RefObject<HTMLInputElement>;
    stateMgr: ShortlistItStateManager;
    onAddCriteria: () => void;
    onAddEntry: () => void;
    onTryDelete: () => void;
    onStartEditing: () => void;
    onStopEditing: () => void;
    onTitleInvalid: () => void;
};

function ShortlistItListHeaderMenu(props: ShortlistItHeaderMenuProps) {
    const getMenuItems = (): Array<ShortlistItMenuItem> => {
        const items = new Array<ShortlistItMenuItem>();
        if (props.list.archived) {
            items.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => unarchiveList(props.list.id, props.stateMgr)});
        } else {
            items.push({text: 'edit list title', icon: 'pencil-square', action: () => props.onStartEditing()});
            items.push({text: 'add criteria', icon: 'clipboard-plus', action: () => props.onAddCriteria()});
            items.push({text: 'add entry', icon: 'plus-square', action: () => props.onAddEntry()});
            items.push({text: 'archive', icon: 'archive', action: () => archiveList(props.list.id, props.stateMgr)});
        }
        items.push({text: 'delete', icon: 'trash', action: () => props.onTryDelete()});
        return items;
    };

    if (props.editing) {
        return (
            <div className="d-flex flex-column justify-content-evenly align-content-start sticky-vertical">
                <ShortlistItTooltip id={`save-list-edits-${props.list.id}`} text="Save Changes" className="mb-2">
                    <Button
                        variant="success"
                        onClick={() => {
                            if (saveListTitle(props.list.id, props.titleRefObject, props.stateMgr)) {
                                props.onStopEditing();
                            } else {
                                props.onTitleInvalid();
                            }
                        }}>
                        <BootstrapIcon icon="check" />
                    </Button>
                </ShortlistItTooltip>
                <ShortlistItTooltip id={`cancel-list-edits-${props.list.id}`} text="Cancel Edits" className="mt-2">
                    <Button variant="warning" onClick={() => props.onStopEditing()}>
                        <BootstrapIcon icon="x-circle" />
                    </Button>
                </ShortlistItTooltip>
            </div>
        );
    } else {
        return (
            <ShortlistItMenu 
                id={`menu-${props.list.id}`}
                headerText="List Menu"
                menuItems={getMenuItems()}>
                <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
            </ShortlistItMenu>
        );
    }
}

export function createCriteriaRef(criteria: Criteria): CriteriaRefContainer {
    return {
        id: criteria.id,
        name: React.createRef<HTMLInputElement>(),
        type: React.createRef<HTMLSelectElement>(),
        values: React.createRef<HTMLInputElement>(),
        multi: React.createRef<HTMLInputElement>(),
        weight: React.createRef<HTMLInputElement>()
    };
}

function isUnsaved(listId: string): boolean {
    const lists = store.get('lists', []);
    return lists.find(l => l.id === listId) == null;
}

type ShortlistItListHeaderProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
}

export function ShortlistItListHeader(props: ShortlistItListHeaderProps) {
    const titleRefObject = React.createRef<HTMLInputElement>();
    const [showAddCriteriaModal, setShowAddCriteriaModal] = useState(false);
    const [showAddEntryModal, setShowAddEntryModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [editing, setEditing] = useState(false);
    const [titleInvalid, setTitleInvalid] = useState(isTitleInvalid(props.list.title));

    return (
        <div className="d-flex flex-row justify-content-between">
            <div className="flex-grow-1 pe-1">
                {(editing) ? (
                    <FloatingLabel controlId={`title-input-${props.list.id}`} label="List Title">
                        <Form.Control 
                            ref={titleRefObject}
                            type="text" 
                            placeholder="enter title or description" 
                            defaultValue={props.list.title}
                            className={`list-header-title-input${(titleInvalid) ? ' is-invalid' : ''}`}
                            onChange={() => setTitleInvalid(isTitleInvalid(titleRefObject.current.value))} />
                    </FloatingLabel>
                ) : props.list.title}
            </div>
            <div className="text-center ps-1">
                <ShortlistItListHeaderMenu
                    list={props.list}
                    titleRefObject={titleRefObject}
                    stateMgr={props.stateMgr}
                    onAddCriteria={() => setShowAddCriteriaModal(true)}
                    onAddEntry={() => setShowAddEntryModal(true)}
                    onTryDelete={() => setShowDeleteConfirmation(true)}
                    editing={editing}
                    onStartEditing={() => setEditing(true)}
                    onStopEditing={() => setEditing(false)}
                    onTitleInvalid={() => setTitleInvalid(true)} />
                <ShortlistItAddCriteriaFromTemplateModal
                    show={showAddCriteriaModal}
                    stateMgr={props.stateMgr}
                    onClose={() => setShowAddCriteriaModal(false)}
                    list={props.list} />
                <ShortlistItEntryEditModal
                    stateMgr={props.stateMgr}
                    entry={generateNewEntry(props.list.id, props.stateMgr)}
                    show={showAddEntryModal}
                    onClose={() => setShowAddEntryModal(false)} />
                <ShortlistItListDeletionModal
                    stateMgr={props.stateMgr}
                    list={props.list}
                    show={showDeleteConfirmation}
                    onClose={() => setShowDeleteConfirmation(false)} />
            </div>
        </div>
    );
}