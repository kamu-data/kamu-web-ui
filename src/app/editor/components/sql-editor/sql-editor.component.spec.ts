/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import {
    BaseEditorComponentTestEnvironment,
    sharedBasedEditorComponentTest,
} from "src/app/editor/components/base-editor/base-editor.component.spec";
import { SqlEditorComponent } from "src/app/editor/components/sql-editor/sql-editor.component";
import { EditorModule } from "src/app/editor/editor.module";
import { MonacoService } from "src/app/editor/services/monaco.service";

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
