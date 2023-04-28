import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ApolloModule } from "apollo-angular";
import { FinalYamlModalComponent } from "./final-yaml-modal.component";
import { AppDatasetCreateService } from "src/app/dataset-create/dataset-create.service";
import { emitClickOnElement } from "src/app/common/base-test.helpers.spec";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Observable } from "rxjs";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor";

const testDatasetInfo: DatasetInfo = {
    accountName: "testAccountName",
    datasetName: "testDatasetName",
};

describe("FinalYamlModalComponent", () => {
    let component: FinalYamlModalComponent;
    let fixture: ComponentFixture<FinalYamlModalComponent>;
    let createDatasetService: AppDatasetCreateService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinalYamlModalComponent],
            providers: [NgbActiveModal],
            imports: [ApolloModule, FormsModule, MonacoEditorModule.forRoot()],
        }).compileComponents();

        fixture = TestBed.createComponent(FinalYamlModalComponent);
        createDatasetService = TestBed.inject(AppDatasetCreateService);
        component = fixture.componentInstance;
        component.yamlTemplate = "test yaml";
        component.datasetInfo = testDatasetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should save event", () => {
        const commitEventToDatasetSpy = spyOn(
            createDatasetService,
            "commitEventToDataset",
        ).and.returnValue(new Observable());
        emitClickOnElement(fixture, '[data-test-id="save-event"]');
        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
    });
});
