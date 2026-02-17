/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";

import { ReturnToCliComponent } from "src/app/auth/login/return-to-cli/return-to-cli.component";

describe("ReturnToCliComponent", () => {
    let component: ReturnToCliComponent;
    let fixture: ComponentFixture<ReturnToCliComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReturnToCliComponent],
            providers: [Apollo],
        }).compileComponents();

        fixture = TestBed.createComponent(ReturnToCliComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
