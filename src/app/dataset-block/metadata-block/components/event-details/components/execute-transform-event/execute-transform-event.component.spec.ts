import { ExecuteTransform } from "../../../../../../api/kamu.graphql.interface";
import { mockExecuteTransform } from "../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ExecuteTransformEventComponent } from "./execute-transform-event.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { ToastrModule } from "ngx-toastr";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/base-test.helpers.spec";

describe("ExecuteTransformEventComponent", () => {
    let component: ExecuteTransformEventComponent;
    let fixture: ComponentFixture<ExecuteTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ExecuteTransformEventComponent,
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
                HttpClientTestingModule,
                SharedTestModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(ExecuteTransformEventComponent);
        component = fixture.componentInstance;
        component.event = mockExecuteTransform as ExecuteTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
