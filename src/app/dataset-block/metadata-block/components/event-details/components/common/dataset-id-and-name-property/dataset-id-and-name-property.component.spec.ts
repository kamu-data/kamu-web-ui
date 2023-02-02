import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetIdAndNamePropertyComponent } from "./dataset-id-and-name-property.component";

describe("DatasetIdAndNamePropertyComponent", () => {
    let component: DatasetIdAndNamePropertyComponent;
    let fixture: ComponentFixture<DatasetIdAndNamePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetIdAndNamePropertyComponent],
            imports: [ApolloTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetIdAndNamePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
