/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CardsPropertyComponent } from "./cards-property.component";
import { ActivatedRoute } from "@angular/router";

describe("CardsPropertyComponent", () => {
    let component: CardsPropertyComponent;
    let fixture: ComponentFixture<CardsPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CardsPropertyComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CardsPropertyComponent);
        component = fixture.componentInstance;
        component.data = ["id", "name", "type"];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
