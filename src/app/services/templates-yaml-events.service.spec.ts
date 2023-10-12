import { TestBed } from "@angular/core/testing";
import { TemplatesYamlEventsService } from "./templates-yaml-events.service";
import { mockPreprocessStepValue, mockSetPollingSourceEditFormWithReadNdJsonFormat } from "../search/mock.data";

describe("TemplatesYamlEventsService", () => {
    let service: TemplatesYamlEventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TemplatesYamlEventsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check call buildYamlSetInfoEvent()", () => {
        const result = service.buildYamlSetInfoEvent("mock description", ["mock-keyword"]);
        expect(result).toBe(
            "kind: MetadataEvent\nversion: 1\ncontent:\n  kind: setInfo\n" +
                `  description: mock description\n` +
                `  keywords:\n` +
                `    - mock-keyword\n`,
        );
    });

    it("should check yaml SetPollingSource event normalize", () => {
        const result = service.buildYamlSetPollingSourceEvent(
            mockSetPollingSourceEditFormWithReadNdJsonFormat,
            mockPreprocessStepValue,
        );
        expect(result).not.toContain("subPath");
        expect(result).not.toContain("jsonKind");
    });
});
