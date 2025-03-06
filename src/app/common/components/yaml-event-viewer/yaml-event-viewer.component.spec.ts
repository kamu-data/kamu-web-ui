/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { YamlEventViewerComponent } from "./yaml-event-viewer.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("YamlEventViewerComponent with SetTransform", () => {
    let component: YamlEventViewerComponent;
    let fixture: ComponentFixture<YamlEventViewerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlEventViewerComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [SharedTestModule],
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
