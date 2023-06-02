import packagejson from "../../package.json";
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

export class Storage<T extends {}> {
    private name: string;
    private version: string;
    
    constructor() {
        this.name = packagejson.name;
        this.version = packagejson.version;

        this.migrateLegacyContainer();
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
    get<T extends {}>(key: keyof T, defaultVal: T[keyof T]): T[keyof T] {
        return this.getContainer().data.get(key.toString()) ?? defaultVal;
    }

    /**
     * stores the specified `val` under the passed in `key` within the `StorageContainer` in
     * `localStorage`
     * @param key the lookup key for the stored datatype
     * @param val the value to store
     */
    set<T extends {}>(key: keyof T, val: T[keyof T]): void {
        const container = this.getContainer();
        container.data.set(key.toString(), val);
        this.setContainer(container);
    }

    /**
     * removes any stored data under the specified `key` in the `StorageContainer` in
     * `localStorage`
     * @param key the lookup key for the stored datatype
     */
    delete<T extends {}>(key: keyof T): void {
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
                // TODO: handle fallback and/or migration logic in the future
            }
        } catch (e) {
            console.error(e);
        }
        if (!container) {
            container = { version: this.version, data: new Map<string, any>() }
        }
        // TODO: handle migration of old version data

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

    /**
     * TODO: remove in next update
     * @returns `StorageContainer`
     */
    private migrateLegacyContainer(): void {
        const legacyKey = `${this.name}-${this.version}`;
        let container: StorageContainer;

        try {
            container = JSON.parse(localStorage.getItem(legacyKey), reviver);
            if (container) {
                localStorage.removeItem(legacyKey);
                this.setContainer(container);
            }
        } catch (e) {
            // ignore
        }
    }
}

export const store = new Storage<ShortlistItState>();