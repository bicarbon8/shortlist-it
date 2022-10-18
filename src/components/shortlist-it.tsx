import React from "react";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Container, Row, Col, ListGroup, ListGroupItem, Badge, Collapse, Card, Navbar, Form, Button, Nav, Alert, InputGroup, FloatingLabel } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistItMenu, ShortlistItMenuItem } from "./shortlist-it-menu";
import { StorageHelper } from "../utilities/store";
import { ShortlistItList } from "./shortlist-it-list";

type ShortlistItState = {
    lists: Array<Shortlist>,
    expandedStateMap: Map<string, boolean>,
    showArchived: boolean,
    listToBeDeleted?: string;
    listBeingEdited?: string;
};

export class ShortlistIt extends React.Component<{}, ShortlistItState> {
    private store: StorageHelper<ShortlistItState>;
    
    constructor(props: never) {
        super(props);
        this.store = new StorageHelper<ShortlistItState>();
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

    getShortlistContainer(list: Shortlist) {
        const editing = this.state.listBeingEdited === list.id;
        return (
            <Card key={list.id} className="m-1 px-0 min-width-300 max-width-700">
                <Card.Body className="px-0">
                    <Container>
                        <Row><Col>{this.getShortlistHeader(list, editing)}</Col></Row>
                        <Row><Col>{this.getShortlistBody(list, editing)}</Col></Row>
                    </Container>
                </Card.Body>
            </Card>
        );
    }

    getShortlistHeader(list: Shortlist, editing: boolean = false) {
        let titleOrInput;
        let menuOrButtonContent;
        if (editing) {
            titleOrInput = <Form.Control type="text" placeholder="list title"></Form.Control>;
            menuOrButtonContent = (
                <Button onClick={() => this.setEditing()}>Done</Button>
            );
        } else {
            titleOrInput = <>{list.title}</>;
            const menuItems = new Array<ShortlistItMenuItem>();
            if (list.archived) {
                menuItems.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => this.setArchivedState(list.id, false)});
            } else {
                menuItems.push({text: 'edit', icon: 'pencil-square', action: () => this.setEditing(list.id)});
                menuItems.push({text: 'archive', icon: 'archive', action: () => this.setArchivedState(list.id, true)});
            }
            menuItems.push(
                {text: 'expand all', icon: 'chevron-bar-expand', action: () => list.entries.forEach(e => {
                    const key = `${list.id} - ${e.description}`;
                    this.setExpandedState(key, true);
                })},
                {text: 'collapse all', icon: 'chevron-bar-contract', action: () => list.entries.forEach(e => {
                    const key = `${list.id} - ${e.description}`;
                    this.setExpandedState(key, false);
                })},
                {text: 'delete', icon: 'trash', action: () => this.showDeleteConfirmation(list.id)}
            );
            menuOrButtonContent = (
                <ShortlistItMenu 
                    id={list.id}
                    headerText="List Menu"
                    menuItems={menuItems}>
                    <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                </ShortlistItMenu>
            );
        }
        return (
            <Container>
                <Row>
                    <Col xs={10}>{titleOrInput}</Col>
                    <Col className="text-center">
                        {menuOrButtonContent}
                    </Col>
                </Row>
            </Container>
        );
    }

    doneEditing(id?: string): void {
        this.setState({listBeingEdited: undefined});
    }

    setEditing(id?: string): void {
        this.setState({listBeingEdited: id});
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

    showDeleteConfirmation(listId: string) {
        // prevent scrolling
        const html = document.querySelector("html");
        if (html) {
            html.style.overflow = "hidden";
        }
        this.setState({listToBeDeleted: listId});
    }

    hideDeleteConfirmation() {
        this.setState({listToBeDeleted: undefined});
        // restore scrolling
        const html = document.querySelector("html");
        if (html) {
            html.style.overflow = "auto";
        }
    }

    getListDeleteConfirmation() {
        const listId = this.state.listToBeDeleted;
        if (listId) {
            return (
                <div className="overlay d-flex justify-content-center align-content-center">
                    <Alert className="fill-screen-99 mt-3" id={`delete-${listId}`} variant="danger" dismissible onClose={() => this.hideDeleteConfirmation()}>
                        <Alert.Heading>Warning!</Alert.Heading>
                        <p>
                        are you certain you want to delete list titled: <i>{listId}</i> a deleted list can not be recovered. 
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
                    </Alert>
                </div>
            );
        } else {
            return <></>;
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

    getShortlistBody(list: Shortlist, editing: boolean = false) {
        let criteriaList;
        if (editing) {
            criteriaList = <ListGroupItem variant="warning">{this.getShortlistCriteria(list)}</ListGroupItem>;
        } else {
            criteriaList = <></>;
        }
        let addEntryButton;
        if (list.archived) {
            addEntryButton = <></>;
        } else {
            addEntryButton = (
                <ListGroupItem 
                    variant="dark"
                    key="add_new_entry" 
                    onClick={() => this.displayAddEntryModal()}
                    className="d-flex justify-content-center clickable">
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Entry
                </ListGroupItem>
            );
        }
        return (
            <ListGroup>
                {criteriaList}
                {list.entries.map((entry: Entry) => this.getShortlistEntry(list, entry))}
                {addEntryButton}
            </ListGroup>
        );
    }

    getShortlistCriteria(list: Shortlist) {
        return (
            <ListGroup>
                {list.criteria.map(c => this.getShortlistCriteriaItem(c))}
                <ListGroupItem
                    variant="info"
                    key="add_new_criteria" 
                    onClick={() => {
                        list.criteria.push({id: v4(), values: new Array<string>()});
                        this.forceUpdate();
                    }}
                    className="d-flex justify-content-center clickable">
                    <BootstrapIcon icon="plus-lg" /> 
                    Add New Criteria
                </ListGroupItem>
            </ListGroup>
        )
    }

    getShortlistCriteriaItem(criteria: Criteria) {
        return (
            <ListGroupItem id={criteria.id} variant="dark" key={criteria.name} className="d-flex flex-column justify-content-evenly">
                <InputGroup>
                    <FloatingLabel controlId="criteriaName" label="Criteria Name">
                        <Form.Control type="text" value={criteria.name} onChange={() => null} />
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaType" label="Criteria Type">
                        <Form.Select aria-label="Default select example">
                            <option value="worst-to-best" selected={criteria.type === 'worst-to-best'}>worst-to-best</option>
                            <option value="boolean" selected={criteria.type === 'boolean'}>boolean</option>
                            <option value="positives" selected={criteria.type === 'positives'}>positives</option>
                            <option value="negatives" selected={criteria.type === 'negatives'}>negatives</option>
                        </Form.Select>
                    </FloatingLabel>
                    <FloatingLabel controlId="criteriaValues" label="Criteria Values">
                        <Form.Control type="text" placeholder="comma separated values" value={criteria.values.join(',')} onChange={() => null} />
                    </FloatingLabel>
                </InputGroup>
                <div className="d-flex flex-row justify-content-between">
                    <Form.Check type="switch" label="Allow Multiselect?" checked={criteria.allowMultiple} /> 
                    <Button onClick={() => null}><BootstrapIcon icon="trash" /></Button>
                </div>
            </ListGroupItem>
        );
    }

    shouldShow(key: string): boolean {
        return this.state.expandedStateMap.get(key) || false;
    }

    setExpandedState(key: string, expanded: boolean): void {
        const expandedStateMap = this.state.expandedStateMap;
        expandedStateMap.set(key, expanded);
        this.store.set('expandedStateMap', expandedStateMap);
        this.setState({expandedStateMap: expandedStateMap});
    }

    getShortlistEntry(list: Shortlist, entry: Entry) {
        const key = `${list.id} - ${entry.description}`; // TODO: need the list title too
        const show = this.shouldShow(key);
        const variant = (list.archived) ? 'secondary' : 'primary';
        const menuItems = new Array<ShortlistItMenuItem>(
            {
                text: (show) ? 'collapse' : 'expand', 
                icon: (show) ? 'chevron-bar-contract' : 'chevron-bar-expand',
                action: () => this.setExpandedState(key, !show)
            }
        );
        if (!list.archived) {
            menuItems.push(
                {text: 'edit', icon: 'pencil-square', action: () => null},
                {text: 'delete', icon: 'trash', action: () => null}
            );
        }

        return (
            <ListGroupItem key={entry.id} variant={variant}>
                <Row>
                    <Col><Badge pill={true}>{entry.ranking}</Badge></Col>
                    <Col xs="8">{entry.description}</Col>
                    <Col className="text-center">
                        <ShortlistItMenu 
                            id={entry.id}
                            headerText="Entry Options"
                            menuItems={menuItems}>
                            <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                        </ShortlistItMenu>
                    </Col>
                    <Collapse in={show}>
                        <ListGroup>
                            {this.getValuesListItems(list, entry)}
                        </ListGroup>
                    </Collapse>
                </Row>
            </ListGroupItem>
        );
    }

    getValuesListItems(list: Shortlist, entry: Entry) {
        const criteriaNames = list.criteria.filter(c => c != null).map(c => c.name ?? '');
        const variant = 'secondary';
        
        return criteriaNames.map((criteriaName: string) => (
            <ListGroupItem variant={variant} key={criteriaName}>
                <Container fluid>
                    <Row>
                        <Col xs={3} className="min-width-200">{criteriaName}:</Col>
                        <Col>{this.getValuesColumns(entry.values.get(criteriaName), list.criteria.find(c => c.name === criteriaName)?.values)}</Col>
                    </Row>
                </Container>
            </ListGroupItem>
        ));
    }

    getValuesColumns(selectedValues: Array<string> | undefined, allValues: Array<string> | undefined) {
        const selected = selectedValues || new Array<string>();
        const all = allValues || new Array<string>();
        return (
            <Container>
                <Row>
                    {all.map(val => {
                        if (selected.includes(val)) {
                            return (<Col key={val}><Badge>{val}</Badge></Col>);
                        } else {
                            return (<Col key={val}>{val}</Col>)
                        }
                    })}
                </Row>
            </Container>
        );
    }

    displayAddEntryModal() {
        
    }

    displayAddCriteriaModal() {

    }
}