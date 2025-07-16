/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReturnToCliComponent } from "./return-to-cli.component";
import { Apollo } from "apollo-angular";

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
