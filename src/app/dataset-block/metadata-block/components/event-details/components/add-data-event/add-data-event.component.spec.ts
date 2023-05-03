import { ToastrModule } from "ngx-toastr";
import { ApolloModule } from "apollo-angular";
import { SizePropertyComponent } from "./../common/size-property/size-property.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockAddData } from "../../mock.events";
import { AddDataEventComponent } from "./add-data-event.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { snapshotParamMapMock } from "src/app/common/base-test.helpers.spec";

describe("AddDataEventComponent", () => {
    let component: AddDataEventComponent;
    let fixture: ComponentFixture<AddDataEventComponent>;

    const mockSimpleChanges = {
        event: {
            previousValue: undefined,
            currentValue: undefined,
            firstChange: false,
            isFirstChange: () => true,
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AddDataEventComponent,
                SizePropertyComponent,
                OffsetIntervalPropertyComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            providers: [snapshotParamMapMock],
            imports: [
                DisplaySizeModule,
                ApolloModule,
                MatIconModule,
                NgbTooltipModule,
                ToastrModule.forRoot(),
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
        })
            .overrideComponent(AddDataEventComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(AddDataEventComponent);
        component = fixture.componentInstance;
        component.event = mockAddData;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check onChanges hook call", () => {
        const spyNgOnChanges = spyOn(
            component,
            "ngOnChanges",
        ).and.callThrough();
        fixture.detectChanges();
        component.ngOnChanges(mockSimpleChanges);
        expect(spyNgOnChanges).toHaveBeenCalledTimes(1);
    });
});
