import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { NavigationService } from "src/app/services/navigation.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TimelineComponent } from "./timeline.component";
import { TEST_DATASET_NAME, mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { mockPageBasedInfo } from "src/app/search/mock.data";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { DisplayHashModule } from "../display-hash/display-hash.module";
import { ToastrModule } from "ngx-toastr";
import { DisplayTimeModule } from "../display-time/display-time.module";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { MetadataBlockNavigationParams } from "src/app/interface/navigation.interface";
import AppValues from "src/app/common/app.values";

describe("TimelineComponent", () => {
    let component: TimelineComponent;
    let fixture: ComponentFixture<TimelineComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimelineComponent],
            imports: [
                DisplayHashModule,
                ToastrModule.forRoot(),
                DisplayTimeModule,
                MatIconModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                NgbPopoverModule,
                RouterTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TimelineComponent);
        component = fixture.componentInstance;
        navigationService = TestBed.inject(NavigationService);
        component.datasetName = TEST_DATASET_NAME;
        component.pageInfo = mockPageBasedInfo;
        component.history = [
            mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash as MetadataBlockFragment,
        ];

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should navigate to owner view", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        emitClickOnElementByDataTestId(fixture, "button-verified");
        fixture.detectChanges();

        const navigateLink = getElementByDataTestId(fixture, "navigate-to-owner-link");
        navigateLink.click();

        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith("testName");
    });

    it("should check avatar url", () => {
        const imageElement = findElementByDataTestId(fixture, "timeline-avatarUrl-0") as HTMLImageElement;
        const src = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash?.author.avatarUrl;
        const result = src ? src : AppValues.DEFAULT_AVATAR_URL;
        expect(imageElement.src).toEqual(result);
    });

    it("should navigate to metadata block", () => {
        const navigateToMetadataBlockSpy = spyOn(navigationService, "navigateToMetadataBlock");
        const params: MetadataBlockNavigationParams = {
            accountName: component.history[0].author.accountName,
            datasetName: component.datasetName,
            blockHash: component.history[0].blockHash,
        };

        emitClickOnElementByDataTestId(fixture, "navigate-to-block");
        fixture.detectChanges();

        expect(navigateToMetadataBlockSpy).toHaveBeenCalledWith(params);
    });
});
