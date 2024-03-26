import { ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { Apollo } from "apollo-angular";
import { mockFullPowerDatasetPermissionsFragment } from "../../../search/mock.data";
import { mockMetadataDerivedUpdate, mockOverviewDataUpdate } from "../data-tabs.mock";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewComponent } from "./overview.component";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { DatasetCurrentInfoFragment, DatasetKind, DatasetOverviewFragment } from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { first } from "rxjs/operators";
import { NgbModal, NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatChipsModule } from "@angular/material/chips";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { OverviewHistorySummaryHeaderComponent } from "src/app/components/overview-history-summary-header/overview-history-summary-header.component";
import { ReadmeSectionComponent } from "./components/readme-section/readme-section.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { DisplayTimeComponent } from "src/app/components/display-time/display-time.component";
import { DisplayHashComponent } from "src/app/components/display-hash/display-hash.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { DynamicTableComponent } from "src/app/components/dynamic-table/dynamic-table.component";
import { MatTableModule } from "@angular/material/table";
import { RouterTestingModule } from "@angular/router/testing";
import _ from "lodash";
import { mockSetLicense } from "src/app/dataset-block/metadata-block/components/event-details/mock.events";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { ChangeDetectionStrategy, SecurityContext } from "@angular/core";
import { MarkdownModule } from "ngx-markdown";
import { HttpClient } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { DatasetFlowsService } from "../flows-component/services/dataset-flows.service";
import { of } from "rxjs";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";

