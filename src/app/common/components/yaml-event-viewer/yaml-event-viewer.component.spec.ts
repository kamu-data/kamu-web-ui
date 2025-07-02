/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { YamlEventViewerComponent } from "./yaml-event-viewer.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "../../helpers/app.helpers";
import { HighlightModule } from "ngx-highlightjs";

describe("YamlEventViewerComponent with SetTransform", () => {
    let component: YamlEventViewerComponent;
    let fixture: ComponentFixture<YamlEventViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [HIGHLIGHT_OPTIONS_PROVIDER],
            imports: [SharedTestModule, HighlightModule, YamlEventViewerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent<YamlEventViewerComponent>(YamlEventViewerComponent);
        component = fixture.componentInstance;
        component.data = "test";
        fixture.detectChanges();
    });

    it("should create component with SetTransform", () => {
        expect(component).toBeTruthy();
    });
});
