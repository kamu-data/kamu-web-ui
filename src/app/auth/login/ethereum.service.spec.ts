/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { Eip1193EthereumService } from "./ethereum.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { AuthApi } from "src/app/api/auth.api";
import { provideToastr } from "ngx-toastr";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("Eip1193EthereumService", () => {
    let service: Eip1193EthereumService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo, provideAnimations(), provideToastr()],
            imports: [ApolloTestingModule, HttpClientTestingModule],
        });
        service = TestBed.inject(Eip1193EthereumService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
