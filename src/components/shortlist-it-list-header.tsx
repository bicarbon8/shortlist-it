import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./utilities/bootstrap-icon";
import { ShortlistItMenu, ShortlistItMenuItem } from "./utilities/shortlist-it-menu";
import { ShortlistItTooltip } from "./utilities/shortlist-it-tooltip";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { archiveList, setEditingListState, startEditingList, unarchiveList, updateList } from "../component-actions/list-actions";
import { addNewEntry } from "../component-actions/list-entry-actions";

function ShortlistItHeaderTitle(props: {list: Shortlist, titleRefObject: React.RefObject<HTMLInputElement>, stateMgr: ShortlistItStateManager}) {
    if (isEditingList(props.list.id, props.stateMgr)) {
        return (
            <>
                <FloatingLabel controlId={`title-input-${props.list.id}`} label="List Title">
                    <Form.Control 
                        ref={props.titleRefObject}
                        type="text" 
                        placeholder="enter title or description" 
                        defaultValue={props.list.title}
                        className="list-header-title-input" />
                </FloatingLabel>
            </>
        );
    } else {
        return <>{props.list.title}</>;
    }
}

function ShortlistItListHeaderMenu(props: {list: Shortlist, titleRefObject: React.RefObject<HTMLInputElement>, stateMgr: ShortlistItStateManager}) {
    const getMenuItems = (props: ShortlistItListHeaderProps): Array<ShortlistItMenuItem> => {
        const items = new Array<ShortlistItMenuItem>();
        if (props.list.archived) {
            items.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => unarchiveList(props.list.id, props.stateMgr)});
        } else {
            items.push({text: 'edit list title', icon: 'pencil-square', action: () => startEditingList(props.list.id, props.stateMgr)});
            items.push({text: 'add criteria', icon: 'clipboard-plus', action: () => {
                props.stateMgr.state.addCriteriaFromTemplateToList = props.list.id;
                props.stateMgr.setState({...props.stateMgr.state});
            }})
            items.push({text: 'add entry', icon: 'plus-square', action: () => addNewEntry(props.list.id, props.stateMgr)});
            items.push({text: 'archive', icon: 'archive', action: () => archiveList(props.list.id, props.stateMgr)});
        }
        items.push(
            {text: 'delete', icon: 'trash', action: () => deleteList(props.list.id, props.stateMgr)}
        );
        return items;
    };

    if (isEditingList(props.list.id, props.stateMgr)) {
        return (
            <div className="d-flex flex-column justify-content-evenly align-content-start sticky-vertical">
                <ShortlistItTooltip id={`save-list-edits-${props.list.id}`} text="Save Changes" className="mb-2">
                    <Button variant="success" onClick={() => saveChanges(props, props.titleRefObject)}>
                        <BootstrapIcon icon="check" />
                    </Button>
                </ShortlistItTooltip>
                <ShortlistItTooltip id={`cancel-list-edits-${props.list.id}`} text="Cancel Edits" className="mt-2">
                    <Button variant="warning" onClick={() => cancelListEdits(props.list.id, props.stateMgr)}>
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
                menuItems={getMenuItems(props)}>
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

function saveChanges(props: ShortlistItListHeaderProps, titleRefObject: React.RefObject<HTMLInputElement>, criteriaRefs?: Array<CriteriaRefContainer>): void {
    const title: string = titleRefObject.current.value;
    const criteria = new Array<Criteria>();
    if (criteriaRefs) {
        criteriaRefs.forEach(r => {
            const name: string = r.name.current.value;
            const type: CriteriaType = r.type.current.value as CriteriaType || 'worst-to-best';
            const values: Array<string> = r.values.current.value.split(',');
            const multi: boolean = r.multi.current.checked || false;
            const weight: number = (r.weight.current.value != null) ? Number(r.weight.current.value) : 1;
            criteria.push({
                id: r.id,
                name: name,
                type: type,
                values: values,
                allowMultiple: multi,
                weight: weight
            });
        });
    } else {
        criteria.push(...props.list.criteria);
    }
    saveListEdits(props.list.id, {
        title: title,
        criteria: criteria
    }, props.stateMgr);
}

function saveListEdits(listId: string, updated: Pick<Shortlist, 'title' | 'criteria'>, stateMgr: ShortlistItStateManager): void {
    let valid: boolean = true;
    // TODO validate values
    if (valid) {
        updateList(listId, updated, stateMgr);
        setEditingListState(listId, false, stateMgr);
    }
}

function cancelListEdits(listId: string, stateMgr: ShortlistItStateManager): void {
    setEditingListState(listId, false, stateMgr);
}

function isEditingList(listId: string, stateMgr: ShortlistItStateManager): boolean {
    return stateMgr.state.editingListTitleMap.get(listId) || false;
}

function deleteList(listId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.listToBeDeleted = listId;
    stateMgr.setState({...stateMgr.state});
}

type ShortlistItListHeaderProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
}

export function ShortlistItListHeader(props: ShortlistItListHeaderProps) {
    const titleRefObject = React.createRef<HTMLInputElement>();

    return (
        <div className="d-flex flex-row justify-content-between">
            <div className="flex-grow-1 pe-1">
                <ShortlistItHeaderTitle list={props.list} titleRefObject={titleRefObject} stateMgr={props.stateMgr} />
            </div>
            <div className="text-center ps-1">
                <ShortlistItListHeaderMenu list={props.list} titleRefObject={titleRefObject} stateMgr={props.stateMgr} />
            </div>
        </div>
    );
}