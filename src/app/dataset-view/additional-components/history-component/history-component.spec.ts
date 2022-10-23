import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockHistoryUpdate } from "../data-tabs.mock";
import { HistoryComponent } from "./history-component";

describe("HistoryComponent", () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HistoryComponent],
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
        const emitSpy = spyOn(component.onPageChangeEmit, "emit");
        const testChangeNotification = { currentPage: 1, isClick: false };
        component.onPageChange(testChangeNotification);
        expect(emitSpy).toHaveBeenCalledWith(testChangeNotification);
    });
});
