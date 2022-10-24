import React from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaRefContainer } from "../types/criteria/criteria-ref-container";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { ShortlistItListCriteriaList } from "./shortlist-it-list-criteria-list";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";
import { ShortlistItTooltip } from "./shortlist-it-tooltip";

type ShortlistItListHeaderProps = {
    app: ShortlistIt;
    list: Shortlist;
}

export class ShortlistItListHeader extends React.Component<ShortlistItListHeaderProps> {
    private titleRefObject: React.RefObject<HTMLInputElement>;
    private criteriaRefs: Array<CriteriaRefContainer>;

    constructor(props: ShortlistItListHeaderProps) {
        super(props);
        this.titleRefObject = React.createRef<HTMLInputElement>();
        this.criteriaRefs = this.props.list.criteria.map(c => this.createCriteriaRef(c));
    }
    
    render() {
        return (
            <div className="d-flex flex-row justify-content-between">
                <div className="flex-grow-1 pe-1">{this.getTitleContent()}</div>
                <div className="text-center ps-1">{this.getMenuButtonContent()}</div>
            </div>
        );
    }
    
    shouldComponentUpdate(nextProps: Readonly<ShortlistItListHeaderProps>, nextState: Readonly<{}>, nextContext: any): boolean {
        this.titleRefObject = React.createRef<HTMLInputElement>();
        this.criteriaRefs = nextProps.list.criteria.map(c => this.createCriteriaRef(c));
        return true;
    }

    private getTitleContent() {
        if (this.props.app.isEditingList(this.props.list.id)) {
            return (
                <>
                    <FloatingLabel controlId={`title-input-${this.props.list.id}`} label="List Title">
                        <Form.Control 
                            ref={this.titleRefObject}
                            type="text" 
                            placeholder="enter title or description" 
                            defaultValue={this.props.list.title}
                            className="list-header-title-input" />
                    </FloatingLabel>
                    <ShortlistItListCriteriaList app={this.props.app} list={this.props.list} criteria={this.props.list.criteria} criteriaRefs={this.criteriaRefs} />
                </>
            );
        } else {
            return <>{this.props.list.title}</>;
        }
    }

    private getMenuButtonContent() {
        if (this.props.app.isEditingList(this.props.list.id)) {
            return (
                <div className="d-flex flex-column justify-content-evenly align-content-start sticky">
                    <ShortlistItTooltip id={`save-list-edits-${this.props.list.id}`} text="Save Changes" className="mb-2">
                        <Button variant="success" onClick={() => this.saveChanges()}>
                            <BootstrapIcon icon="check" />
                        </Button>
                    </ShortlistItTooltip>
                    <ShortlistItTooltip id={`cancel-list-edits-${this.props.list.id}`} text="Cancel Edits" className="mt-2">
                        <Button variant="warning" onClick={() => this.props.app.cancelListEdits(this.props.list.id)}>
                            <BootstrapIcon icon="x-circle" />
                        </Button>
                    </ShortlistItTooltip>
                </div>
            );
        } else {
            return (
                <ShortlistItMenu 
                    id={`menu-${this.props.list.id}`}
                    headerText="List Menu"
                    menuItems={this.getMenuItems()}>
                    <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                </ShortlistItMenu>
            );
        }
    }

    private getMenuItems(): Array<ShortlistItMenuItem> {
        const items = new Array<ShortlistItMenuItem>();
        if (this.props.list.archived) {
            items.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => this.props.app.unarchiveList(this.props.list.id)});
        } else {
            items.push({text: 'edit list', icon: 'pencil-square', action: () => this.props.app.startEditingList(this.props.list.id)});
            items.push({text: 'archive', icon: 'archive', action: () => this.props.app.archiveList(this.props.list.id)});
        }
        items.push(
            {text: 'delete', icon: 'trash', action: () => this.props.app.deleteList(this.props.list.id)}
        );
        return items;
    }

    private createCriteriaRef(criteria: Criteria): CriteriaRefContainer {
        return {
            id: criteria.id,
            name: React.createRef<HTMLInputElement>(),
            type: React.createRef<HTMLSelectElement>(),
            values: React.createRef<HTMLInputElement>(),
            multi: React.createRef<HTMLInputElement>()
        };
    }

    private saveChanges(): void {
        const title: string = this.titleRefObject.current.value;
        const criteria = new Array<Criteria>();
        this.criteriaRefs.forEach(r => {
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
        this.props.app.saveListEdits(this.props.list.id, {
            title: title,
            criteria: criteria
        });
    }
}