import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ReproducedResultSectionComponent } from "./reproduced-result-section.component";
import { DynamicTableModule } from "src/app/components/dynamic-table/dynamic-table.module";
import { mockQueryExplainerOutput } from "../../query-explainer.mocks";

describe("ReproducedResultSectionComponent", () => {
    let component: ReproducedResultSectionComponent;
    let fixture: ComponentFixture<ReproducedResultSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ReproducedResultSectionComponent],
            imports: [DynamicTableModule],
        });
        fixture = TestBed.createComponent(ReproducedResultSectionComponent);
        component = fixture.componentInstance;
        component.output = mockQueryExplainerOutput;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
