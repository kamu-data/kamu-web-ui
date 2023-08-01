import { ReactiveFormsModule } from "@angular/forms";
import { ApolloModule } from "apollo-angular";
import { Apollo } from "apollo-angular";
import { mockDatasetBasicsFragment } from "./../../../search/mock.data";
import {
    mockMetadataSchemaUpdate,
    mockOverviewDataUpdate,
} from "./../data-tabs.mock";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewComponent } from "./overview-component";
import { OverviewDataUpdate } from "../../dataset.subscriptions.interface";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { first } from "rxjs/operators";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatChipsModule } from "@angular/material/chips";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("OverviewComponent", () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;
    let navigationService: NavigationService;
    let modalService: NgbModal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OverviewComponent],
            imports: [
                ApolloModule,
                ReactiveFormsModule,
                MatChipsModule,
                SharedTestModule,
            ],
            providers: [Apollo],
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
        modalService = TestBed.inject(NgbModal);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOninit", () => {
        expect(component.currentState).not.toBeDefined();

        appDatasetSubsService.changeDatasetOverviewData({
            schema: mockMetadataSchemaUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: mockOverviewDataUpdate.overview,
            size: mockOverviewDataUpdate.size,
        } as OverviewDataUpdate);
        component.ngOnInit();

        expect(component.metadataFragmentBlock).toBeDefined();
        expect(component.currentState).toBeDefined();
    });

    it("should check metadataFragmentBlock equal undefined", () => {
        expect(component.currentState).not.toBeDefined();
        component.ngOnInit();
        expect(component.metadataFragmentBlock).toEqual(undefined);
    });

    [
        { kind: DatasetKind.Derivative, result: "Derivative" },
        { kind: DatasetKind.Root, result: "Root" },
    ].forEach((item: { kind: DatasetKind; result: string }) => {
        it(`should return dataset kind ${item.kind} to string ${item.result}`, () => {
            const result = component.datasetKind(item.kind);
            expect(result).toBe(item.result);
        });
    });

    it("should check open website", () => {
        const navigationServiceSpy = spyOn(
            navigationService,
            "navigateToWebsite",
        );
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

    it("should navigate to create SetPollingSource event page", () => {
        const navigateToAddPollingSourceSpy = spyOn(
            navigationService,
            "navigateToAddPollingSource",
        );
        component.navigateToAddPollingSource();
        expect(navigateToAddPollingSourceSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsFragment.owner.name,
            datasetName: mockDatasetBasicsFragment.name as string,
        });
    });
});
