import React, { useEffect, useState } from "react";
import { Criteria } from "../../types/criteria/criteria";
import { Shortlist } from "../../types/shortlist";
import { ShortlistItStateManager } from "../../types/shortlist-it-state-manager";
import { createCriteriaRef } from "../shortlist-it-list-header";
import { ShortlistItModal } from "../utilities/shortlist-it-modal";
import { Alert, Button, FloatingLabel, Form } from "react-bootstrap";
import { ShortlistItTooltip } from "../utilities/shortlist-it-tooltip";
import { BootstrapIcon } from "../utilities/bootstrap-icon";
import { getList, updateList } from "../../component-actions/list-actions";
import { CriteriaRefContainer } from "../../types/criteria/criteria-ref-container";
import { CriteriaType, CriteriaTypeArray } from "../../types/criteria/criteria-type";
import { store } from "../../utilities/storage";

function getCriteriaModalElement(criteria: Criteria): HTMLDivElement {
    return document.getElementById(criteria?.id) as HTMLDivElement;
}

function getCriteriaModalType(criteria: Criteria): CriteriaType {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaType: CriteriaType;
    if (criteriaEl) {
        criteriaType = (criteriaEl.querySelector('#criteriaType option:checked') as HTMLOptionElement)?.value as CriteriaType;
    } else {
        criteriaType = criteria?.type;
    }
    return criteriaType ?? 'worst-to-best';
}

function isCriteriaTypeValid(criteria: Criteria): boolean {
    const criteriaType: CriteriaType = getCriteriaModalType(criteria);
    return CriteriaTypeArray.includes(criteriaType);
}

function isYesNo(criteria: Criteria): boolean {
    const criteriaType = getCriteriaModalType(criteria);
    return criteriaType === 'yes-no';
}

function isCriteriaNameValid(criteria: Criteria, list: Shortlist): boolean {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaName: string;
    if (criteriaEl) {
        criteriaName = (criteriaEl.querySelector('#criteriaName') as HTMLInputElement)?.value;
    } else {
        criteriaName = criteria?.name ?? '';
    }
    const invalid: boolean = (!criteriaName || criteriaName.match(/^[\s]+$/) !== null || list.criteria
        .filter(c => c.id !== criteria?.id)
        .map(c => c.name)
        .includes(criteriaName));
    return !invalid;
}

function areCritieriaValuesValid(criteria: Criteria): boolean {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaValues: string
    if (criteriaEl) {
        criteriaValues = (criteriaEl.querySelector('#criteriaValues') as HTMLInputElement).value;
    } else {
        criteriaValues = criteria?.values.join(',') ?? '';
    }
    const invalid: boolean = (!criteriaValues || criteriaValues.match(/^[\s]+$/) !== null);
    return !invalid;
}

function isCritieraWeightValid(criteria: Criteria): boolean {
    const criteriaEl = getCriteriaModalElement(criteria);
    let criteriaWeight: string;
    if (criteriaEl) {
        criteriaWeight = (criteriaEl.querySelector('#criteriaWeight') as HTMLInputElement)?.value;
    } else {
        criteriaWeight = String(criteria?.weight) ?? '';
    }
    const invalid: boolean = (isNaN(Number(criteriaWeight)) || criteriaWeight.match(/^((\+|-)?([0-9]+)(\.[0-9]+)?)|((\+|-)?\.?[0-9]+)$/) === null);
    return !invalid;
}

function saveAsTemplate(criteriaRef: CriteriaRefContainer, stateMgr: ShortlistItStateManager, success: () => void, exists: () => void, error: () => void, overwrite?: boolean): void {
    const criteria = validateCriteriaTemplateValues(criteriaRef);
    if (criteria) {
        if (criteria.name) {
            if (stateMgr.state.criteriaTemplates.has(criteria.name)) {
                if (!overwrite) {
                    exists();
                    return;
                }
            }
            stateMgr.state.criteriaTemplates.set(criteria.name, criteria);
            store.set('criteriaTemplates', stateMgr.state.criteriaTemplates);
            stateMgr.setState({...stateMgr.state});
            success();
        }
    } else {
        error();
    }
}

