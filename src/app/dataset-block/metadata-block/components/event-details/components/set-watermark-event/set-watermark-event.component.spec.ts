import { mockSetWatermark } from "./../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetWatermarkEventComponent } from "./set-watermark-event.component";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("SetWatermarkEventComponent", () => {
    let component: SetWatermarkEventComponent;
    let fixture: ComponentFixture<SetWatermarkEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetWatermarkEventComponent, BlockRowDataComponent, TooltipIconComponent],
            imports: [DisplayTimeModule, MatIconModule, NgbTooltipModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SetWatermarkEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetWatermark;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
