import { fakeAsync, tick } from "@angular/core/testing";
import { promiseWithCatch, requireValue } from "./app.helpers";

describe("AppHelpers", () => {
    it("should check non-null requireValue", async () => {
        await expect(requireValue({})).toEqual({});
    });

    it("should check null requireValue", async () => {
        await expect(() => requireValue(null)).toThrowError();
    });
    
    it("should check promiseWithCatch with success", async () => {
        const consoleErrorSpy = spyOn(console, 'error').and.stub();
        const emptyPromise = async () => { /* Intentionally empty */ };
        promiseWithCatch(emptyPromise());
        await expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
    
    it("should check promiseWithCatch with failure", fakeAsync(async () => {
        const consoleErrorSpy = spyOn(console, 'error').and.stub();
        const failingPromise = async () => { 
            await expect(consoleErrorSpy).not.toHaveBeenCalled();
            throw Error("test") 
        };
        promiseWithCatch(failingPromise());
        tick();
        await expect(consoleErrorSpy).toHaveBeenCalled();
    }));    
});
