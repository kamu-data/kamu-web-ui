/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EditorModule } from "../../editor.module";
import { MonacoService } from "../../services/monaco.service";
import {
    BaseEditorComponentTestEnvironment,
    sharedBasedEditorComponentTest,
} from "../base-editor/base-editor.component.spec";
import { SqlEditorComponent } from "./sql-editor.component";

describe("SqlEditorComponent", () => {
    let fixture: ComponentFixture<SqlEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorModule, SqlEditorComponent],
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
