import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MetadataBlockComponent } from "./metadata-block.component";

describe("MetadataBlockComponent", () => {
    let component: MetadataBlockComponent;
    let fixture: ComponentFixture<MetadataBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MetadataBlockComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(MetadataBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
