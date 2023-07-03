import { ComponentFixture, TestBed } from "@angular/core/testing";

import { QueriesSectionComponent } from "./queries-section.component";

describe("QueriesSectionComponent", () => {
    let component: QueriesSectionComponent;
    let fixture: ComponentFixture<QueriesSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [QueriesSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(QueriesSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
