import { NavigationService } from "src/app/services/navigation.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OverviewHistorySummaryHeaderComponent } from "./overview-history-summary-header.component";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { TEST_DATASET_NAME, mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { DisplayTimeModule } from "../display-time/display-time.module";
import { DisplayHashModule } from "../display-hash/dispaly-hash.module";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ToastrModule } from "ngx-toastr";
import { RouterTestingModule } from "@angular/router/testing";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { MetadataBlockNavigationParams } from "src/app/interface/navigation.interface";
import AppValues from "src/app/common/app.values";

describe("OverviewHistorySummaryHeaderComponent", () => {
    let component: OverviewHistorySummaryHeaderComponent;
    let fixture: ComponentFixture<OverviewHistorySummaryHeaderComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OverviewHistorySummaryHeaderComponent],
            imports: [
                DisplayTimeModule,
                DisplayHashModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                RouterTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewHistorySummaryHeaderComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        (component.metadataBlockFragment = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment),
            (component.numBlocksTotal = 3);
        component.datasetName = TEST_DATASET_NAME;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should navigate to metadata block", () => {
        if (!component.metadataBlockFragment) {
            fail("unexpected state");
            return;
        }

        const navigateToMetadataBlockSpy = spyOn(navigationService, "navigateToMetadataBlock");
        const params: MetadataBlockNavigationParams = {
            accountName: component.metadataBlockFragment.author.accountName,
            datasetName: component.datasetName,
            blockHash: component.metadataBlockFragment.blockHash,
        };

        emitClickOnElementByDataTestId(fixture, "navigate-to-metadata-block");
        fixture.detectChanges();

        expect(navigateToMetadataBlockSpy).toHaveBeenCalledWith(params);
    });

    it("should check default values", () => {
        component.metadataBlockFragment = undefined;

        fixture.detectChanges();

        expect(component.descriptionForMetadataBlock).toBe("");
        expect(component.authorInfo).toEqual({
            id: "",
            accountName: AppValues.DEFAULT_USER_DISPLAY_NAME,
            avatarUrl: AppValues.DEFAULT_AVATAR_URL,
        });
        expect(component.systemTime).toBe("");
    });
});
