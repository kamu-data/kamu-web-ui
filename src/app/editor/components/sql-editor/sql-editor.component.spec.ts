/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SqlEditorComponent } from "./sql-editor.component";
import { MonacoService } from "../../services/monaco.service";
import { EditorModule } from "../../editor.module";

import {
    BaseEditorComponentTestEnvironment,
    sharedBasedEditorComponentTest,
} from "../base-editor/base-editor.component.spec";

describe("SqlEditorComponent", () => {
    let fixture: ComponentFixture<SqlEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorModule],
            declarations: [SqlEditorComponent],
            providers: [MonacoService],
        }).compileComponents();

        fixture = TestBed.createComponent(SqlEditorComponent);
        fixture.detectChanges();
    });

    function createTestEnvironment(): BaseEditorComponentTestEnvironment {
        return {
            fixture,
        };
    }

    sharedBasedEditorComponentTest(createTestEnvironment);
});
