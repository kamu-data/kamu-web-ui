import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetLicense } from "../../mock.events";
import { SetLicenseEventComponent } from "./set-license-event.component";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LinkPropertyComponent } from "../common/link-property/link-property.component";

describe("SetLicenseEventComponent", () => {
    let component: SetLicenseEventComponent;
    let fixture: ComponentFixture<SetLicenseEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetLicenseEventComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
                LinkPropertyComponent,
            ],
            imports: [MatIconModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SetLicenseEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetLicense;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
