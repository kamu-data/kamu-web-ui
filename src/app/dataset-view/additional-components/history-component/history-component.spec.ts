import { ComponentFixture, TestBed } from "@angular/core/testing";
import { first } from "rxjs/operators";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockHistoryUpdate } from "../data-tabs.mock";
import { HistoryComponent } from "./history-component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("HistoryComponent", () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoryComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(HistoryComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOninit", () => {
        expect(component.currentState).not.toBeDefined();

        appDatasetSubsService.changeDatasetHistory(mockHistoryUpdate);
        component.ngOnInit();

        expect(component.currentState).toBeDefined();
        expect(component.currentPage).toBeDefined();
        expect(component.totalPages).toBe(10);
    });

    it("should check change page", () => {
        const testChangeNotification = 1;

        const emitterSubscription$ = component.onPageChangeEmit
            .pipe(first())
            .subscribe((notification) =>
                expect(notification).toEqual(testChangeNotification),
            );

        component.onPageChange(testChangeNotification);
        expect(emitterSubscription$.closed).toBeTrue();
    });
});
