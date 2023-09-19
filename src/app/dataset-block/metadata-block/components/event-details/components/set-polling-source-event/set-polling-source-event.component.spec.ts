import { FetchStepUrl, PrepStepDecompress } from "../../../../../../api/kamu.graphql.interface";
import { getElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { CardsPropertyComponent } from "../common/cards-property/cards-property.component";
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
import { SharedTestModule } from "src/app/common/shared-test.module";

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
            imports: [SharedTestModule],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetPollingSourceEventComponent);
        component = fixture.componentInstance;
        component.event = Object.assign({}, mockSetPollingSourceEvent, {
            unsupportedKey: { name: "" },
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check render event data", () => {
        const url = getElementByDataTestId(fixture, "setPollingSource-fetchStepUrl-url");
        expect(url.innerText).toEqual((mockSetPollingSourceEvent.fetch as FetchStepUrl).url);

        const schema = getElementByDataTestId(fixture, "setPollingSource-readStepCsv-schema");
        expect(schema).toBeDefined();

        const header = getElementByDataTestId(fixture, "setPollingSource-readStepCsv-header");
        expect(Boolean(header.innerText)).toEqual(true);

        const mergeStrategyType = getElementByDataTestId(fixture, "setPollingSource-mergeStrategyLedger-__typename");
        expect(mergeStrategyType.textContent).toEqual("(Ledger strategy)");

        const primaryKey = getElementByDataTestId(fixture, "setPollingSource-mergeStrategyLedger-primaryKey-0");
        expect(primaryKey.textContent).toEqual("id ");

        const engine = getElementByDataTestId(fixture, "setPollingSource-transformSql-engine");
        expect(engine.textContent).toEqual("(Apache Spark)");

        const queries = getElementByDataTestId(fixture, "setPollingSource-transformSql-queries");
        expect(queries).toBeDefined();

        const prepareFormat = getElementByDataTestId(fixture, "setPollingSource-prepStepDecompress-format");
        expect(prepareFormat.textContent).toEqual(
            (mockSetPollingSourceEvent.prepare as PrepStepDecompress[])[0].format,
        );

        const prepareSubPath = getElementByDataTestId(fixture, "setPollingSource-prepStepDecompress-subPath");
        expect(prepareSubPath.textContent).toEqual(
            (mockSetPollingSourceEvent.prepare as PrepStepDecompress[])[0].subPath ?? "",
        );
    });

    it("should check render unsupported section", () => {
        const unsupportedSection = getElementByDataTestId(fixture, "unsupported-section");
        expect(unsupportedSection).toBeDefined();
    });
});
