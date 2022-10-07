/* eslint-disable @typescript-eslint/dot-notation */
import { ModalCommandInterface } from "./../../interface/modal.interface";
import { TestBed } from "@angular/core/testing";
import { ModalService } from "./modal.service";

describe("ModalService", () => {
    let service: ModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ModalService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be check setter modalType", async () => {
        service.modalType = "test";
        await expect(service.modalType).toEqual("test");
    });

    it("should be show modal image", () => {
        const testImageUrl = "http://image.com";
        const showModalSpy = spyOn(service["showModal$"], "next");
        service.showImage(testImageUrl);
        expect(showModalSpy).toHaveBeenCalledWith({
            context: {
                message: testImageUrl,
            },
            type: "image",
        });
    });

    it("should be show modal spinner", () => {
        const showModalSpy = spyOn(service["showModal$"], "next");
        service.showSpinner();
        expect(showModalSpy).toHaveBeenCalledWith({
            context: {},
            type: "spinner",
        });
    });

    it("should check success show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.success(testObj);
        await expect(result).toEqual("ok");
    });

    it("should check warning show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.warning(testObj);
        await expect(result).toEqual("warning");
    });

    it("should check error show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.error(testObj);
        await expect(result).toEqual("error");
    });

    it("should check dialog_question show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.dialog_question(testObj);
        await expect(result).toEqual("dialog_question");
    });
});
