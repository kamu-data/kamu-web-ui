import { BlockRowDataComponent } from "src/app/dataset-block/metadata-block/components/block-row-data/block-row-data.component";
import { VisibilityPropertyComponent } from "./../common/visibility-property/visibility-property.component";
import { CardsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetTransform } from "src/app/api/kamu.graphql.interface";
import { mockSetTransform } from "../../mock.events";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { SetTransformEventComponent } from "./set-transform-event.component";
import { TemporalTablesPropertyComponent } from "../common/temporal-tables-property/temporal-tables-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { HIGHLIGHT_OPTIONS, HighlightModule } from "ngx-highlightjs";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("SetTransformEventComponent", () => {
    let component: SetTransformEventComponent;
    let fixture: ComponentFixture<SetTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetTransformEventComponent,
                SimplePropertyComponent,
                EnginePropertyComponent,
                SqlQueryViewerComponent,
                TemporalTablesPropertyComponent,
                CardsPropertyComponent,
                VisibilityPropertyComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            providers: [
                {
                    provide: HIGHLIGHT_OPTIONS,
                    useValue: {
                        coreLibraryLoader: () => import("highlight.js/lib/core"),
                        languages: {
                            sql: () => import("highlight.js/lib/languages/sql"),
                        },
                    },
                },
            ],

            imports: [ApolloTestingModule, SharedTestModule, HighlightModule, MatIconModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SetTransformEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetTransform as unknown as SetTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