function validateCriteriaTemplateValues(criteriaRef: CriteriaRefContainer): Omit<Criteria, 'id'> {
    const cName = criteriaRef.name.current?.value;
    if (cName == null || cName == '') {
        return null;
    }
    const cType = criteriaRef.type.current?.value;
    if (cType == null || cType == '') {
        return null;
    }
    const cValues = criteriaRef.values.current?.value;
    if (cValues == null || cValues == '') {
        return null;
    }
    const cWeight = criteriaRef.weight.current?.value;
    if (cWeight == null || cWeight == '' || isNaN(Number(cWeight))) {
        return null;
    }
    const cMulti = criteriaRef.multi.current?.checked;
    return {
        name: cName,
        type: cType as CriteriaType,
        values: cValues.split(',').map(v => v.trim()),
        weight: Number(cWeight),
        allowMultiple: cMulti
    };
}

function saveCriteria(listId: string, criteriaId: string, criteriaRef: CriteriaRefContainer, stateMgr: ShortlistItStateManager): boolean {
    const valid = validateCriteriaTemplateValues(criteriaRef);
    if (valid) {
        const list = getList(listId, stateMgr);
        if (list) {
            list.criteria.push({...valid, id: criteriaId});
            updateList(list.id, list, stateMgr);
        }
        return true;
    }
    return false;
}

function confirmDeleteCriteria(criteriaId: string, stateMgr: ShortlistItStateManager): void {
    stateMgr.state.criteriaToBeDeleted = criteriaId;
    stateMgr.setState({...stateMgr.state});
}

type ShortlistItCriteriaEditModalProps = {
    stateMgr: ShortlistItStateManager;
    show: boolean;
    criteria: Criteria;
    listId?: string;
    onClose: () => void;
    onSave: () => void;
    onDelete: () => void;
};

