/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { LoginMethodsService } from "./login-methods.service";
import { AuthApi } from "../api/auth.api";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("LoginMethodsService", () => {
    let service: LoginMethodsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo],
            imports: [ApolloTestingModule, HttpClientTestingModule],
        });

        service = TestBed.inject(LoginMethodsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
