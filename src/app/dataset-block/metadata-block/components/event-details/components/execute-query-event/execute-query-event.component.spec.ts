import { ExecuteQuery } from "./../../../../../../api/kamu.graphql.interface";
import { mockExecuteQuery } from "./../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ExecuteQueryEventComponent } from "./execute-query-event.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { ActivatedRoute } from "@angular/router";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { ToastrModule } from "ngx-toastr";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("ExecuteQueryEventComponent", () => {
    let component: ExecuteQueryEventComponent;
    let fixture: ComponentFixture<ExecuteQueryEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ExecuteQueryEventComponent,
                SizePropertyComponent,
                OffsetIntervalPropertyComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            imports: [
                ApolloTestingModule,
                DisplaySizeModule,
                MatIconModule,
                NgbTooltipModule,
                ToastrModule.forRoot(),
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
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

        fixture = TestBed.createComponent(ExecuteQueryEventComponent);
        component = fixture.componentInstance;
        component.event = mockExecuteQuery as ExecuteQuery;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
