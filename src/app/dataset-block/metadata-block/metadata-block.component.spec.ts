/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { MetadataBlockComponent } from "./metadata-block.component";
import { BlockNavigationComponent } from "./components/block-navigation/block-navigation.component";
import { MatIconModule } from "@angular/material/icon";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FormsModule } from "@angular/forms";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { BlockHeaderComponent } from "./components/block-header/block-header.component";
import { DatasetViewMenuComponent } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header.component";
import { SearchAdditionalButtonsComponent } from "src/app/common/components/search-additional-buttons/search-additional-buttons.component";
import { SearchAdditionalButtonsNavComponent } from "src/app/common/components/search-additional-buttons/search-additional-buttons-nav.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatTabsModule } from "@angular/material/tabs";
import { YamlViewSectionComponent } from "./components/yaml-view-section/yaml-view-section.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { DataAccessPanelModule } from "src/app/data-access-panel/data-access-panel.module";
import { DatasetVisibilityModule } from "src/app/common/components/dataset-visibility/dataset-visibility.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { FeatureFlagModule } from "src/app/common/directives/feature-flag.module";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { DisplayHashModule } from "src/app/common/components/display-hash/display-hash.module";
import { ToastrModule } from "ngx-toastr";
import { DisplayTimeModule } from "src/app/common/components/display-time/display-time.module";
import { BlockRowDataModule } from "src/app/common/components/block-row-data/block-row-data.module";
import { MatDividerModule } from "@angular/material/divider";
import { HighlightModule } from "ngx-highlightjs";

describe("MetadataBlockComponent", () => {
    let component: MetadataBlockComponent;
    let fixture: ComponentFixture<MetadataBlockComponent>;

    const blockFragment = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
        .blockByHash as MetadataBlockFragment;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                MetadataBlockComponent,
                BlockNavigationComponent,
                EventDetailsComponent,
                BlockHeaderComponent,
                DatasetViewMenuComponent,
                DatasetViewHeaderComponent,
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
                YamlViewSectionComponent,
            ],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                RouterTestingModule,
                MatIconModule,
                NgMultiSelectDropDownModule,
                FormsModule,
                MatButtonToggleModule,
                MatMenuModule,
                HttpClientTestingModule,
                MatTabsModule,
                BrowserAnimationsModule,
                DataAccessPanelModule,
                RouterModule,
                DatasetVisibilityModule,
                FeatureFlagModule,
                DisplayHashModule,
                ToastrModule.forRoot(),
                DisplayTimeModule,
                BlockRowDataModule,
                MatDividerModule,
                HighlightModule,
            ],
            providers: [
                DatasetApi,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({
                            accountName: "accountName",
                            datasetName: "datasetName",
                            blockHash: "ewrwe213123",
                        }),
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

        registerMatSvgIcons();

        fixture = TestBed.createComponent(MetadataBlockComponent);
        component = fixture.componentInstance;
        (component.metadata = {
            block: blockFragment,
            blockAsYaml: "test yaml",
            downstreamsCount: 0,
        }),
            fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
