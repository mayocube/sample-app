import { openDB } from 'idb'
const DB_NAME = 'myAppDB';
const STORE_NAME = 'dataStore';
const dbVersion = 1;
export const initIdb = async () => {

}

export async function initDB() {
    return openDB(DB_NAME, dbVersion, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                store.createIndex('timestamp', 'timestamp');
            }
        },
    });
}
export async function getData() {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return store.getAll();
}

export async function saveData(data) {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    data.forEach((item) => {
        store.put(item);
    });

    await tx.done;
}

