import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetListComponent } from "./dataset-list.component";
import { mockDatasetListItem } from "src/app/api/mock/dataset.mock";

describe("DatasetListComponent", () => {
    let component: DatasetListComponent;
    let fixture: ComponentFixture<DatasetListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetListComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check select dataset", () => {
        const selectDatasetEmitSpy = spyOn(component.selectDatasetEmit, "emit");
        component.onSelectDataset(mockDatasetListItem);
        expect(selectDatasetEmitSpy).toHaveBeenCalledWith({
            datasetName: mockDatasetListItem.name,
            accountName: mockDatasetListItem.owner.accountName,
        });
    });
});
