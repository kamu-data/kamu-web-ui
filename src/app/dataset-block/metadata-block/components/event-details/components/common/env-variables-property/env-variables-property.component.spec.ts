import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EnvVariablesPropertyComponent } from "./env-variables-property.component";
import { DynamicTableComponent } from "src/app/components/dynamic-table/dynamic-table.component";
import { MatTableModule } from "@angular/material/table";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("EnvVariablesPropertyComponent", () => {
    let component: EnvVariablesPropertyComponent;
    let fixture: ComponentFixture<EnvVariablesPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnvVariablesPropertyComponent, DynamicTableComponent],
            imports: [MatTableModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EnvVariablesPropertyComponent);
        component = fixture.componentInstance;
        component.data = [
            { name: "testName1", value: null },
            { name: "testName2", value: "testValue" },
        ];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
