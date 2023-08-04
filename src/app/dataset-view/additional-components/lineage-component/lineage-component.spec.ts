import { mockNode } from "./../../../search/mock.data";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { LineageComponent } from "./lineage-component";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockLineageUpdate } from "../data-tabs.mock";
import { first } from "rxjs/operators";
import { Node } from "@swimlane/ngx-graph/lib/models/node.model";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("LineageComponent", () => {
    let component: LineageComponent;
    let fixture: ComponentFixture<LineageComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LineageComponent],
            imports: [SharedTestModule],
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
        const emitterSubscription$ = component.onClickNodeEmit.pipe(first()).subscribe((node: Node) => {
            expect(node).toEqual(mockNode);
        });

        component.onClickNode(mockNode);
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should check #ngOninit", () => {
        appDatasetSubsService.changeLineageData(mockLineageUpdate);
        component.ngOnInit();
        expect(component.isAvailableLineageGraph).toBeTrue();
    });
});
