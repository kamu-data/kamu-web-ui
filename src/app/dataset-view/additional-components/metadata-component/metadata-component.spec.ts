import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockMetadataSchemaUpdate } from "../data-tabs.mock";
import { MetadataComponent } from "./metadata-component";
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("MetadataComponent", () => {
    let component: MetadataComponent;
    let fixture: ComponentFixture<MetadataComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MetadataComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideComponent(MetadataComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })

            .compileComponents();

        fixture = TestBed.createComponent(MetadataComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOninit", () => {
        expect(component.currentState).not.toBeDefined();

        appDatasetSubsService.metadataSchemaChanges(
            mockMetadataSchemaUpdate as MetadataSchemaUpdate,
        );
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.currentState).toBeDefined();
    });
});
