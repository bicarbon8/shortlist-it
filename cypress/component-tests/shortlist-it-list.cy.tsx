import React, { useState } from 'react'
import ShortlistItList from '../../src/components/shortlist-it-list'
import { Shortlist } from '../../src/types/shortlist'
import { Criteria } from '../../src/types/criteria/criteria'
import { Entry } from '../../src/types/entries/entry'
import { v4 } from 'uuid'
import { ShortlistItState } from '../../src/types/shortlist-it-state'
import { ShortlistItStateManager } from '../../src/types/shortlist-it-state-manager'

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
    
    expect(testStateMgr.state.showAddCriteriaModalForList).to.be.undefined;

    cy.get('.bi-list').click();
    cy.get('.list-group-item:nth-child(2)').click().then(e => {
      expect(testStateMgr.state.showAddCriteriaModalForList).not.to.be.undefined;
    });
  })
})

const testList: Shortlist = {
  criteria: new Array<Criteria>(),
  entries: new Array<Entry>(),
  id: v4(),
  archived: false,
  title: v4()
};

const testCriteria: Criteria = {
  id: v4(),
  name: 'size',
  values: new Array<string>('S','M','L'),
  weight: 1
};

const testEntry: Entry = {
  id: v4(),
  description: v4(),
  values: new Map<string, Array<string>>([['size', ['M']]]),
  ranking: 1
};

var testState: ShortlistItState = {
  criteriaTemplates: new Map<string, Omit<Criteria, 'id'>>(),
  lists: new Array<Shortlist>(testList),
  editingListTitleMap: new Map<string, boolean>()
} as ShortlistItState;

const testStateMgr: ShortlistItStateManager = {
  state: testState,
  setState: (state: ShortlistItState) => { testState = {...testState, ...state}}
} as ShortlistItStateManager