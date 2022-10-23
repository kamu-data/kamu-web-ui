import { mockNode } from "./../../../search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineageComponent } from "./lineage-component";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockLineageUpdate } from "../data-tabs.mock";

describe("LineageComponent", () => {
    let component: LineageComponent;
    let fixture: ComponentFixture<LineageComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LineageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LineageComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check click on Node", () => {
        const emitSpy = spyOn(component.onClickNodeEmit, "emit");
        component.onClickNode(mockNode);
        expect(emitSpy).toHaveBeenCalledWith(mockNode);
    });

    it("should check #ngOninit", () => {
        appDatasetSubsService.changeLineageData(mockLineageUpdate);
        component.ngOnInit();
        expect(component.isAvailableLineageGraph).toBeTruthy();
    });
});
