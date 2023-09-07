import React from 'react'
import ShortlistItList from '../../src/components/shortlist-it-list'
import { Shortlist } from '../../src/types/shortlist'
import { Criteria } from '../../src/types/criteria/criteria'
import { Entry } from '../../src/types/entries/entry'
import { v4 } from 'uuid'
import { ShortlistItState } from '../../src/types/shortlist-it-state'
import { ShortlistItStateManager } from '../../src/types/shortlist-it-state-manager'
import { ElementHelper } from '../../src/utilities/element-helper'

describe('<ShortlistItList />', () => {
  it('can display empty list', () => {
    cy.mount(<ShortlistItList
      list={testList}
      stateMgr={testStateMgr} />);
  })

  it('can trigger showing add criteria modal from list menu popover', () => {
    cy.mount(<ShortlistItList
      list={testList}
      stateMgr={testStateMgr} />);
    
    cy.get('.bi-list').click();
    cy.get('.list-group-item:nth-child(2)').click();
    cy.get('.overlay').get('.alert-heading').should('contain.text', 'Edit Criteria')
      .get('input#criteriaName').should('have.value', '');
  })

  it('displays existing criteria', () => {
    cy.mount(<ShortlistItList
      list={{...testList, criteria: [testCriteria]}}
      stateMgr={testStateMgr} />);

    cy.get('thead th').should('contain.text', testCriteria.name);
  })

  it('allows editing existing criteria', () => {
    cy.mount(<ShortlistItList
      list={{...testList, criteria: [testCriteria]}}
      stateMgr={testStateMgr} />);
    
    cy.get('thead th .bi-pencil-square').click();
    cy.get('.overlay').get('.alert-heading').should('contain.text', 'Edit Criteria')
      .get('input#criteriaName').should('have.value', testCriteria.name);
  })

  it('can add entry', () => {
    const list = {...testList, criteria: [testCriteria], entries: [testEntry]};
    const stateMgr: ShortlistItStateManager = {...testStateMgr, state: {...testStateMgr.state, lists: [list]}};
    cy.mount(<ShortlistItList
      list={list}
      stateMgr={stateMgr} />);

    cy.get('table td #add-entry-table-button').click();
    cy.get('.overlay').get('.alert-heading').should('contain.text', 'Edit Entry')
      .get('textarea#entry-description-input').should('have.value', '')
      .should('have.class', 'is-invalid');
    cy.get('textarea#entry-description-input').type(v4());
    cy.get(`#values-select-${ElementHelper.idEncode(testCriteria.name)}`).select(testCriteria.values[0]);
    cy.get('.overlay').get('.alert-heading').get('#save-entry button').click();
    cy.get('.overlay').should('not.exist');
  })
})

const listId = v4();
const testList: Shortlist = {
  criteria: new Array<Criteria>(),
  entries: new Array<Entry>(),
  id: listId,
  archived: false,
  title: listId
};

const testCriteria: Criteria = {
  id: v4(),
  name: 'size',
  values: new Array<string>('S','M','L'),
  weight: 1,
  listId: listId
};

const entryId = v4();
const testEntry: Entry = {
  id: entryId,
  description: entryId,
  values: new Map<string, Array<string>>([['size', ['M']]]),
  ranking: 1,
  listId: listId
};

var testState: ShortlistItState = {
  criteriaTemplates: new Map<string, Omit<Criteria, 'id'>>(),
  lists: new Array<Shortlist>(testList),
} as ShortlistItState;

const testStateMgr: ShortlistItStateManager = {
  state: testState,
  setState: (state: ShortlistItState) => { testState = {...testState, ...state}}
} as ShortlistItStateManager;