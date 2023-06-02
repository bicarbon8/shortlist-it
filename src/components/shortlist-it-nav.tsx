import React from "react";
import { Navbar, Nav, Container, Button, Form, InputGroup, ButtonGroup } from "react-bootstrap";
import { BootstrapIcon } from "./bootstrap-icon";
import { saveAs } from 'file-saver';
import { ExternalFile } from "../types/external-file";
import { Shortlist } from "../types/shortlist";
import { v4 } from "uuid";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { ShortlistItStateManager } from "../types/shortlist-it-state-manager";
import { store } from "../utilities/storage";
import { startEditingList } from "../component-actions/list-actions";

export type ShortlistItNavProps = {
    stateMgr: ShortlistItStateManager;
};

function refreshState(stateMgr: ShortlistItStateManager): void {
    stateMgr.setState({
        ...stateMgr.state,
        showArchived: store.get('showArchived', false),
        lists: store.get('lists', new Array<Shortlist>()),
        filterText: store.get('filterText', '')
    });
}

function clearFilter(stateMgr: ShortlistItStateManager): void {
    const input = document.querySelector('#filter-lists-input') as HTMLInputElement;
    input.value = '';
    stateMgr.setState({
        ...stateMgr.state,
        filterText: ''
    });
}

function importLists(stateMgr: ShortlistItStateManager): void {
    const confirmed: boolean = window.confirm('this action will overwrite any existing lists; are you sure?');
    if (confirmed) {
        readFile(stateMgr)
            .catch((err) => {
                if (err.name != 'AbortError') { // AbortError is manual user cancel of file save operation
                    console.warn(`unable to use File System API so falling back to legacy mode: ${err}`);
                    document.getElementById('file-input').click();
                }
            });
    }
}

function exportLists(stateMgr: ShortlistItStateManager): void {
    const text: string = store.export();
    const downloadFileName = `${store.key}.json`;
    saveToFile({ text: text, name: downloadFileName })
        .catch((err) => {
            if (err.name != 'AbortError') { // AbortError is manual user cancel of file save operation
                console.warn(`unable to use File System API so falling back to legacy mode: ${err}`);
                let blob = new Blob([text], { type: 'data:attachment/text; charset=utf-8' });
                saveAs(blob, downloadFileName);
            }
        });
}

/**
 * attempt to use `window.showOpenFilePicker` to select file
 */
async function readFile(stateMgr: ShortlistItStateManager): Promise<void> {
    let [handle] = await window.showOpenFilePicker();
    const file = await handle.getFile();
    const text = await file.text();
    store.import(text);
    refreshState(stateMgr);
}

/**
 * handles change event for hidden file input if calling
 * `window.showOpenFilePicker` is unsuccessful
 * @param file selected file
 */
async function handleFileInput(file: File, stateMgr: ShortlistItStateManager): Promise<void> {
    if (file) {
        const text = await file.text();
        store.import(text);
        refreshState(stateMgr);
    }
}

async function saveToFile(data: ExternalFile): Promise<void> {
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

function addNewList(stateMgr: ShortlistItStateManager): void {
    const list: Shortlist = {
        id: v4(),
        title: `New Shortlist (${stateMgr.state.lists.length + 1})`,
        entries: new Array<Entry>(),
        criteria: new Array<Criteria>()
    };
    const allLists = stateMgr.state.lists;
    allLists.unshift(list);
    store.set('lists', allLists);
    stateMgr.setState({
        ...stateMgr.state,
        lists: allLists
    });
    startEditingList(list.id, stateMgr);
}

export function ShortlistItNav(props: ShortlistItNavProps) {
    return (
        <Navbar sticky="top" collapseOnSelect expand="md" bg="dark" variant="dark">
            <Container fluid className="d-flex justify-content-between">
                <Navbar.Brand href="/">Shortlist-It</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                    <Nav>
                        <Nav.Item className="p-1">
                            <Button variant="outline-success" onClick={() => addNewList(props.stateMgr)}>
                                <BootstrapIcon icon="plus-lg" />
                                <span className="ps-2">Add New List</span>
                            </Button>
                        </Nav.Item>
                        <Nav.Item className="p-1">
                            <ButtonGroup>
                                <Button id="import-lists" variant="outline-success" onClick={() => importLists(props.stateMgr)}>
                                    <BootstrapIcon icon="cloud-upload" />
                                    <span className="ps-2 d-sm-inline d-md-none d-lg-inline">Import List File</span>
                                </Button>
                                <Button id="export-lists" variant="outline-success" onClick={() => exportLists(props.stateMgr)}>
                                    <BootstrapIcon icon="cloud-download" />
                                    <span className="ps-2 d-sm-inline d-md-none d-lg-inline">Export Lists</span>
                                </Button>
                            </ButtonGroup>
                            <Form.Control 
                                type="file" 
                                id="file-input" 
                                onChange={(e) => handleFileInput((e.target as HTMLInputElement)?.files?.[0], props.stateMgr)} 
                                className="file-input visually-hidden" />
                        </Nav.Item>
                    </Nav>
                    <Navbar.Text className="p-1">
                        <Form.Check
                            type="switch"
                            id="display-archived"
                            label="View Archived Lists"
                            checked={props.stateMgr.state.showArchived}
                            onChange={e => props.stateMgr.setState({
                                ...props.stateMgr.state,
                                showArchived: e.target.checked
                            })}
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
                                    defaultValue={props.stateMgr.state.filterText}
                                    onChange={(e) => props.stateMgr.setState({
                                        ...props.stateMgr.state,
                                        filterText: e.target.value
                                    })}
                                    aria-describedby="filter-lists-clear-button"
                                />
                                <Button 
                                    id="filter-lists-clear-button" 
                                    variant="outline-secondary" 
                                    onClick={() => clearFilter(props.stateMgr)}
                                >
                                    <BootstrapIcon icon="x-circle" />
                                </Button>
                            </InputGroup>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}