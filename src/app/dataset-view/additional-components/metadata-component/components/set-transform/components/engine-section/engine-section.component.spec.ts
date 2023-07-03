import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EngineSectionComponent } from "./engine-section.component";

describe("EngineSectionComponent", () => {
    let component: EngineSectionComponent;
    let fixture: ComponentFixture<EngineSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EngineSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
