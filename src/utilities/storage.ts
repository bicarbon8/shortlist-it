import packagejson from "../../package.json";
import { Shortlist } from "../types/shortlist";
import { ShortlistItState } from "../types/shortlist-it-state";
import { StorageContainer } from "./storage-container";

function replacer(key: string, value: any) {
    if(value instanceof Map) {
      return {
        dataType: 'Map',
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    } else {
      return value;
    }
}

function reviver(key: string, value: any) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
}

export class Storage {
    private name: string;
    private version: string;
    
    constructor() {
        this.name = packagejson.name;
        this.version = packagejson.version;
    }

    /**
     * the `localStorage` key used to get / set the `StorageContainer`
     */
    get key(): string {
        return this.name;
    }

    /**
     * gets the data stored under the specified `key` within the `StorageContainer` in
     * `localStorage`
     * @param key the lookup key for the stored datatype
     * @param defaultVal a value to return if no data is found
     * @returns the value stored under the specified key or `defaultVal` if none found
     */
    get<T extends ShortlistItState, Tval extends T[keyof T]>(key: keyof T, defaultVal: Tval): Tval {
        return this.getContainer().data.get(key.toString()) ?? defaultVal;
    }

    /**
     * stores the specified `val` under the passed in `key` within the `StorageContainer` in
     * `localStorage`
     * @param key the lookup key for the stored datatype
     * @param val the value to store
     */
    set<T extends ShortlistItState, Tval extends T[keyof T]>(key: keyof T, val: Tval): void {
        const container = this.getContainer();
        container.data.set(key.toString(), val);
        this.setContainer(container);
    }

    /**
     * removes any stored data under the specified `key` in the `StorageContainer` in
     * `localStorage`
     * @param key the lookup key for the stored datatype
     */
    delete<T extends ShortlistItState>(key: keyof T): void {
        const container = this.getContainer();
        container.data.delete(key.toString());
        this.setContainer(container);
    }

    import(text: string): void {
        const container = this.getContainer();
        if (container) {
            const imported = JSON.parse(text, reviver);
            this.setContainer(imported);
        }
    }

    export(): string {
        const container = this.getContainer();
        if (container) {
            return JSON.stringify(container, replacer);
        }
    }

    private getContainer(): StorageContainer {
        let container: StorageContainer;
        try {
            const containers: Array<StorageContainer> = JSON.parse(localStorage.getItem(this.key), reviver);
            if (containers?.length) {
                container = containers.find(c => c.version === this.version);
                if (!container) {
                    container = containers.find(c => c.version.match(/^(1\.)([0-9]+\.)([0-9]+)$/));
                    if (container) {
                        (container.data.get('lists') as Array<Shortlist>).forEach(l => l.criteria.forEach(c => c.weight ??= 1));
                    }
                }
            }
        } catch (e) {
            console.error(e);
        }
        if (!container) {
            container = { version: this.version, data: new Map<string, any>() }
        }

        return container;
    }

    private setContainer(container: StorageContainer): void {
        if (container) {
            let containers: Array<StorageContainer> = new Array<StorageContainer>();
            try {
                const storedStr = localStorage.getItem(this.key);
                if (storedStr) {
                    containers = JSON.parse(storedStr, reviver);
                }
            } catch (e) {
                console.error(e);
            }
            try {
                const index = containers.findIndex(c => c.version === this.version);
                if (index >= 0) {
                    containers.splice(index, 1);
                }
                containers.push(container);
                localStorage.setItem(this.key, JSON.stringify(containers, replacer));
            } catch (e) {
                console.error(e);
            }
        }
    }
}

export const store = new Storage();