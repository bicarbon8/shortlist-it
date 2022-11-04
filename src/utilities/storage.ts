import packagejson from "../../package.json";
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
    get<Tkey extends keyof T, Tval = T[Tkey]>(key: Tkey, defaultVal: Tval): Tval {
        return this.getContainer().data.get(key.toString()) ?? defaultVal;
    }

    /**
     * stores the specified `val` under the passed in `key` within the `StorageContainer` in
     * `localStorage`
     * @param key the lookup key for the stored datatype
     * @param val the value to store
     */
    set<Tkey extends keyof T, Tval = T[Tkey]>(key: Tkey, val: Tval): void {
        const container = this.getContainer();
        container.data.set(key.toString(), val);
        this.setContainer(container);
    }

    /**
     * removes any stored data under the specified `key` in the `StorageContainer` in
     * `localStorage`
     * @param key the lookup key for the stored datatype
     */
    delete<Tkey extends keyof T>(key: Tkey): void {
        const container = this.getContainer();
        container.data.delete(key.toString());
        this.setContainer(container);
    }

    import(text: string, overwrite: boolean = false): void {
        const container = this.getContainer();
        if (container) {
            const imported = JSON.parse(text, reviver);
            if (overwrite) {
                this.setContainer(imported);
            } else {
                const updated = {
                    ...container,
                    ...imported
                };
                this.setContainer(updated);
            }
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
            container = JSON.parse(localStorage.getItem(this.key), reviver);
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
            try {
                localStorage.setItem(this.key, JSON.stringify(container, replacer));
            } catch (e) {
                console.error(e);
            }
        }
    }
}