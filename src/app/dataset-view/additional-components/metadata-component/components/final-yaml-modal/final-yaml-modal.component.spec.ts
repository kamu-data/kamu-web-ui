import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ApolloModule } from "apollo-angular";
import { FinalYamlModalComponent } from "./final-yaml-modal.component";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";

const testDatasetInfo: DatasetInfo = {
    accountName: "testAccountName",
    datasetName: "testDatasetName",
};

describe("FinalYamlModalComponent", () => {
    let component: FinalYamlModalComponent;
    let fixture: ComponentFixture<FinalYamlModalComponent>;
    let datasetCommitService: DatasetCommitService;
    let activeModal: NgbActiveModal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinalYamlModalComponent],
            providers: [NgbActiveModal],
            imports: [
                ApolloModule,
                FormsModule,
                MonacoEditorModule.forRoot(),
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FinalYamlModalComponent);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        activeModal = TestBed.inject(NgbActiveModal);
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
            datasetCommitService,
            "commitEventToDataset",
        ).and.returnValue(of());
        const closeModalSpy = spyOn(activeModal, "close");

        emitClickOnElementByDataTestId(fixture, "save-event");

        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
        expect(closeModalSpy).toHaveBeenCalledTimes(1);
    });
});
