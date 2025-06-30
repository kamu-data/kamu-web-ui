/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { BlockRowDataComponent } from "src/app/common/components/block-row-data/block-row-data.component";
import { VisibilityPropertyComponent } from "./../common/visibility-property/visibility-property.component";
import { CardsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetTransform } from "../../mock.events";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { SetTransformEventComponent } from "./set-transform-event.component";
import { TemporalTablesPropertyComponent } from "../common/temporal-tables-property/temporal-tables-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HIGHLIGHT_OPTIONS, HighlightModule } from "ngx-highlightjs";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("SetTransformEventComponent", () => {
    let component: SetTransformEventComponent;
    let fixture: ComponentFixture<SetTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
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
    imports: [ApolloTestingModule, SharedTestModule, HighlightModule, MatIconModule, NgbTooltipModule, SetTransformEventComponent,
        SimplePropertyComponent,
        EnginePropertyComponent,
        SqlQueryViewerComponent,
        TemporalTablesPropertyComponent,
        CardsPropertyComponent,
        VisibilityPropertyComponent,
        BlockRowDataComponent,
        TooltipIconComponent],
}).compileComponents();

        fixture = TestBed.createComponent(SetTransformEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
