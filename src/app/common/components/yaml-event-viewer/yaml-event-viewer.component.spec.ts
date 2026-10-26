/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { YamlEventViewerComponent } from "@common/components/yaml-event-viewer/yaml-event-viewer.component";
import { HIGHLIGHT_OPTIONS_PROVIDER } from "@common/helpers/app.helpers";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

describe("YamlEventViewerComponent with SetTransform", () => {
    let component: YamlEventViewerComponent;
    let fixture: ComponentFixture<YamlEventViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [HIGHLIGHT_OPTIONS_PROVIDER],
            imports: [SharedTestModule, YamlEventViewerComponent],
        }).compileComponents();

        fixture = TestBed.createComponent<YamlEventViewerComponent>(YamlEventViewerComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "data", "test");
        fixture.detectChanges();
    });

    it("should create component with SetTransform", () => {
        expect(component).toBeTruthy();
    });
});
