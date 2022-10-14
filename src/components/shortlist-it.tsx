import React from "react";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Container, Row, Col, ListGroup, ListGroupItem, Badge, Collapse, Card, Navbar, Form, Button, Nav } from "react-bootstrap";
import { ShortlistTooltip } from "./shortlist-tooltip";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistMenu, ShortlistMenuItem } from "./shortlist-menu";
import { store } from "../utilities/store";

export class ShortlistIt extends React.Component<{}, {lists: Array<Shortlist>, showMap: Map<string, boolean>, showArchived: boolean}> {
    constructor(props: never) {
        super(props);
        this.state = {
            showArchived: store.get('showArchived', false),
            lists: store.get('lists', new Array<Shortlist>(
                {
                    title: 'Which type of television should I buy?',
                    criteria: new Array<Criteria>(
                        {name: 'cost', criteriaType: 'worst-to-best' as CriteriaType, values: ['$$$$', '$$$', '$$', '$']},
                        {name: 'size', criteriaType: 'worst-to-best' as CriteriaType, values: ['XS', 'S', 'M', 'L', 'XL']},
                        {name: 'audio ports', criteriaType: 'worst-to-best' as CriteriaType, values: ['3.5mm', 'RCA', 'optical'], allowMultiple: true}
                    ), 
                    entries: new Array<Entry>(
                        {
                            description: 'JVC LT-40CA790 Android TV 40" Smart Full HD LED TV with Google Assistant', 
                            ranking: 1,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$$']],
                                ['size', ['M']],
                                ['audio ports', ['3.5mm', 'optical']]
                            ])
                        }, {
                            description: 'TCL 32RS520K Roku 32" Smart HD Ready LED TV',
                            ranking: 2,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$']],
                                ['size', ['S']]
                            ])
                        }, {
                            description: 'LG 28TN515S 28" Smart HD Ready LED TV',
                            ranking: 3,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$$']],
                                ['size', ['XS']]
                            ])
                        }, {
                            description: 'SAMSUNG UE50TU7020KXXU 50" Smart 4K Ultra HD HDR LED TV',
                            ranking: 3,
                            values: new Map<string, Array<string>>([
                                ['cost', ['$$$$']],
                                ['size', ['L']]
                            ])
                        }
                    )
                },
                {title: 'A Second List - why use it?', criteria: new Array<Criteria>(), entries: new Array<Entry>()},
                {title: 'The Third List Example - this is fun!', criteria: new Array<Criteria>(), entries: new Array<Entry>()}
            )),
            showMap: store.get('showMap', new Map<string, boolean>())
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
                {this.getHeaderBar()}
                <Container className="d-flex justify-content-evenly align-items-start flex-wrap flex-sm-row flex-column">
                    {lists.map((list) => this.getShortlistContainer(list))}
                </Container>
            </>
        );
    }

    getShowArchived(): boolean {
        return this.state.showArchived ?? false;
    }

    setShowArchived(show: boolean) {
        this.setState({showArchived: show});
        store.set('showArchived', show);
    }

    getHeaderBar() {
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
        return (
            <Card key={list.title} className="m-1 px-0 min-width-500 max-width-700">
                <Card.Body className="px-0">
                    <Container>
                        <Row><Col>{this.getShortlistHeader(list)}</Col></Row>
                        <Row><Col>{this.getShortlistBody(list.title, list.entries, list.criteria)}</Col></Row>
                    </Container>
                </Card.Body>
            </Card>
        );
    }

    getShortlistHeader(list: Shortlist) {
        const menuItems = new Array<ShortlistMenuItem>();
        if (list.archived) {
            menuItems.push({text: 'restore', icon: 'arrow-counterclockwise', action: () => this.setArchivedState(list.title, false)});
        } else {
            menuItems.push({text: 'edit', icon: 'pencil-square', action: () => null});
            menuItems.push({text: 'archive', icon: 'archive', action: () => this.setArchivedState(list.title, true)});
        }
        menuItems.push({text: 'delete', icon: 'trash', action: () => null});
        return (
            <Container>
                <Row>
                    <Col xs={10}>{list.title}</Col>
                    <Col className="text-center">
                        <ShortlistMenu 
                            id={list.title}
                            headerText="List Menu"
                            menuItems={menuItems}>
                            <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                        </ShortlistMenu>
                    </Col>
                </Row>
            </Container>
        );
    }

    setArchivedState(title: string, archived: boolean) {
        const listIndex = this.state.lists.findIndex(l => l.title === title);
        if (listIndex >= 0) {
            const lists = this.state.lists;
            lists[listIndex].archived = archived;
            this.setState({lists: lists});
            store.set('lists', lists);
        }
    }

    getShortlistBody(listTitle: string, entries: Array<Entry>, criteria: Array<Criteria>) {
        return (
            <ListGroup>
                {entries.map((entry: Entry) => this.getShortlistEntry(listTitle, entry, criteria))}
                <ListGroupItem variant="dark" key="add_new_entry">
                    <Row className="justify-content-lg-center">
                        <Col xs="auto">
                            <ShortlistTooltip id="add_entry" text="add new entry">
                                <BootstrapIcon icon="plus-lg" onClick={() => this.displayAddEntryModal()} />
                            </ShortlistTooltip>
                        </Col>
                    </Row>
                </ListGroupItem>
            </ListGroup>
        );
    }

    shouldShow(key: string): boolean {
        return this.state.showMap.get(key) || false;
    }

    setShow(key: string, show: boolean): void {
        const showMap = this.state.showMap;
        showMap.set(key, show);
        this.setState({showMap: showMap});
        store.set('showMap', this.state.showMap);
    }

    getShortlistEntry(listTitle: string, entry: Entry, criteria: Array<Criteria>) {
        const key = `${listTitle} - ${entry.description}`; // TODO: need the list title too
        const show = this.shouldShow(key);
        return (
            <ListGroupItem key={entry.description} variant="primary">
                <Row>
                    <Col><Badge pill={true}>{entry.ranking}</Badge></Col>
                    <Col xs="8">{entry.description}</Col>
                    <Col className="text-center">
                        <ShortlistMenu 
                            id={entry.description}
                            headerText="Entry Options"
                            menuItems={[
                                {
                                    text: (show) ? 'contract' : 'expand', 
                                    icon: (show) ? 'chevron-bar-contract' : 'chevron-bar-expand',
                                    action: () => this.setShow(key, !show)
                                },
                                {text: 'edit', icon: 'pencil-square', action: () => null},
                                {text: 'delete', icon: 'trash', action: () => null}
                            ]}>
                            <BootstrapIcon icon="list" style={{ fontSize: '14pt' }} />
                        </ShortlistMenu>
                    </Col>
                    <Collapse in={show}>
                        <ListGroup>
                            {this.getValuesListItems(entry, criteria)}
                            <ListGroupItem variant="dark" key="add_new_criteria">
                                <Row className="justify-content-lg-center">
                                    <Col xs="auto">
                                        <ShortlistTooltip id="add_entry" text="add new entry">
                                            <BootstrapIcon icon="plus-lg" onClick={() => this.displayAddCriteriaModal()} />
                                        </ShortlistTooltip>
                                    </Col>
                                </Row>
                            </ListGroupItem>
                        </ListGroup>
                    </Collapse>
                </Row>
            </ListGroupItem>
        );
    }

    getValuesListItems(entry: Entry, criteria: Array<Criteria>) {
        const criteriaNames = criteria.map(c => c.name);
        
        return criteriaNames.map((criteriaName: string) => (
            <ListGroupItem variant="outline-primary" key={criteriaName}>
                <Container fluid>
                    <Row>
                        <Col xs={3}>{criteriaName}:</Col>
                        <Col>{this.getValuesColumns(entry.values.get(criteriaName), criteria.find(c => c.name === criteriaName)?.values)}</Col>
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