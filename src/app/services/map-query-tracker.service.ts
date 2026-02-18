/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { IDBPDatabase, openDB } from "idb";

import { promiseWithCatch } from "@common/helpers/app.helpers";

export interface DatasetEntry {
    query: string;
    timestamp: number;
}

@Injectable({
    providedIn: "root",
})
export class MapQueryTrackerService {
    private dbPromise: Promise<IDBPDatabase>;
    private readonly DB_NAME = "DatasetMicroDB";
    private readonly STORE_NAME = "queries";
    private readonly ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000; // 1 year in ms

    public constructor() {
        this.dbPromise = openDB(this.DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains("queries")) {
                    db.createObjectStore("queries");
                }
            },
        });

        promiseWithCatch(this.dbPromise.then(() => this.cleanOldEntries()));
    }

    /* istanbul ignore next */
    private async cleanOldEntries(): Promise<void> {
        const db = await this.dbPromise;
        const now = Date.now();
        const tx = db.transaction(this.STORE_NAME, "readwrite");
        let cursor = await tx.store.openCursor();

        while (cursor) {
            const entryTime = Number((cursor.value as DatasetEntry).timestamp);
            const diff = now - entryTime;
            if (diff > this.ONE_YEAR_MS) {
                await cursor.delete();
            }
            cursor = await cursor.continue();
        }

        await tx.done;
    }

    /* istanbul ignore next */
    public async hasQuery(alias: string): Promise<boolean> {
        const db = await this.dbPromise;
        const key = await db.getKey(this.STORE_NAME, alias);
        return key !== undefined;
    }

    /* istanbul ignore next */
    public async saveQuery(alias: string, query: string): Promise<void> {
        const db = await this.dbPromise;
        const entry: DatasetEntry = {
            query: query,
            timestamp: Date.now(),
        };
        await db.put(this.STORE_NAME, entry, alias);
    }

    /* istanbul ignore next */
    public async getQuery(alias: string): Promise<DatasetEntry | undefined> {
        const db = await this.dbPromise;
        return db.get(this.STORE_NAME, alias) as Promise<DatasetEntry | undefined>;
    }
}
