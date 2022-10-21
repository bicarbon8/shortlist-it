import React from "react";
import { Navbar, Nav, Container, Button, Form, InputGroup } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";

type ShortlistItNavProps = {
    app: ShortlistIt;
};

export class ShortlistItNav extends React.Component<ShortlistItNavProps> {
    render() {
        return (
            <Navbar sticky="top" collapseOnSelect expand="md" bg="dark" variant="dark">
                <Container fluid className="d-flex justify-content-between">
                    <Navbar.Brand href="/">Shortlist-It</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                        <Nav>
                            <Nav.Item>
                                <Button variant="outline-success" onClick={() => this.props.app.addNewList()}>
                                    <BootstrapIcon icon="plus-lg" /> 
                                    Add New List
                                </Button>
                            </Nav.Item>
                        </Nav>
                        <Navbar.Text className="px-1">
                            <Form.Check 
                                type="switch"
                                id="display-archived"
                                label="View Archived Lists"
                                checked={this.props.app.showArchived}
                                onChange={e => this.props.app.setShowArchived(e.target.checked)}
                            />
                        </Navbar.Text>
                        <Nav>
                            <Nav.Item>
                                <InputGroup>
                                    <Form.Control
                                        id="filter-lists-input"
                                        type="text"
                                        placeholder="enter filter term(s)"
                                        className="me-2"
                                        aria-label="Filter"
                                        defaultValue={this.props.app.filterText}
                                        onChange={(e) => this.setFilterText(e.target.value)}
                                        aria-describedby="filter-lists-clear-button"
                                    />
                                    <Button id="filter-lists-clear-button" variant="outline-secondary" onClick={() => this.clearFilter()}><BootstrapIcon icon="x-circle" /></Button>
                                </InputGroup>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

    setFilterText(filterStr: string = ''): void {
        this.props.app.setFilterText(filterStr);
    }

    clearFilter(): void {
        const input = document.querySelector('#filter-lists-input') as HTMLInputElement;
        input.value = '';
        this.setFilterText('');
    }
}