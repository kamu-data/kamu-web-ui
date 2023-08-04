import { ApolloTestingModule } from "apollo-angular/testing";
import { TestBed } from "@angular/core/testing";
import { EditSetTransformService } from "./edit-set-transform..service";
import { Apollo, ApolloModule } from "apollo-angular";
import { SqlQueryStep, TransformInput } from "src/app/api/kamu.graphql.interface";
import { mockParseSetTransFormYamlType, mockSetTransformEventYaml } from "./mock.data";

describe("EditSetTransformService", () => {
    let service: EditSetTransformService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [ApolloModule, ApolloTestingModule],
        });
        service = TestBed.inject(EditSetTransformService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check #parseInputDatasets() method", () => {
        const inputDatasets = new Set<string>([
            '{"id":"did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX","name":"account.tokens.portfolio.usd"}',
        ]);
        const result = [
            {
                id: "did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX",
                name: "account.tokens.portfolio.usd",
            },
        ] as TransformInput[];

        expect(service.parseInputDatasets(inputDatasets)).toEqual(result);
    });

    it("should check #transformEventAsObject() method", () => {
        const inputDatasets = new Set<string>([
            '{"id":"did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX","name":"account.tokens.portfolio.usd"}',
        ]);
        const engine = "Spark";
        const queries = [{ alias: "alias1", query: "query1" }] as Omit<SqlQueryStep, "__typename">[];
        const result = {
            inputs: service.parseInputDatasets(inputDatasets),
            transform: {
                kind: "sql",
                engine: engine.toLowerCase(),
                queries,
            },
        };
        expect(service.transformEventAsObject(inputDatasets, engine, queries)).toEqual(result);
    });

    it("should check #parseEventFromYaml() method", () => {
        const event = mockSetTransformEventYaml;
        const result = mockParseSetTransFormYamlType;
        expect(service.parseEventFromYaml(event)).toEqual(result);
    });
});
