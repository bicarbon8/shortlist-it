import React from "react";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Container, Row, Col, ListGroup, ListGroupItem, Badge, Collapse } from "react-bootstrap";
import { ShortlistTooltip } from "./shortlist-tooltip";
import { BootstrapIcon } from "./bootstrap-icon";

export class ShortlistItApp extends React.Component<never, {lists: Array<Shortlist>, showMap: Map<string, boolean>}> {
    constructor(props: never) {
        super(props);
        this.state = {
            lists: new Array<Shortlist>(
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
            ),
            showMap: new Map<string, boolean>()
        };
    }

    render() {
        const lists: Array<Shortlist> = this.state.lists;

        return (<>{lists.map((list) => this.getShortlistContainer(list))}</>);
    }

    getShortlistContainer(list: Shortlist) {
        return (
            <Container key={list.title} className="col-lg-6 pb-4">
                <Row><Col>{this.getShortlistHeader(list.title)}</Col></Row>
                <Row><Col>{this.getShortlistBody(list.title, list.entries, list.criteria)}</Col></Row>
            </Container>
        );
    }

    getShortlistHeader(title: string) {
        return (
            <Container>
                <Row>
                    <Col xs={10}>{title}</Col>
                    <Col className="text-center">
                        <ShortlistTooltip id={title} text="delete list">
                            <BootstrapIcon icon="trash" style={{ fontSize: '14pt' }} />
                            {/* TODO: await fix for: https://github.com/ismamz/react-bootstrap-icons/issues/39 */}
                            {/* <Icon.List color="royalBlue" size={40} title="toggle display of list" /> */}
                        </ShortlistTooltip>
                    </Col>
                </Row>
            </Container>
        );
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
        if (!this.state.showMap.has(key)) {
            this.state.showMap.set(key, false);
        }
        return this.state.showMap.get(key) || false;
    }

    setShow(key: string, show: boolean): void {
        const state = {...this.state};
        state.showMap.set(key, show);
        this.setState(state);
    }

    getShortlistEntry(listTitle: string, entry: Entry, criteria: Array<Criteria>) {
        const key = `${listTitle} - ${entry.description}`; // TODO: need the list title too
        return (
            <ListGroupItem key={entry.description} variant="primary">
                <Row>
                    <Col><Badge pill={true}>{entry.ranking}</Badge></Col>
                    <Col xs="8" onClick={() => this.setShow(key, !this.shouldShow(key))} aria-expanded={this.shouldShow(key)}>{entry.description}</Col>
                    <Col className="text-center">
                        <ShortlistTooltip id={entry.description} text="delete entry">
                            <BootstrapIcon icon="trash" style={{ fontSize: '14pt' }} />
                        </ShortlistTooltip>
                    </Col>
                    <Collapse in={this.shouldShow(key)}>
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