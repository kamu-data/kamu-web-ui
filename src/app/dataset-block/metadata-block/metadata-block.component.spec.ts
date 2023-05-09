import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { routerMock } from "src/app/common/base-test.helpers.spec";
import { MetadataBlockComponent } from "./metadata-block.component";
import { BlockNavigationComponent } from "./components/block-navigation/block-navigation.component";
import { MatIconModule } from "@angular/material/icon";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { FormsModule } from "@angular/forms";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { BlockHeaderComponent } from "./components/block-header/block-header.component";
import { DatasetViewMenuComponent } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu-component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header-component";
import { SearchAdditionalButtonsComponent } from "src/app/components/search-additional-buttons/search-additional-buttons.component";
import { SearchAdditionalButtonsNavComponent } from "src/app/components/search-additional-buttons/search-additional-buttons-nav.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatTabsModule } from "@angular/material/tabs";
import { YamlViewSectionComponent } from "./components/yaml-view-section/yaml-view-section.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("MetadataBlockComponent", () => {
    let component: MetadataBlockComponent;
    let fixture: ComponentFixture<MetadataBlockComponent>;

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
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                MatTabsModule,
                BrowserAnimationsModule,
            ],
            providers: [
                DatasetApi,
                {
                    provide: Router,
                    useValue: routerMock,
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({ blockHash: "ewrwe213123" }),
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

        fixture = TestBed.createComponent(MetadataBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
