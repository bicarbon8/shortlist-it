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

export class StorageHelper<T extends {}> {
    get<Tkey extends keyof T, Tval = T[Tkey]>(key: Tkey, defaultVal: Tval): Tval {
        const store = localStorage.getItem(key.toString());
        return (store) ? JSON.parse(store, reviver) : defaultVal;
    }
    set<Tkey extends keyof T, Tval = T[Tkey]>(key: Tkey, val: Tval): void {
        localStorage.setItem(key.toString(), JSON.stringify(val, replacer));
    }
    delete<Tkey extends keyof T>(key: Tkey): void {
        localStorage.removeItem(key.toString());
    }
}