/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { DataSchemaFormat } from "@api/kamu.graphql.interface";

import { OdfSchemaPropertyComponent } from "./odf-schema-property.component";

describe("OdfSchemaPropertyComponent", () => {
    let component: OdfSchemaPropertyComponent;
    let fixture: ComponentFixture<OdfSchemaPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, OdfSchemaPropertyComponent],
            providers: [provideToastr()],
        }).compileComponents();

        fixture = TestBed.createComponent(OdfSchemaPropertyComponent);
        component = fixture.componentInstance;
        component.data = {
            format: DataSchemaFormat.OdfJson,
            content:
                '{"fields":[{"name":"id","type":{"kind":"Option","inner":{"kind":"Int64"}}},{"name":"source","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"captures","type":{"kind":"Option","inner":{"kind":"Int32"}}},{"name":"capture_measure","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"taxon_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"scientific_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"parent_taxon","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"year","type":{"kind":"Option","inner":{"kind":"Int32"}}},{"name":"rfmo","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"gear_name","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"gear_code","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"flag","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"ocean","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"latitude","type":{"kind":"Option","inner":{"kind":"Float32"}}},{"name":"longitude","type":{"kind":"Option","inner":{"kind":"Float32"}}},{"name":"dataset_organisation","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_acknowledgement","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_url","type":{"kind":"Option","inner":{"kind":"String"}}},{"name":"dataset_date","type":{"kind":"Date"}}]}',

            __typename: "DataSchema",
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
