import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommitmentDataSectionComponent } from "./commitment-data-section.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { mockQueryExplainerResponse, mockVerifyQueryResponseSuccess } from "../../query-explainer.mocks";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";

describe("CommitmentDataSectionComponent", () => {
    let component: CommitmentDataSectionComponent;
    let fixture: ComponentFixture<CommitmentDataSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CommitmentDataSectionComponent],
            imports: [AngularSvgIconModule.forRoot(), HttpClientTestingModule],
        });

        fixture = TestBed.createComponent(CommitmentDataSectionComponent);
        component = fixture.componentInstance;
        component.commitmentData = {
            sqlQueryExplainerResponse: mockQueryExplainerResponse,
            sqlQueryVerify: mockVerifyQueryResponseSuccess,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check display commitment data", () => {
        fixture.detectChanges();
        const inputHashElem = findElementByDataTestId(fixture, "input-hash");
        expect(inputHashElem?.innerText.trim()).toEqual(mockQueryExplainerResponse.commitment.inputHash);

        const outputHashElem = findElementByDataTestId(fixture, "output-hash");
        expect(outputHashElem?.innerText.trim()).toEqual(mockQueryExplainerResponse.commitment.outputHash);

        const subQueriesHashElem = findElementByDataTestId(fixture, "sub-queries-hash");
        expect(subQueriesHashElem?.innerText.trim()).toEqual(mockQueryExplainerResponse.commitment.subQueriesHash);
    });
});