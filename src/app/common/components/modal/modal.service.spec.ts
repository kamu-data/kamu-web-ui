import { ModalCommandInterface } from "../../../interface/modal.interface";
import { TestBed } from "@angular/core/testing";
import { ModalService } from "./modal.service";
import { first } from "rxjs/operators";

describe("ModalService", () => {
    let service: ModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ModalService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check setter modalType", () => {
        service.modalType = "test";
        expect(service.modalType).toEqual("test");
    });

    it("should show modal image", () => {
        const testImageUrl = "http://image.com";
        const subscription$ = service
            .getCommand()
            .pipe(first())
            .subscribe((command: ModalCommandInterface) => {
                expect(command).toEqual({
                    context: {
                        message: testImageUrl,
                    },
                    type: "image",
                });
            });
        service.showImage(testImageUrl);
        expect(subscription$.closed).toBeTrue();
    });

    it("should show modal spinner", () => {
        const subscription$ = service
            .getCommand()
            .pipe(first())
            .subscribe((command: ModalCommandInterface) => {
                expect(command).toEqual({
                    context: {},
                    type: "spinner",
                });
            });
        service.showSpinner();
        expect(subscription$.closed).toBeTrue();
    });

    it("should check success show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.success(testObj);
        expect(result).toEqual("ok");
    });

    it("should check warning show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.warning(testObj);
        expect(result).toEqual("warning");
    });

    it("should check error show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.error(testObj);
        expect(result).toEqual("error");
    });

    it("should check dialog_question show modal", async () => {
        const testObj: ModalCommandInterface = {
            context: {},
            type: "dialog",
        };
        const result = await service.dialog_question(testObj);
        expect(result).toEqual("dialog_question");
    });
});
