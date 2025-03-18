/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsAccessTabComponent } from "./dataset-settings-access-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientModule } from "@angular/common/http";

describe("DatasetSettingsAccessTabComponent", () => {
    let component: DatasetSettingsAccessTabComponent;
    let fixture: ComponentFixture<DatasetSettingsAccessTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DatasetSettingsAccessTabComponent],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return 2;
                                    }
                                },
                            },
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
            imports: [ApolloTestingModule, ToastrModule.forRoot(), HttpClientModule, MatIconModule, RouterModule],
        });
        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsAccessTabComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
