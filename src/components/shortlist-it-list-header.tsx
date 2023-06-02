import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListCriteriaList } from "./shortlist-it-list-criteria-list";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { archiveList, setEditingListState, startEditingList, unarchiveList, updateList } from "../component-actions/list-actions";

export type ShortlistItListHeaderProps = {
    stateMgr: ShortlistItStateManager;
    list: Shortlist;
}

function getTitleContent(props: ShortlistItListHeaderProps, titleRefObject: React.RefObject<HTMLInputElement>, criteriaRefs: Array<CriteriaRefContainer>) {
    if (isEditingList(props.list.id, props.stateMgr)) {
        return (
            <>
                <FloatingLabel controlId={`title-input-${props.list.id}`} label="List Title">
                    <Form.Control 
                        ref={titleRefObject}
                        type="text" 
                        placeholder="enter title or description" 
                        defaultValue={props.list.title}
                        className="list-header-title-input" />
                </FloatingLabel>
                <ShortlistItListCriteriaList stateMgr={props.stateMgr} list={props.list} criteria={props.list.criteria} criteriaRefs={criteriaRefs} />
            </>
        );
    } else {
        return <>{props.list.title}</>;
    }
}

function getMenuButtonContent(props: ShortlistItListHeaderProps, titleRefObject: React.RefObject<HTMLInputElement>, criteriaRefs: Array<CriteriaRefContainer>) {
    if (isEditingList(props.list.id, props.stateMgr)) {
        return (
            <div className="d-flex flex-column justify-content-evenly align-content-start sticky">
                <ShortlistItTooltip id={`save-list-edits-${props.list.id}`} text="Save Changes" className="mb-2">
                    <Button variant="success" onClick={() => saveChanges(props, titleRefObject, criteriaRefs)}>
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

function getMenuItems(props: ShortlistItListHeaderProps): Array<ShortlistItMenuItem> {
    const items = new Array<ShortlistItMenuItem>();
    if (props.list.archived) {
        items.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => unarchiveList(props.list.id, props.stateMgr)});
    } else {
        items.push({text: 'edit list', icon: 'pencil-square', action: () => startEditingList(props.list.id, props.stateMgr)});
        items.push({text: 'archive', icon: 'archive', action: () => archiveList(props.list.id, props.stateMgr)});
    }
    items.push(
        {text: 'delete', icon: 'trash', action: () => deleteList(props.list.id, props.stateMgr)}
    );
    return items;
}

function createCriteriaRef(criteria: Criteria): CriteriaRefContainer {
    return {
        id: criteria.id,
        name: React.createRef<HTMLInputElement>(),
        type: React.createRef<HTMLSelectElement>(),
        values: React.createRef<HTMLInputElement>(),
        multi: React.createRef<HTMLInputElement>()
    };
}

function saveChanges(props: ShortlistItListHeaderProps, titleRefObject: React.RefObject<HTMLInputElement>, criteriaRefs: Array<CriteriaRefContainer>): void {
    const title: string = titleRefObject.current.value;
    const criteria = new Array<Criteria>();
    criteriaRefs.forEach(r => {
        const name: string = r.name.current.value;
        const type: CriteriaType = r.type.current.value as CriteriaType || 'worst-to-best';
        const values: Array<string> = r.values.current.value.split(',');
        const multi: boolean = r.multi.current.checked || false;
        criteria.push({
            id: r.id,
            name: name,
            type: type,
            values: values,
            allowMultiple: multi
        });
    });
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
    return stateMgr.state.editingListMap.get(listId) || false;
}

function deleteList(listId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.setState({
        ...stateMgr.state,
        listToBeDeleted: listId
    });
}

export function ShortlistItListHeader(props: ShortlistItListHeaderProps) {
    let titleRefObject = React.createRef<HTMLInputElement>();
    let criteriaRefs = props.list.criteria.map(c => createCriteriaRef(c));

    return (
        <div className="d-flex flex-row justify-content-between">
            <div className="flex-grow-1 pe-1">{getTitleContent(props, titleRefObject, criteriaRefs)}</div>
            <div className="text-center ps-1">{getMenuButtonContent(props, titleRefObject, criteriaRefs)}</div>
        </div>
    );
}