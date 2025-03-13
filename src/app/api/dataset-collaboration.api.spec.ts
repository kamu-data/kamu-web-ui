/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApolloTestingController, ApolloTestingModule } from "apollo-angular/testing";
import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { DatasetCollaborationApi } from "./dataset-collaboration.api";

describe("DatasetCollaborationApi", () => {
    let service: DatasetCollaborationApi;
    let controller: ApolloTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DatasetCollaborationApi, Apollo],
            imports: [ApolloTestingModule],
        });
        service = TestBed.inject(DatasetCollaborationApi);
        controller = TestBed.inject(ApolloTestingController);
    });

    afterEach(() => {
        controller.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
