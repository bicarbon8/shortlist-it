import React, { useState } from "react";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { ShortlistItTooltip } from "./utilities/shortlist-it-tooltip";
import { BootstrapIcon } from "./utilities/bootstrap-icon";
import ShortlistItEntryEditModal from "./modals/shortlist-it-entry-edit-modal";

type ShortlistItListEntryEditButtonProps = {
    list: Shortlist;
    entry: Entry;
    stateMgr: ShortlistItStateManager;
}

export default function ShortlistItListEntryEditButton(props: ShortlistItListEntryEditButtonProps) {
    const hasMissingData = (): boolean => {
        const criteriaNames: Array<string> = Array.from(props.list.criteria.map(c => c.name))
            .filter(name => name && name !== '');
        for (var i=0; i<criteriaNames.length; i++) {
            const key = criteriaNames[i];
            const vals = props.entry.values.get(key);
            if (!vals || vals.length === 0) {
                const criteria = props.list.criteria.find(c => c.name === key);
                if (!criteria.allowMultiple) {
                    return true;
                }
            }
        }
        return false;
    };
    
    let icon: string;
    let tooltip: string;
    let iconBackground: string;
    if (hasMissingData()) {
        icon = 'exclamation-triangle';
        tooltip = 'Missing Data - click to set values';
        iconBackground = 'bg-warning';
    } else {
        icon = 'pencil-square';
        tooltip = 'Edit Entry';
        iconBackground = '';
    }
    const [showEditModal, setShowEditModal] = useState(false);
    return (
        <>
            <ShortlistItTooltip id={`edit-entry-${props.entry.id}`} text={tooltip}>
                <div className="clickable" onClick={() => setShowEditModal(true)}>
                    <BootstrapIcon className={iconBackground} icon={icon} />
                </div>
            </ShortlistItTooltip>
            <ShortlistItEntryEditModal
                stateMgr={props.stateMgr}
                entry={props.entry}
                show={showEditModal}
                onClose={() => setShowEditModal(false)} />
        </>
    );
}