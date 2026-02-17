/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";

import { AuthApi } from "@api/auth.api";

import { LoginMethodsService } from "src/app/auth/login-methods.service";

describe("LoginMethodsService", () => {
    let service: LoginMethodsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ApolloTestingModule],
            providers: [AuthApi, Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });

        service = TestBed.inject(LoginMethodsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
