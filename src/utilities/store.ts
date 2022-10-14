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

class StorageHelper {
    get<T>(key: string, defaultVal: T): T {
        const store = localStorage.getItem(key);
        return (store) ? JSON.parse(store, reviver) : defaultVal;
    }

    set(key: string, val: any): void {
        localStorage.setItem(key, JSON.stringify(val, replacer));
    }
}

export const store = new StorageHelper();