/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MonacoService } from "../../services/monaco.service";
import { EditorModule } from "../../editor.module";
import { YamlEditorComponent } from "./yaml-editor.component";

import {
    BaseEditorComponentTestEnvironment,
    sharedBasedEditorComponentTest,
} from "../base-editor/base-editor.component.spec";

describe("YamlEditorComponent", () => {
    let fixture: ComponentFixture<YamlEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [EditorModule, YamlEditorComponent],
    providers: [MonacoService],
}).compileComponents();

        fixture = TestBed.createComponent(YamlEditorComponent);

        fixture.detectChanges();
    });

    function createTestEnvironment(): BaseEditorComponentTestEnvironment {
        return {
            fixture,
        };
    }

    sharedBasedEditorComponentTest(createTestEnvironment);
});
