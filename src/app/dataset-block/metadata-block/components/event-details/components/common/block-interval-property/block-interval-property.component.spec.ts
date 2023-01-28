import { ApolloTestingModule } from "apollo-angular/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlockIntervalPropertyComponent } from "./block-interval-property.component";

describe("BlockIntervalPropertyComponent", () => {
    let component: BlockIntervalPropertyComponent;
    let fixture: ComponentFixture<BlockIntervalPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BlockIntervalPropertyComponent],
            imports: [ApolloTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(BlockIntervalPropertyComponent);
        component = fixture.componentInstance;
        component.data = {
            block: { start: "0", end: "10" },
            datasetId: "testId",
        };

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
