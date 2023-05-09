import { CardsPropertyComponent } from "./../common/cards-property/cards-property.component";
import { mockSetInfo } from "./../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetInfoEventComponent } from "./set-info-event.component";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("SetInfoEventComponent", () => {
    let component: SetInfoEventComponent;
    let fixture: ComponentFixture<SetInfoEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetInfoEventComponent,
                CardsPropertyComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            imports: [MatIconModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SetInfoEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
