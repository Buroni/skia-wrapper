type ITwoKeyMap<TKey1 = any, TKey2 = any, TValue = any> = Map<TKey1, Map<TKey2, TValue>>;

export class TwoKeyMap<TKey1 = any, TKey2 = any, TValue = any> {
    private map: ITwoKeyMap<TKey1, TKey2, TValue> = new Map();

    set(k1: TKey1, k2: TKey2, value: TValue) {
        if (!this.map.has(k1)) {
            this.map.set(k1, new Map());
        }
        this.map.get(k1)?.set(k2, value);
    }

    get(k1: TKey1, k2: TKey2) {
        return this.map.get(k1)?.get(k2);
    }

    has(k1: TKey1, k2: TKey2) {
        return this.map.get(k1)?.has(k2) ?? false;
    }

    delete(k1: TKey1, k2: TKey2) {
        const inner = this.map.get(k1);
        if (!inner) return false;
        const deleted = inner.delete(k2);
        if (inner.size === 0) {
            this.map.delete(k1);
        }
        return deleted;
    }
}