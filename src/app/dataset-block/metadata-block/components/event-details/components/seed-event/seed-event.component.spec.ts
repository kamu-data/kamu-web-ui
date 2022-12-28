import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSeed } from "../../mock.events";

import { SeedEventComponent } from "./seed-event.component";

describe("SeedEventComponent", () => {
    let component: SeedEventComponent;
    let fixture: ComponentFixture<SeedEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SeedEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SeedEventComponent);
        component = fixture.componentInstance;
        component.event = mockSeed;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
