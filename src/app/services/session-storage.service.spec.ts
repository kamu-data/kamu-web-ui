/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { SessionStorageService } from "./session-storage.service";

describe("SessionStorageService", () => {
    let service: SessionStorageService;
    const MOCK_SQL_CODE = "select * from 'accounts.tokens.portfolio.usd'";

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SessionStorageService);
        service.reset();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should be check set state for side panel", () => {
        expect(service.isSidePanelVisible).toBeFalse();

        service.setSidePanelVisible(true);
        expect(service.isSidePanelVisible).toBeTrue();

        service.setSidePanelVisible(false);
        expect(service.isSidePanelVisible).toBeFalse();
    });

    it("should be check set state for dataset sql code", () => {
        service.setDatasetSqlCode(MOCK_SQL_CODE);
        expect(service.datasetSqlCode).toEqual(MOCK_SQL_CODE);
    });

    it("should be check state after removing for dataset sql code", () => {
        service.setDatasetSqlCode(MOCK_SQL_CODE);
        expect(service.datasetSqlCode).toEqual(MOCK_SQL_CODE);
        service.removeDatasetSqlCode();
        expect(service.datasetSqlCode).toEqual("");
    });
});
