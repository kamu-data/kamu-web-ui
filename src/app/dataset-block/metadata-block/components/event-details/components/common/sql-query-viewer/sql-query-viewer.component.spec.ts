import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SqlQueryViewerComponent } from "./sql-query-viewer.component";

describe("SqlQueryViewerComponent", () => {
    let component: SqlQueryViewerComponent;
    let fixture: ComponentFixture<SqlQueryViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SqlQueryViewerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SqlQueryViewerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
