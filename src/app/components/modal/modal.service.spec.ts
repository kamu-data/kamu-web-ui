import { ModalCommandInterface } from "./../../interface/modal.interface";
import { TestBed } from "@angular/core/testing";
import { ModalService } from "./modal.service";
import { first } from "rxjs/operators";

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

    it("should be show modal image", async () => {
        const testImageUrl = "http://image.com";
        const subscription$ = service.getCommand().pipe(first()).subscribe(
            (command: ModalCommandInterface) => {
                void expect(command).toEqual({
                    context: {
                        message: testImageUrl,
                    },
                    type: "image",
                });
            }
        );
        service.showImage(testImageUrl);
        await expect(subscription$.closed).toBeTruthy();
    });

    it("should be show modal spinner", async () => {
        const subscription$ = service.getCommand().pipe(first()).subscribe(
            (command: ModalCommandInterface) => {
                void expect(command).toEqual({
                    context: {},
                    type: "spinner",
                });
            }
        );
        service.showSpinner();
        await expect(subscription$.closed).toBeTruthy();
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
