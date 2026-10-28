/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/* istanbul ignore file */

import { ComponentHarness } from "@angular/cdk/testing";

import { MaybeNull } from "@interface/app.types";

export class SourceEventCommonDataHarness extends ComponentHarness {
    public static readonly hostSelector = "app-source-event-common-data";

    private static readonly CSV_HEADER_TEST_ID = "read-csv-header";
    private static readonly CSV_INFER_SCHEMA_TEST_ID = "read-csv-infer-schema";
    private static readonly ND_JSON_ENCODING_TEST_ID = "read-nd-json-encoding";

    private readonly locatorCsvHeader = this.locatorFor(
        `[data-test-id="${SourceEventCommonDataHarness.CSV_HEADER_TEST_ID}"]`,
    );
    private readonly locatorCsvInferSchema = this.locatorFor(
        `[data-test-id="${SourceEventCommonDataHarness.CSV_INFER_SCHEMA_TEST_ID}"]`,
    );
    private readonly locatorNdJsonEncoding = this.locatorForOptional(
        `[data-test-id="${SourceEventCommonDataHarness.ND_JSON_ENCODING_TEST_ID}"]`,
    );

    public async getCsvHeader(): Promise<string> {
        const element = await this.locatorCsvHeader();
        return element.text();
    }

    public async getCsvInferSchema(): Promise<string> {
        const element = await this.locatorCsvInferSchema();
        return element.text();
    }

    public async getNdJsonEncoding(): Promise<MaybeNull<string>> {
        const element = await this.locatorNdJsonEncoding();
        return element ? element.text() : null;
    }
}
