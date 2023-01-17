import { FetchStepUrl } from "./../../../../../../api/kamu.graphql.interface";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { CardsPropertyComponent } from "./../common/cards-property/cards-property.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockSetPollingSourceEvent } from "../../mock.events";

import { SetPollingSourceEventComponent } from "./set-polling-source-event.component";
import { SqlQueryViewerComponent } from "../common/sql-query-viewer/sql-query-viewer.component";
import { EnginePropertyComponent } from "../common/engine-property/engine-property.component";
import { EnvVariablesPropertyComponent } from "../common/env-variables-property/env-variables-property.component";
import { LinkPropertyComponent } from "../common/link-property/link-property.component";
import { SchemaPropertyComponent } from "../common/schema-property/schema-property.component";
import { SeparatorPropertyComponent } from "../common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "../common/simple-property/simple-property.component";
import { MergeStrategyPropertyComponent } from "../common/merge-strategy-property/merge-strategy-property.component";
import { UnsupportedPropertyComponent } from "../common/unsupported-property/unsupported-property.component";
import { YamlEventViewerComponent } from "../common/yaml-event-viewer/yaml-event-viewer.component";

describe("SetPollingSourceEventComponent", () => {
    let component: SetPollingSourceEventComponent;
    let fixture: ComponentFixture<SetPollingSourceEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetPollingSourceEventComponent,
                SimplePropertyComponent,
                SeparatorPropertyComponent,
                LinkPropertyComponent,
                EnginePropertyComponent,
                SqlQueryViewerComponent,
                SchemaPropertyComponent,
                EnvVariablesPropertyComponent,
                MergeStrategyPropertyComponent,
                CardsPropertyComponent,
                UnsupportedPropertyComponent,
                YamlEventViewerComponent,
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetPollingSourceEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetPollingSourceEvent;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check toggle yaml view", () => {
        const testValue = true;
        component.isYamlView = false;
        component.onToggleView(testValue);
        expect(component.isYamlView).toBe(testValue);
    });

    it("should check render event data", () => {
        const url = findElementByDataTestId(
            fixture,
            "setPollingSource-fetchStepUrl-url",
        );
        expect(url.innerText).toEqual(
            (mockSetPollingSourceEvent.fetch as FetchStepUrl).url,
        );

        const schema = findElementByDataTestId(
            fixture,
            "setPollingSource-readStepCsv-schema",
        );
        expect(schema).toBeDefined();

        const header = findElementByDataTestId(
            fixture,
            "setPollingSource-readStepCsv-header",
        );
        expect(Boolean(header.innerText)).toEqual(true);

        const mergeStrategyType = findElementByDataTestId(
            fixture,
            "setPollingSource-mergeStrategyLedger-__typename",
        );
        expect(mergeStrategyType.textContent).toEqual("(Ledger strategy)");

        const primaryKey = findElementByDataTestId(
            fixture,
            "setPollingSource-mergeStrategyLedger-primaryKey-0",
        );
        expect(primaryKey.textContent).toEqual("id ");

        const engine = findElementByDataTestId(
            fixture,
            "setPollingSource-transformSql-engine",
        );
        expect(engine.textContent).toEqual("(Apache Spark)");

        const queries = findElementByDataTestId(
            fixture,
            "setPollingSource-transformSql-queries",
        );
        expect(queries).toBeDefined();
    });
});