export default function ShortlistItCriteriaEditModal(props: ShortlistItCriteriaEditModalProps) {
    const criteria = props.criteria;
    const list = getList(criteria?.listId ?? props.listId, props.stateMgr);
    const criteriaRef = (criteria) ? createCriteriaRef(criteria) : null;

    const [showSaveTemplateSuccess, setShowSaveTemplateSuccess] = useState(false);
    const onSaveTemplateSuccess = () => {
        setShowSaveTemplateSuccess(true);
        window.setTimeout(() => setShowSaveTemplateSuccess(false), 5000);
    }
    const [showSaveTemplateExists, setShowSaveTemplateExists] = useState(false);
    const onTemplateExists = () => {
        setShowSaveTemplateExists(true);
    }
    const [showSaveError, setShowSaveError] = useState(false);
    const onSaveError = () => {
        setShowSaveError(true);
        window.setTimeout(() => setShowSaveError(false), 5000);
    }

    const [criteriaNameValid, setCriteriaNameValid] = useState(isCriteriaNameValid(criteria, list));
    const [criteriaTypeValid, setCriteriaTypeValid] = useState(isCriteriaTypeValid(criteria));
    const [criteriaValuesValid, setCriteriaValuesValid] = useState(areCritieriaValuesValid(criteria));
    const [criteriaWeightValid, setCriteriaWeightValid] = useState(isCritieraWeightValid(criteria));
    const [yesNo, setYesNo] = useState(isYesNo(criteria));

    useEffect(() => {
        setCriteriaNameValid(isCriteriaNameValid(criteria, list));
        setCriteriaTypeValid(isCriteriaTypeValid(criteria));
        setCriteriaValuesValid(areCritieriaValuesValid(criteria));
        setCriteriaWeightValid(isCritieraWeightValid(criteria));
        setYesNo(isYesNo(criteria));
    }, [props.stateMgr.state.editingCriteriaId]);
    
    return (
        <ShortlistItModal
            variant="light"
            dismissible={true}
            onClose={() => props.onClose()}
            heading="Edit Critieria"
            show={props.show && criteria != null}
        >
            <div id={criteria?.id} className="d-flex flex-row justify-content-between criteria-list-item">
                <div className="d-flex flex-column justify-content-evently flex-grow-1 pe-1">
                    <Alert variant="danger" dismissible show={showSaveError} onClose={() => setShowSaveError(false)}>
                        Criteria must have all values set to valid values in order to be Saved or used as a Template
                    </Alert>
                    <Alert variant="warning" dismissible show={showSaveTemplateExists} onClose={() => setShowSaveTemplateExists(false)}>
                        <div className="flex-row">
                            <p className="flex-grow-1 pe-1">Criteria with same name already exists... do you wish to overwrite it?</p>
                            <Button 
                                variant="danger" 
                                onClick={() => {
                                    setShowSaveTemplateExists(false);
                                    saveAsTemplate(criteriaRef, props.stateMgr, onSaveTemplateSuccess, onTemplateExists, onSaveError, true);
                                }}>
                                Overwrite
                            </Button>
                        </div>
                    </Alert>
                    <Alert variant="success" dismissible show={showSaveTemplateSuccess} onClose={() => setShowSaveTemplateSuccess(false)}>
                        Criteria successfully saved as Template
                    </Alert>
                    <FloatingLabel controlId="criteriaName" label="Criteria Name">
                        <Form.Control 
                            ref={criteriaRef?.name}
                            type="text" 
                            defaultValue={criteria?.name} 
                            className={(!criteriaNameValid) ? 'is-invalid' : ''} 
                            onChange={() => setCriteriaNameValid(isCriteriaNameValid(criteria, list))} />
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaType" label="Criteria Type">
                        <Form.Select 
                            ref={criteriaRef?.type}
                            aria-label="Criteria Type Select"
                            defaultValue={criteria?.type}
                            className={(!criteriaTypeValid) ? 'is-invalid' : ''}
                            onChange={() => {
                                setCriteriaTypeValid(isCriteriaTypeValid(criteria));
                                const yn = isYesNo(criteria);
                                setYesNo(yn);
                                if (yn) {
                                    criteriaRef.values.current.value = 'yes,no';
                                    criteriaRef.multi.current.checked = false;
                                }
                            }}>
                            <option value="worst-to-best">worst-to-best</option>
                            <option value="yes-no">yes-no</option>
                            <option value="positives">positives</option>
                            <option value="negatives">negatives</option>
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaValues" label="Criteria Values">
                        <Form.Control 
                            ref={criteriaRef?.values}
                            type="text" 
                            placeholder="comma separated values" 
                            defaultValue={(!yesNo) ? criteria?.values.join(',') : 'yes,no'} 
                            disabled={yesNo} 
                            className={(!criteriaValuesValid) ? 'is-invalid' : ''}
                            onChange={() => setCriteriaValuesValid(areCritieriaValuesValid(criteria))} />
                    </FloatingLabel>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <div className="d-flex flex-wrap align-content-around px-1">
                            <p className="pe-1 pt-1 mb-1">Multiselect?</p>
                            <Form.Check
                                className="pt-1"
                                ref={criteriaRef?.multi}
                                type="switch" 
                                aria-label="Allow Multiselect?" 
                                defaultChecked={(!yesNo) ? criteria?.allowMultiple : false}
                                disabled={yesNo}
                            />
                        </div>
                        <FloatingLabel controlId="criteriaWeight" label="Weighting">
                            <Form.Control
                                ref={criteriaRef?.weight}
                                type="text" 
                                placeholder="numeric points multiplier"
                                defaultValue={criteria?.weight ?? 1} 
                                className={(!criteriaWeightValid) ? 'is-invalid' : ''}
                                onChange={() => setCriteriaWeightValid(isCritieraWeightValid(criteria))} />
                        </FloatingLabel>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-between ps-1">
                    <ShortlistItTooltip id={`save-criteria-${criteria?.id}`} text="Save Criteria">
                        <Button variant="success" aria-label="Save Criteria" onClick={() => {
                            if (saveCriteria(list?.id, criteria?.id, criteriaRef, props.stateMgr)) {
                                props.onClose();
                                props.onSave();
                            } else {
                                onSaveError();
                            }
                        }}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`save-criteria-template-${criteria?.id}`} text="Save as Template">
                        <Button variant="info" aria-label="Save as Template" onClick={() => saveAsTemplate(criteriaRef, props.stateMgr, onSaveTemplateSuccess, onTemplateExists, onSaveError)}>
                            <BootstrapIcon icon="file-earmark-arrow-down" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`delete-criteria-${criteria?.id}`} text="Delete Criteria">
                        <Button variant="danger" aria-label="Delete Criteria" onClick={() => {
                            props.onClose();
                            props.onDelete();
                            confirmDeleteCriteria(criteria?.id, props.stateMgr); // ...and open confirmation modal
                        }}>
                            <BootstrapIcon icon="trash" />
                        </Button>
                    </ShortlistItTooltip>
                </div>
            </div>
        </ShortlistItModal>
    );
}