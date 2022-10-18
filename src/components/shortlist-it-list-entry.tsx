import React from "react";
import { Badge, ListGroupItem } from "react-bootstrap";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItListBody } from "./shortlist-it-list-body";
import { ShortlistItListEntryValuesList } from "./shortlist-it-list-entry-values-list";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";

type ShortlistItListEntryProps = {
    parent: ShortlistItListBody;
    entry: Entry;
};

type ShortlistItListEntryState = {
    editing: boolean;
    expanded: boolean;
};

export class ShortlistItListEntry extends React.Component<ShortlistItListEntryProps, ShortlistItListEntryState> {
    constructor(props: ShortlistItListEntryProps) {
        super(props);
        this.state = {
            editing: false,
            expanded: false
        };
    }
    
    render() {
        const variant = (this.list.archived) ? 'secondary' : 'primary';
        const menuItems = this.getMenuItems();

        return (
            <ListGroupItem variant={variant} className="d-flex flex-column justify-content-between align-content-between flex-wrap">
                <div className="d-flex flex-row justify-content-between w-100">
                    <div className="px-1"><Badge pill={true}>{this.entry.ranking}</Badge></div> 
                    <span className="xs-8 px-1 text-start flex-grow-1">{this.entry.description}</span> 
                    <span className="text-center px-1"> 
                        <ShortlistItMenu 
                            id={this.entry.id}
                            headerText="Entry Options"
                            menuItems={menuItems}>
                            <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                        </ShortlistItMenu>
                    </span>
                </div>
                {this.getValuesList()}
            </ListGroupItem>
        );
    }

    get parent(): ShortlistItListBody {
        return this.props.parent;
    }

    get list(): Shortlist {
        return this.parent.list;
    }

    get entry(): Entry {
        return this.props.entry;
    }

    get editing(): boolean {
        return this.state.editing;
    }

    get expanded(): boolean {
        return this.state.expanded;
    }

    getMenuItems(): Array<ShortlistItMenuItem> {
        const items = new Array<ShortlistItMenuItem>(
            {
                text: (this.expanded) ? 'collapse' : 'expand', 
                icon: (this.expanded) ? 'chevron-bar-contract' : 'chevron-bar-expand',
                action: () => (this.expanded) ? this.collapse() : this.expand()
            }
        );
        if (!this.list.archived) {
            items.push(
                {text: 'edit', icon: 'pencil-square', action: () => this.startEditing()},
                {text: 'delete', icon: 'trash', action: () => null}
            );
        }
        return items;
    }

    getValuesList() {
        if (this.expanded) {
            return <ShortlistItListEntryValuesList parent={this} />;
        } else {
            return <></>;
        }
    }

    startEditing(): void {

    }

    doneEditing(): void {

    }

    expand(): void {
        this.setState({expanded: true});
    }

    collapse(): void {
        this.setState({expanded: false});
    }
}