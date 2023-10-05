import { openDB } from 'idb'
const DB_NAME = 'NMTasks';
const STORE_NAME = 'tasks';
const dbVersion = 1;
export async function initDB() {
    return openDB(DB_NAME, dbVersion, {
        upgrade(db) {
            console.log(db);
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: 'taskSid' });
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