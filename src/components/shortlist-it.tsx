import React from "react";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Container, Navbar, Form, Button, Nav, Alert } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { Storage } from "../utilities/storage";
import { ShortlistItList } from "./shortlist-it-list";
import { ShortlistItModal } from "./shortlist-it-modal";

type ShortlistItState = {
    lists: Array<Shortlist>,
    expandedStateMap: Map<string, boolean>,
    showArchived: boolean,
    listToBeDeleted?: string;
    listBeingEdited?: string;
};

export class ShortlistIt extends React.Component<{}, ShortlistItState> {
    private store: Storage<ShortlistItState>;
    
    constructor(props: never) {
        super(props);
        this.store = new Storage<ShortlistItState>();
        this.state = {
            showArchived: this.store.get('showArchived', false),
            lists: this.store.get('lists', new Array<Shortlist>(
                {
                    id: v4(),
                    title: 'Which type of television should I buy?',
                    criteria: new Array<Criteria>(
                        {id: v4(), name: 'cost', type: 'worst-to-best' as CriteriaType, values: ['$$$$', '$$$', '$$', '$']},
                        {id: v4(), name: 'size', type: 'worst-to-best' as CriteriaType, values: ['XS', 'S', 'M', 'L', 'XL']},
                        {id: v4(), name: 'audio ports', type: 'worst-to-best' as CriteriaType, values: ['3.5mm', 'RCA', 'optical'], allowMultiple: true}
                    ), 
                    entries: new Array<Entry>(
                        {
                            id: v4(),
                            description: 'JVC LT-40CA790 Android TV 40" Smart Full HD LED TV with Google Assistant', 
                            ranking: 1,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$$']],
                                ['size', ['M']],
                                ['audio ports', ['3.5mm', 'optical']]
                            ])
                        }, {
                            id: v4(),
                            description: 'TCL 32RS520K Roku 32" Smart HD Ready LED TV',
                            ranking: 2,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$']],
                                ['size', ['S']]
                            ])
                        }, {
                            id: v4(),
                            description: 'LG 28TN515S 28" Smart HD Ready LED TV',
                            ranking: 3,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$$']],
                                ['size', ['XS']]
                            ])
                        }, {
                            id: v4(),
                            description: 'SAMSUNG UE50TU7020KXXU 50" Smart 4K Ultra HD HDR LED TV',
                            ranking: 3,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$$$$']],
                                ['size', ['L']]
                            ])
                        }
                    )
                },
                {
                    id: v4(),
                    title: 'Which friends should I invest my time in?', 
                    criteria: new Array<Criteria>(
                        {id: v4(), name: 'giver or taker', type: 'worst-to-best' as CriteriaType, values: ['taker', 'both', 'giver']},
                        {id: v4(), name: 'feeling when with them', type: 'worst-to-best' as CriteriaType, values: ['anger', 'agitation', 'sadness', 'nothingness', 'warmth', 'joy', 'elation']},
                        {id: v4(), name: 'activity level', type: 'worst-to-best' as CriteriaType, values: ['none', 'extreme', 'low', 'moderate']}, 
                        {id: v4(), name: 'makes me a better person', type: 'boolean' as CriteriaType, values: ['true', 'false']},
                        {id: v4(), name: 'good features', type: 'positives' as CriteriaType, values: ['tidy', 'fashionable', 'kind', 'athletic', 'attractive', 'intelligent'], allowMultiple: true}
                    ), 
                    entries: new Array<Entry>(
                        {
                            id: v4(),
                            description: 'Mark',
                            ranking: 1,
                            values: new Map<string, Array<string>>([
                                ['giver or taker', ['giver']],
                                ['feeling when with them', ['joy']],
                                ['activity level', ['moderate']],
                                ['makes me a better person', ['false']],
                                ['good features', ['kind', 'athletic', 'intelligent']]
                            ])
                        },
                        {
                            id: v4(),
                            description: 'Carl',
                            ranking: 2,
                            values: new Map<string, Array<string>>([
                                ['giver or taker', ['giver']],
                                ['feeling when with them', ['joy']],
                                ['activity level', ['low']],
                                ['makes me a better person', ['true']],
                                ['good features', ['kind', 'intelligent']]
                            ])
                        },
                        {
                            id: v4(),
                            description: 'Sophie',
                            ranking: 3,
                            values: new Map<string, Array<string>>([
                                ['giver or taker', ['both']],
                                ['feeling when with them', ['warmth']],
                                ['activity level', ['low']],
                                ['makes me a better person', ['false']],
                                ['good features', ['tidy', 'attractive']]
                            ])
                        },
                        {
                            id: v4(),
                            description: 'Roger',
                            ranking: 4,
                            values: new Map<string, Array<string>>([
                                ['giver or taker', ['taker']],
                                ['feeling when with them', ['nothingness']],
                                ['activity level', ['moderate']],
                                ['makes me a better person', ['true']],
                                ['good features', ['athletic', 'intelligent']]
                            ])
                        }
                    )
                },
                {id: v4(), title: 'The Third List Example - this is fun!', criteria: new Array<Criteria>(), entries: new Array<Entry>()}
            )),
            expandedStateMap: this.store.get('expandedStateMap', new Map<string, boolean>())
        };
    }

    getLists(): Array<Shortlist> {
        if (this.getShowArchived()) {
            return this.state.lists;
        }
        return this.state.lists.filter(l => l.archived !== true);
    }

    render() {
        const lists: Array<Shortlist> = this.getLists();

        return (
            <>
                {this.getListDeleteConfirmation()}
                {this.getNavbar()}
                <div className="d-flex justify-content-evenly align-items-start flex-wrap flex-sm-row flex-column">
                    {lists.map((list) => <ShortlistItList key={list.id} parent={this} list={list} />)}
                </div>
            </>
        );
    }

    getShowArchived(): boolean {
        return this.state.showArchived ?? false;
    }

    setShowArchived(show: boolean) {
        this.store.set('showArchived', show);
        this.setState({showArchived: show});
    }

    getNavbar() {
        return (
            <Navbar sticky="top" collapseOnSelect expand="md" bg="dark" variant="dark">
                <Container fluid className="d-flex justify-content-between">
                    <Navbar.Brand href="/">Shortlist-It</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                        <Nav>
                            <Nav.Item>
                                <Button variant="outline-success"><BootstrapIcon icon="plus-lg" /> Add New List</Button>
                            </Nav.Item>
                        </Nav>
                        <Navbar.Text className="px-1">
                            <Form.Check 
                                type="switch"
                                id="display-archived"
                                label="View Archived Lists"
                                checked={this.getShowArchived()}
                                onChange={e => this.setShowArchived(e.target.checked)}
                            />
                        </Navbar.Text>
                        <Nav>
                            <Nav.Item>
                                <Form className="d-flex">
                                    <Form.Control
                                        type="search"
                                        placeholder="enter search term(s)"
                                        className="me-2"
                                        aria-label="Search"
                                    />
                                    <Button variant="outline-success">Search</Button>
                                </Form>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

    showDeleteConfirmation(listId: string) {
        this.setState({listToBeDeleted: listId});
    }

    hideDeleteConfirmation() {
        this.setState({listToBeDeleted: undefined});
    }

    getListDeleteConfirmation() {
        const listId = this.state.listToBeDeleted ?? '';
        const listTitle = this.state.lists.find(l => l.id === listId)?.title;
        return (
            <ShortlistItModal 
                id={`delete-${listId}`}
                variant="danger"
                heading="Warning!"
                dismissible={true}
                show={!!(listId && listTitle)}
                onClose={() => this.hideDeleteConfirmation()}>
                <p>
                are you certain you want to delete list titled: <i>{listTitle}</i> a deleted list can not be recovered. 
                would you rather archive this list instead?
                </p>
                <hr />
                <div className="d-flex justify-content-between">
                    <Button onClick={() => this.archiveList(listId)} variant="outline-dark">
                        Archive
                    </Button>
                    <Button onClick={() => this.deleteList(listId)} variant="outline-danger">
                        DELETE
                    </Button>
                </div>
            </ShortlistItModal>
        );
    }

    setArchivedState(listId: string, archived: boolean) {
        const listIndex = this.state.lists.findIndex(l => l.id === listId);
        if (listIndex >= 0) {
            const lists = this.state.lists;
            lists[listIndex].archived = archived;
            this.store.set('lists', lists);
            this.setState({lists: lists});
        }
    }

    archiveList(listId: string): void {
        this.hideDeleteConfirmation();
        this.setArchivedState(listId, true);
    }

    deleteList(listId: string): void {
        this.hideDeleteConfirmation();

        const listIndex = this.state.lists.findIndex(l => l.id === listId);
        if (listIndex >= 0) {
            const tmp = this.state.lists;
            tmp.splice(listIndex, 1);
            this.store.set('lists', tmp);
            this.setState({lists: tmp});
        }
    }
}