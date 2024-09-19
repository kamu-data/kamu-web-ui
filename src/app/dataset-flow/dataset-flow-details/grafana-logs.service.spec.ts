import { TestBed } from "@angular/core/testing";
import { GrafanaLogsService } from "./grafana-logs.service";

describe("GrafanaLogsService", () => {
    let service: GrafanaLogsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GrafanaLogsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
