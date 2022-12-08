import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import { DatasetApi } from "src/app/api/dataset.api";
import { routerMock } from "src/app/common/base-test.helpers.spec";

import { MetadataBlockComponent } from "./metadata-block.component";

describe("MetadataBlockComponent", () => {
    let component: MetadataBlockComponent;
    let fixture: ComponentFixture<MetadataBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MetadataBlockComponent],
            imports: [ApolloModule, ApolloTestingModule, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
