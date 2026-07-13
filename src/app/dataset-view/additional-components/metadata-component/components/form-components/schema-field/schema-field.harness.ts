/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { EditSchemaTableHarness } from "@common/components/edit-schema-table/edit-schema-table.harness";

export class SchemaFieldHarness extends ComponentHarness {
    public static readonly hostSelector = "app-schema-field";

    private readonly locatorRootTable = this.locatorFor(EditSchemaTableHarness);

    /** Returns the harness for the root-level edit-schema-table. */
    public async rootTable(): Promise<EditSchemaTableHarness> {
        return this.locatorRootTable();
    }

    /** Convenience: add a field at the root level. */
    public async addField(name: string): Promise<void> {
        const table = await this.rootTable();
        await table.addField(name);
    }

    /** Convenience: return all visible root-level field names. */
    public async getFieldNames(): Promise<string[]> {
        const table = await this.rootTable();
        return table.getFieldNames();
    }
}
