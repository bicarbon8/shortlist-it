import React from "react";
import { v4 } from "uuid";
import { Shortlist } from "../types/shortlist";
import { Entry } from "../types/entries/entry";
import { Criteria } from "../types/criteria/criteria";
import { CriteriaType } from "../types/criteria/criteria-type";
import { Button } from "react-bootstrap";
import { Storage } from "../utilities/storage";
import { ShortlistItList } from "./shortlist-it-list";
import { ShortlistItModal } from "./shortlist-it-modal";
import { ShortlistItNav } from "./shortlist-it-nav";

type ShortlistItState = {
    lists: Array<Shortlist>,
    showArchived: boolean,
    listToBeDeleted?: string;
    filterText: string;
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
                        {id: v4(), name: 'makes me a better person', type: 'yes-no' as CriteriaType, values: ['yes', 'no']},
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
                                ['makes me a better person', ['no']],
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
                                ['makes me a better person', ['yes']],
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
                                ['makes me a better person', ['no']],
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
                                ['makes me a better person', ['yes']],
                                ['good features', ['athletic', 'intelligent']]
                            ])
                        }
                    )
                },
                {id: v4(), title: 'The Third List Example - this is fun!', criteria: new Array<Criteria>(), entries: new Array<Entry>()}
            )),
            filterText: this.store.get('filterText', '')
        };
    }

    getLists(): Array<Shortlist> {
        let lists = this.state.lists;
        if (!this.showArchived) {
            lists = lists.filter(l => l.archived !== true)
        }
        if (this.filterText && this.filterText !== '') {
            // create the regex matcher
            const filters: string[] = this.filterText.split(' ');
            let rStr: string = '';
            for (var i=0; i<filters.length; i++) {
                var filter = filters[i].replace(/([-\(\)\[\]\{\}+\?*\.$\^\|,:#<\!\\])/g, '\\$1').replace(/\x08/g, '\\x08');
                rStr += ".*(" + filter + ").*";
            }
            const regex = new RegExp(rStr, "i");
            lists = lists.filter(l => l.title?.match(regex) || l.entries.find(e => e.description?.match(regex)));
        }
        return lists;
    }

    render() {
        const lists: Array<Shortlist> = this.getLists();

        return (
            <>
                {this.getListDeleteConfirmationModal()}
                <ShortlistItNav parent={this} />
                <div className="d-flex justify-content-evenly align-items-start flex-wrap flex-sm-row flex-column">
                    {lists.map((list) => <ShortlistItList key={list.id} parent={this} list={list} />)}
                </div>
            </>
        );
    }

    get showArchived(): boolean {
        return this.state.showArchived ?? false;
    }

    get filterText(): string {
        return this.state.filterText;
    }

    setShowArchived(show: boolean) {
        this.store.set('showArchived', show);
        this.setState({showArchived: show});
    }

    deleteList(listId: string) {
        this.setState({listToBeDeleted: listId});
    }

    private hideDeleteConfirmation() {
        this.setState({listToBeDeleted: undefined});
    }

    private getListDeleteConfirmationModal() {
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
                    <Button onClick={() => this.confirmDeletion(listId)} variant="outline-danger">
                        DELETE
                    </Button>
                </div>
            </ShortlistItModal>
        );
    }

    private setArchivedState(listId: string, archived: boolean) {
        const listIndex = this.state.lists.findIndex(l => l.id === listId);
        if (listIndex >= 0) {
            const lists = this.state.lists;
            lists[listIndex].archived = archived;
            this.store.set('lists', lists);
            this.setState({lists: lists});
        }
    }

    addNewList(): string {
        const list: Shortlist = {
            id: v4(),
            title: `New Shortlist (${this.state.lists.length + 1})`,
            entries: new Array<Entry>(),
            criteria: new Array<Criteria>()
        };
        const allLists = this.state.lists;
        allLists.unshift(list);
        this.store.set('lists', allLists);
        this.setState({lists: allLists});
        return list.id;
    }

    getList(id: string): Shortlist | undefined {
        return this.state.lists.find(l => l.id === id);
    }

    updateList(updated: Shortlist): void {
        const allLists = this.state.lists;
        const index = allLists.findIndex(l => l.id === updated.id);
        if (index >= 0) {
            allLists.splice(index, 1, updated);
            this.store.set('lists', allLists);
            this.setState({lists: allLists});
        }
    }

    archiveList(listId: string): void {
        this.hideDeleteConfirmation();
        this.setArchivedState(listId, true);
    }

    unarchiveList(listId: string): void {
        this.setArchivedState(listId, false);
    }

    private confirmDeletion(listId: string): void {
        this.hideDeleteConfirmation();

        const listIndex = this.state.lists.findIndex(l => l.id === listId);
        if (listIndex >= 0) {
            const tmp = this.state.lists;
            tmp.splice(listIndex, 1);
            this.store.set('lists', tmp);
            this.setState({lists: tmp});
        }
    }

    setFilterText(filterStr: string): void {
        this.store.set('filterText', filterStr);
        this.setState({filterText: filterStr});
    }
}