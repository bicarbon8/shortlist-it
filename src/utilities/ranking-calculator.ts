import { CriteriaType } from "../types/criteria/criteria-type";
import { Entry } from "../types/entries/entry";
import { Shortlist } from "../types/shortlist";

class RankingCalculator {
    rankEntries(list: Shortlist): Shortlist {
        const pruned = this.pruneValuesWithNoMatchingCriteria(list);
        const origEntries = pruned.entries;
        const valuesMap = new Map<number, Array<Entry>>();
        for (var i=0; i<origEntries.length; i++) {
            const entry = origEntries[i];
            const entryTotal = this.calculateEntryTotal(entry, pruned);
            if (!valuesMap.has(entryTotal)) {
                valuesMap.set(entryTotal, new Array<Entry>(entry));
            } else {
                const arr = valuesMap.get(entryTotal);
                if (arr) {
                    arr.push(entry);
                    valuesMap.set(entryTotal, arr);
                }
            }
        }

        const rankedEntries = new Array<Entry>();
        let rank = 1;
        // get points values starting with highest
        const points = Array.from(valuesMap.keys()).sort((a, b) => a - b).reverse();
        for (var i=0; i<points.length; i++) {
            const entries = valuesMap.get(points[i]);
            if (entries?.length) {
                for (var j=0; j<entries.length; j++) {
                    const entry = entries[j];
                    entry.ranking = rank;
                    rankedEntries.push(entry);
                }
            }
            rank++;
        }
        pruned.entries = rankedEntries;
        return pruned;
    }

    private pruneValuesWithNoMatchingCriteria(list: Shortlist): Shortlist {
        const criteriaNames: Array<string> = list.criteria.map(c => c.name);
        const updatedEntries = new Array<Entry>();
        list.entries.forEach(entry => {
            const updatedValues = new Map<string, Array<string>>();
            entry.values.forEach((vals: Array<string>, key: string) => {
                if (criteriaNames.includes(key)) {
                    const updatedVals = new Array<string>();
                    vals.forEach((val: string) => {
                        if (list.criteria.find(c => c.name === key).values.includes(val)) {
                            updatedVals.push(val);
                        }
                    });
                    updatedValues.set(key, updatedVals);
                }
            });
            updatedEntries.push({...entry, ...{values: updatedValues}});
        });
        return {...list, ...{entries: updatedEntries}};
    }

    private calculateEntryTotal(entry: Entry, list: Shortlist): number {
        let total = 0;
        entry.values.forEach((vals: Array<string>, criteriaName: string) => {
            const criteria = list.criteria.find(c => c.name === criteriaName);
            const weight = criteria.weight ?? 1;
            if (criteria && criteria.type) {
                total += this.calculateValuePoints(criteria.type, criteria.values, vals) * weight;
            }
        });
        return total;
    }

    private calculateValuePoints(criteriaType: CriteriaType, criteriaValues: Array<string>, selectedValues: Array<string>): number {
        switch (criteriaType) {
            case 'worst-to-best':
                return this.getWorstToBestPoints(criteriaValues, selectedValues);
            case 'yes-no':
                return (selectedValues.includes('yes')) ? 1 : 0;
            case 'positives':
                return selectedValues.length;
            case 'negatives':
                return -(selectedValues.length);
        }
    }

    private getWorstToBestPoints(allValues: Array<string>, selected: Array<string>): number {
        let total = 0;
        for (var i=0; i<selected.length; i++) {
            const val = selected[i];
            const index = allValues.findIndex(v => v === val);
            total += index + 1;
        }
        return total;
    }
}

export const rankingCalculator = new RankingCalculator();