describe("OverviewComponent", () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;
    let datasetSubsService: DatasetSubscriptionsService;
    let navigationService: NavigationService;
    let modalService: NgbModal;
    let datasetFlowsService: DatasetFlowsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                OverviewComponent,
                OverviewHistorySummaryHeaderComponent,
                ReadmeSectionComponent,
                DisplayTimeComponent,
                DisplayHashComponent,
                DynamicTableComponent,
            ],
            imports: [
                AngularSvgIconModule.forRoot(),
                ApolloModule,
                DisplaySizeModule,
                HttpClientTestingModule,
                MarkdownModule.forRoot({
                    loader: HttpClient,
                    sanitize: SecurityContext.NONE,
                }),
                MatChipsModule,
                MatTableModule,
                NgbTooltipModule,
                OwlDateTimeModule,
                OwlNativeDateTimeModule,
                OwlMomentDateTimeModule,
                ReactiveFormsModule,
                RouterTestingModule,
                SharedTestModule,
                ToastrModule.forRoot(),
                MatIconModule,
            ],
            providers: [Apollo],
        })
            .overrideComponent(OverviewComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsService.emitOverviewChanged({
            schema: mockMetadataDerivedUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: _.cloneDeep(mockOverviewDataUpdate.overview), // clone, as we modify this data in the tests
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);

        navigationService = TestBed.inject(NavigationService);
        datasetFlowsService = TestBed.inject(DatasetFlowsService);
        modalService = TestBed.inject(NgbModal);

        fixture = TestBed.createComponent(OverviewComponent);
        component = fixture.componentInstance;
        component.datasetBasics = {
            id: mockOverviewDataUpdate.overview.id,
            kind: mockOverviewDataUpdate.overview.kind,
            name: mockOverviewDataUpdate.overview.name,
            alias: mockOverviewDataUpdate.overview.alias,
            owner: {
                __typename: "Account",
                id: mockOverviewDataUpdate.overview.owner.id,
                accountName: mockOverviewDataUpdate.overview.owner.accountName,
            },
        };
        component.datasetPermissions = _.cloneDeep(mockFullPowerDatasetPermissionsFragment); // clone, as we modify this data in the tests

        fixture.detectChanges();
    });

    function currentOverview(): DatasetOverviewFragment {
        if (component.currentState) {
            return component.currentState.overview;
        } else {
            throw new Error("Current state must be defined");
        }
    }

    function currentInfo(): DatasetCurrentInfoFragment {
        return currentOverview().metadata.currentInfo;
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOninit", () => {
        expect(component.metadataFragmentBlock).toBeDefined();
        expect(component.currentState).toBeDefined();
    });

    it("no metadata block if no current state, and mostly cannot do anything", () => {
        component.currentState = undefined;
        fixture.detectChanges();

        expect(component.metadataFragmentBlock).toBeUndefined();

        expect(component.canAddDatasetInfo).toBeFalse();
        expect(component.canAddLicense).toBeFalse();
        expect(component.canAddReadme).toBeFalse();
        expect(component.canAddSetPollingSource).toBeFalse();
        expect(component.canAddSetTransform).toBeFalse();
        expect(component.canAddWatermark).toBeFalse();

        expect(component.canEditDatasetInfo).toBeFalse();
        expect(component.canEditLicense).toBeFalse();
        expect(component.canEditReadme).toBeFalse();
        expect(component.canEditWatermark).toBeFalse();
    });

    it("should check open website", () => {
        const navigationServiceSpy = spyOn(navigationService, "navigateToWebsite");
        const testWebsite = "http://google.com";
        component.showWebsite(testWebsite);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testWebsite);
    });

    it("should select topic name", () => {
        const topicName = "test topic name";
        const emitterSubscription$ = component.selectTopicEmit
            .pipe(first())
            .subscribe((name: string) => expect(name).toEqual(topicName));

        component.selectTopic(topicName);
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should open information modal window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.openInformationModal();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should open license modal window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.openLicenseModal();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should open set watermark window", () => {
        const openModalSpy = spyOn(modalService, "open").and.callThrough();
        component.openWatermarkModal();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check navigate to flows tab when 'refresh now' button was clicked", () => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const datasetTriggerFlowSpy = spyOn(datasetFlowsService, "datasetTriggerFlow").and.returnValue(of(true));

        emitClickOnElementByDataTestId(fixture, "refresh-now-button");

        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ tab: DatasetViewTypeEnum.Flows }),
        );
        expect(datasetTriggerFlowSpy).toHaveBeenCalledTimes(1);
    });

    describe("AddPushSource", () => {
        it("should navigate to create AddPushSource event page", () => {
            const navigateToAddPushSourceSpy = spyOn(navigationService, "navigateToAddPushSource");
            component.navigateToAddPushSource();
            expect(navigateToAddPushSourceSpy).toHaveBeenCalledWith({
                accountName: mockOverviewDataUpdate.overview.owner.accountName,
                datasetName: mockOverviewDataUpdate.overview.name,
            });
        });
    });

    describe("SetPollingSource", () => {
        it("should be possible to add polling source for root dataset and commit permissions", () => {
            // By default, we have a root dataset and commit permissions, and a ready polling source, swe reset it here
            currentOverview().metadata.currentPollingSource = undefined;
            expect(component.datasetPermissions.permissions.canCommit).toBeTrue();

            expect(component.canAddSetPollingSource).toBeTrue();
        });

        it("cannot add set polling source when no permissions", () => {
            component.datasetPermissions.permissions.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddSetPollingSource).toBeFalse();
        });

        it("cannot add set polling source when having a derived dataset", () => {
            component.datasetBasics.kind = DatasetKind.Derivative;
            fixture.detectChanges();

            expect(component.canAddSetPollingSource).toBeFalse();
        });

        it("cannot add set polling source if polling source already exists", () => {
            currentOverview().metadata.currentPollingSource = { __typename: "SetPollingSource" };
            fixture.detectChanges();

            expect(component.canAddSetPollingSource).toBeFalse();
        });

        it("should navigate to create SetPollingSource event page", () => {
            const navigateToAddPollingSourceSpy = spyOn(navigationService, "navigateToAddPollingSource");
            component.navigateToAddPollingSource();
            expect(navigateToAddPollingSourceSpy).toHaveBeenCalledWith({
                accountName: mockOverviewDataUpdate.overview.owner.accountName,
                datasetName: mockOverviewDataUpdate.overview.name,
            });
        });

        it("should check refresh button is disabled when currentPollingSource=undefined=null ", () => {
            currentOverview().metadata.currentPollingSource = null;
            fixture.detectChanges();

            const refreshButton = findElementByDataTestId(fixture, "refresh-now-button") as HTMLButtonElement;
            expect(refreshButton.disabled).toBeTrue();
        });
    });

    describe("SetTransform", () => {
        beforeEach(() => {
            component.datasetBasics.kind = DatasetKind.Derivative;
            currentOverview().metadata.currentPollingSource = undefined;
            fixture.detectChanges();
        });

        it("should be possible to add transform for derived dataset and with commit permissions", () => {
            expect(component.datasetPermissions.permissions.canCommit).toBeTrue();

            expect(component.canAddSetTransform).toBeTrue();
        });

        it("cannot add set transform when no permissions", () => {
            component.datasetPermissions.permissions.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddSetTransform).toBeFalse();
        });

        it("cannot add set transform source when having a root dataset", () => {
            component.datasetBasics.kind = DatasetKind.Root;
            fixture.detectChanges();

            expect(component.canAddSetTransform).toBeFalse();
        });

        it("cannot add set transform if transform already exists", () => {
            currentOverview().metadata.currentTransform = { __typename: "SetTransform" };
            fixture.detectChanges();

            expect(component.canAddSetTransform).toBeFalse();
        });

        it("should check refresh button is disabled when currentTransform=null", () => {
            currentOverview().metadata.currentTransform = null;
            fixture.detectChanges();

            const refreshButton = findElementByDataTestId(fixture, "refresh-now-button") as HTMLButtonElement;
            expect(refreshButton.disabled).toBeTrue();
        });

        it("should navigate to create SetTransform event page", () => {
            const navigateToSetTransformSpy = spyOn(navigationService, "navigateToSetTransform");
            component.navigateToSetTransform();
            expect(navigateToSetTransformSpy).toHaveBeenCalledWith({
                accountName: mockOverviewDataUpdate.overview.owner.accountName,
                datasetName: mockOverviewDataUpdate.overview.name,
            });
        });
    });

    describe("can add or edit dataset info", () => {
        it("can add dataset info, but not edit it, with full permissions and no info predefined", () => {
            // All permissions set by default
            // No info by default
            expect(component.datasetPermissions.permissions.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentInfo.description).toBeFalsy();
            expect(currentOverview().metadata.currentInfo.keywords).toBeFalsy();

            expect(component.hasDatasetInfo).toBeFalse();
            expect(component.canAddDatasetInfo).toBeTrue();
            expect(component.canEditDatasetInfo).toBeFalse();
        });

        it("cannot add or edit dataset info without commit permissions and without existing info", () => {
            component.datasetPermissions.permissions.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeFalse();
        });

        it("cannot add or edit dataset info without commit permissions, but with existing info", () => {
            component.datasetPermissions.permissions.canCommit = false;
            currentInfo().description = "someDescription";
            fixture.detectChanges();

            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeFalse();
        });

        it("cannot add dataset info, if info description is available, but can edit", () => {
            currentInfo().description = "someDescription";
            fixture.detectChanges();

            expect(component.hasDatasetInfo).toBeTrue();
            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeTrue();
        });

        it("cannot add dataset info, if a keyword is defined, but can edit", () => {
            currentInfo().keywords = ["keyword"];
            fixture.detectChanges();

            expect(component.hasDatasetInfo).toBeTrue();
            expect(component.canAddDatasetInfo).toBeFalse();
            expect(component.canEditDatasetInfo).toBeTrue();
        });

        it("can add dataset info, if a keywords array is empty, but can't edit", () => {
            currentInfo().keywords = [];
            fixture.detectChanges();

            expect(component.hasDatasetInfo).toBeFalse();
            expect(component.canAddDatasetInfo).toBeTrue();
            expect(component.canEditDatasetInfo).toBeFalse();
        });
    });

    describe("can add or edit readme", () => {
        it("can add readme but not edit it, with full permissions and no readme predefined", () => {
            // All permissions set by default
            // No readme by default
            expect(component.datasetPermissions.permissions.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentReadme).toBeFalsy();

            expect(component.canAddReadme).toBeTrue();
            expect(component.canEditReadme).toBeFalse();
        });

        it("cannot add readme if already started adding", () => {
            component.onAddReadme();

            expect(component.canAddReadme).toBeFalse();
            expect(component.canEditReadme).toBeFalse();
        });

        it("cannot add or edit readme without commit permissions and without existing readme", () => {
            component.datasetPermissions.permissions.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddReadme).toBeFalse();
            expect(component.canEditReadme).toBeFalse();
        });

        it("cannot add readme, if readme is available, but can edit", () => {
            currentOverview().metadata.currentReadme = "some readme";
            fixture.detectChanges();

            expect(component.canAddReadme).toBeFalse();
            expect(component.canEditReadme).toBeTrue();
        });
    });

    describe("can add or edit license info", () => {
        it("can add license  but not edit it, with full permissions and no license predefined", () => {
            // All permissions set by default
            // No license by default
            expect(component.datasetPermissions.permissions.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentLicense).toBeFalsy();

            expect(component.canAddLicense).toBeTrue();
            expect(component.canEditLicense).toBeFalse();
        });

        it("cannot add or edit license without commit permissions and without existing license", () => {
            component.datasetPermissions.permissions.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddLicense).toBeFalse();
            expect(component.canEditLicense).toBeFalse();
        });

        it("cannot add license, if license is available, but can edit", () => {
            currentOverview().metadata.currentLicense = mockSetLicense;
            fixture.detectChanges();

            expect(component.canAddLicense).toBeFalse();
            expect(component.canEditLicense).toBeTrue();
        });
    });

    describe("can add or edit watermark", () => {
        it("can edit watermark  but not add it, with full permissions, root dataset, and watermark predefined", () => {
            // All permissions set by default
            // Root dataset by default
            // Having watermark by default
            expect(component.datasetPermissions.permissions.canCommit).toBeTrue();
            expect(currentOverview().metadata.currentWatermark).toBeTruthy();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeTruthy();
        });

        it("can add watermark, but not edit it, with full permissions, root dataset, and no watermark predefined", () => {
            currentOverview().metadata.currentWatermark = undefined;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeTrue();
            expect(component.canEditWatermark).toBeFalse();
        });

        it("cannot add or edit watermark without commit permissions", () => {
            component.datasetPermissions.permissions.canCommit = false;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();

            currentOverview().metadata.currentWatermark = undefined;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();
        });

        it("cannot add or edit watermark with derived dataset", () => {
            component.datasetBasics.kind = DatasetKind.Derivative;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();

            currentOverview().metadata.currentWatermark = undefined;
            fixture.detectChanges();

            expect(component.canAddWatermark).toBeFalse();
            expect(component.canEditWatermark).toBeFalse();
        });
    });
});
