import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AccountFlowsTabComponent } from "./account-flows-tab.component";
import { TileBaseWidgetComponent } from "src/app/dataset-view/additional-components/flows-component/components/tile-base-widget/tile-base-widget.component";
import { FlowsTableComponent } from "src/app/dataset-view/additional-components/flows-component/components/flows-table/flows-table.component";
import { PaginationComponent } from "src/app/components/pagination-component/pagination.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { ToastrModule } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";

describe("AccountFlowsTabComponent", () => {
    let component: AccountFlowsTabComponent;
    let fixture: ComponentFixture<AccountFlowsTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, ToastrModule.forRoot()],
            declarations: [AccountFlowsTabComponent, TileBaseWidgetComponent, FlowsTableComponent, PaginationComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return "1";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountFlowsTabComponent);
        component = fixture.componentInstance;
        component.accountName = "mockAccountName";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
