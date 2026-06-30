/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from "@angular/cdk/testing";

interface EditSchemaTableHarnessFilters extends BaseHarnessFilters {
    tablePath?: string;
}

export class EditSchemaTableHarness extends ComponentHarness {
    public static readonly hostSelector = "app-edit-schema-table";

    // Set by withPath(); falls back to "root" which is the default tablePath in the component.
    private _tablePath: string = "root";

    /**
     * Returns a predicate that matches the table whose inner wrapper carries the given tablePath
     * as its data-test-id. Use this to get nested tables:
     *   `loader.getHarness(EditSchemaTableHarness.withPath("root.address"))`
     */
    public static withPath(path: string): HarnessPredicate<EditSchemaTableHarness> {
        return new HarnessPredicate(EditSchemaTableHarness, {} as EditSchemaTableHarnessFilters).addOption(
            "tablePath",
            path,
            async (harness, tablePath) => {
                harness._tablePath = tablePath;
                const el = await harness.locatorForOptional(`[data-test-id="${tablePath}"]`)();
                return el !== null;
            },
        );
    }

    // ---------------------------------------------------------------------------
    // Selector helpers (synchronous — _tablePath is always set before use)
    // ---------------------------------------------------------------------------

    private sel(verb: string, nameOrIndex?: string | number): string {
        if (nameOrIndex === undefined) {
            return `[data-test-id="${this._tablePath}:${verb}"]`;
        }
        const suffix = typeof nameOrIndex === "number" ? `#${nameOrIndex}` : nameOrIndex;
        return `[data-test-id="${this._tablePath}:${verb}:${suffix}"]`;
    }

    // ---------------------------------------------------------------------------
    // Row reads
    // ---------------------------------------------------------------------------

    /** Returns the visible field name labels in display order. */
    public async getFieldNames(): Promise<string[]> {
        const spans = await this.locatorForAll(`[data-test-id^="${this._tablePath}:field-name:"]`)();
        const names: string[] = [];
        for (const span of spans) {
            const testId = await span.getAttribute("data-test-id");
            if (testId) {
                names.push(testId.split(":field-name:")[1] ?? "");
            }
        }
        return names;
    }

    /** Returns the number of data rows currently rendered (including any provisional add row). */
    public async getRowCount(): Promise<number> {
        const rows = await this.locatorForAll(`[data-test-id^="${this._tablePath}:row:"]`)();
        return rows.length;
    }

    // ---------------------------------------------------------------------------
    // Actions — per-field
    // ---------------------------------------------------------------------------

    /** Clicks the edit (pencil) button for a field identified by name. */
    public async editField(name: string): Promise<void> {
        await (await this.locatorFor(this.sel("edit-field", name))()).click();
    }

    /** Clicks the edit button for a field identified by row index (0-based). */
    public async editFieldByIndex(index: number): Promise<void> {
        await (await this.locatorFor(this.sel("edit-field", index))()).click();
    }

    /** Clicks the delete button for a field identified by name. */
    public async deleteField(name: string): Promise<void> {
        await (await this.locatorFor(this.sel("delete-field", name))()).click();
    }

    /** Clicks the delete button for a field identified by row index (0-based). */
    public async deleteFieldByIndex(index: number): Promise<void> {
        await (await this.locatorFor(this.sel("delete-field", index))()).click();
    }

    // ---------------------------------------------------------------------------
    // Actions — editing state
    // ---------------------------------------------------------------------------

    /** Clicks the "Add field" button to open a new provisional row. */
    public async startAddField(): Promise<void> {
        await (await this.locatorFor(this.sel("add-field"))()).click();
    }

    /** Sets the value of the name input (only present while a row is being edited). */
    public async setNameInput(value: string): Promise<void> {
        const input = await this.locatorFor(this.sel("name-input"))();
        await input.clear();
        await input.sendKeys(value);
    }

    /** Clicks the save (check) button. */
    public async save(): Promise<void> {
        await (await this.locatorFor(this.sel("save-field"))()).click();
    }

    /** Clicks the cancel (×) button. */
    public async cancel(): Promise<void> {
        await (await this.locatorFor(this.sel("cancel-edit"))()).click();
    }

    // ---------------------------------------------------------------------------
    // Composite helpers
    // ---------------------------------------------------------------------------

    /**
     * Full add-field flow: startAddField → setNameInput → save.
     * The new row defaults to String type; set the type at the contract level if needed.
     */
    public async addField(name: string): Promise<void> {
        await this.startAddField();
        await this.setNameInput(name);
        await this.save();
    }

    /** Full edit-name flow: editField → setNameInput → save. */
    public async renameField(currentName: string, newName: string): Promise<void> {
        await this.editField(currentName);
        await this.setNameInput(newName);
        await this.save();
    }

    // ---------------------------------------------------------------------------
    // Nested table navigation
    // ---------------------------------------------------------------------------

    /**
     * Returns the harness for the nested table rendered inside the Struct field with the given name.
     * Enables multi-level traversal: `root → address → geo`.
     */
    public async nestedTable(fieldName: string): Promise<EditSchemaTableHarness> {
        const nestedPath = `${this._tablePath}.${fieldName}`;
        const nested = await this.locatorForOptional(EditSchemaTableHarness.withPath(nestedPath))();
        if (!nested) {
            throw new Error(`EditSchemaTableHarness: nested table "${nestedPath}" not found — is the field a Struct?`);
        }
        return nested;
    }

    // ---------------------------------------------------------------------------
    // Validation icon accessors
    // ---------------------------------------------------------------------------

    /** Returns true if the error icon (close/red) is present next to the named field. */
    public async hasErrorIcon(fieldName: string): Promise<boolean> {
        const icon = await this.locatorForOptional(`${this.sel("field-name", fieldName)} mat-icon.text-danger`)();
        return icon !== null;
    }

    /** Returns the matTooltip text on the error icon, or null if absent. */
    public async errorTooltipFor(fieldName: string): Promise<string | null> {
        const icon = await this.locatorForOptional(`${this.sel("field-name", fieldName)} mat-icon.text-danger`)();
        return icon ? icon.getAttribute("ng-reflect-message") : null;
    }

    /** Returns true if the warning icon (warning/yellow) is present next to the named field. */
    public async hasWarningIcon(fieldName: string): Promise<boolean> {
        const icon = await this.locatorForOptional(`${this.sel("field-name", fieldName)} mat-icon.text-warning`)();
        return icon !== null;
    }

    /** Returns the matTooltip text on the warning icon, or null if absent. */
    public async warningTooltipFor(fieldName: string): Promise<string | null> {
        const icon = await this.locatorForOptional(`${this.sel("field-name", fieldName)} mat-icon.text-warning`)();
        return icon ? icon.getAttribute("ng-reflect-message") : null;
    }
}
