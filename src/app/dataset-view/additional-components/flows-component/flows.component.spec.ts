import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsComponent } from "./flows.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { ToastrModule } from "ngx-toastr";
import { routerMock } from "src/app/common/base-test.helpers.spec";

describe("FlowsComponent", () => {
    let component: FlowsComponent;
    let fixture: ComponentFixture<FlowsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [
                Apollo,
                { provide: Router, useValue: routerMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "tab":
                                            return "flows";
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
            declarations: [FlowsComponent],
            imports: [ApolloTestingModule, ToastrModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowsComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
