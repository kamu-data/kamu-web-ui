import { DisplayDatasetIdPipe } from "./display-dataset-id.pipe";

describe("DisplayDatasetIdPipe", () => {
    const MOCK_DATASET_ID = "did:odf:fed0100d72fc7a0d7ced1ff2d47e3bfeb844390f18a7fa7e24ced6563aa7357dfa2e9";
    const pipe = new DisplayDatasetIdPipe();

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    it("should check transform method", () => {
        expect(pipe.transform(MOCK_DATASET_ID)).toEqual("did:odf:fed...7dfa2e9");
    });
});
