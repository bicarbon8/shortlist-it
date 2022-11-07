import React from "react";
import { Navbar, Nav, Container, Button, Form, InputGroup, ButtonGroup } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { ShortlistIt } from "./shortlist-it";
import { saveAs } from 'file-saver';
import { ExternalFile } from "../types/external-file";

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
                            <Nav.Item className="p-1">
                                <Button variant="outline-success" onClick={() => this.props.app.addNewList()}>
                                    <BootstrapIcon icon="plus-lg" />
                                    <span className="ps-2">Add New List</span>
                                </Button>
                            </Nav.Item>
                            <Nav.Item className="p-1">
                                <ButtonGroup>
                                    <Button id="import-lists" variant="outline-success" onClick={() => this.importLists()}>
                                        <BootstrapIcon icon="cloud-upload" />
                                        <span className="ps-2 d-sm-inline d-md-none d-lg-inline">Import List File</span>
                                    </Button>
                                    <Button id="export-lists" variant="outline-success" onClick={() => this.exportLists()}>
                                        <BootstrapIcon icon="cloud-download" />
                                        <span className="ps-2 d-sm-inline d-md-none d-lg-inline">Export Lists</span>
                                    </Button>
                                </ButtonGroup>
                            </Nav.Item>
                        </Nav>
                        <Navbar.Text className="p-1">
                            <Form.Check
                                type="switch"
                                id="display-archived"
                                label="View Archived Lists"
                                checked={this.props.app.showArchived}
                                onChange={e => this.props.app.setShowArchived(e.target.checked)}
                            />
                        </Navbar.Text>
                        <Nav>
                            <Nav.Item className="p-1">
                                <InputGroup>
                                    <Form.Control
                                        id="filter-lists-input"
                                        type="text"
                                        placeholder="enter filter term(s)"
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

    importLists(): void {
        this.readFile()
            .then(f => {
                this.props.app.store.import(f.text);
                this.props.app.refreshState();
            })
            .catch(err => console.error('unable to process supplied file', err));
    }

    private async readFile(): Promise<ExternalFile> {
        let [handle] = await window.showOpenFilePicker();
        const file = await handle.getFile();
        const text = await file.text();
        const f: ExternalFile = {
            text: text, 
            name: file.name, 
            path: file.webkitRelativePath, 
            size: file.size
        };
        return f;
    }

    exportLists(): void {
        const text: string = this.props.app.store.export();
        const downloadFileName = `${this.props.app.store.key}.json`;
        this.saveToFile({ text: text, name: downloadFileName })
            .catch((err) => {
                if (err.name != 'AbortError') { // AbortError is manual user cancel of file save operation
                    console.warn(`unable to use File System API so falling back to legacy mode: ${err}`);
                    saveAs(text, downloadFileName);
                }
            });
    }

    private async saveToFile(data: ExternalFile): Promise<void> {
        const options = {
            suggestedName: data.name,
            types: [
              {
                description: "Shortlist-It export data",
                accept: {
                  "text/json": [".json"],
                },
              },
            ],
          };
        const handle = await window.showSaveFilePicker(options);
        const file = await handle.createWritable();
        await file.write(data.text ?? '');
        await file.close();
    }
}