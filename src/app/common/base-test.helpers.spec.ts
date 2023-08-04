import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { ActivatedRoute, RouterEvent } from "@angular/router";
import { MaybeNull } from "./app.types";

export function findElement<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
}

export function findNativeElement<T>(fixture: ComponentFixture<T>, selector: string): HTMLElement {
    return findElement(fixture, selector).nativeElement as HTMLElement;
}

export function emitClickOnElement<T>(fixture: ComponentFixture<T>, selector: string): void {
    findNativeElement(fixture, selector).click();
}

export function emitClickOnElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): void {
    const debugElement: MaybeNull<DebugElement> = fixture.debugElement.query(By.css(`[data-test-id="${id}"]`));
    (debugElement.nativeElement as HTMLElement).click();
}

export function findElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): HTMLElement {
    const debugElement: MaybeNull<DebugElement> = fixture.debugElement.query(By.css(`[data-test-id="${id}"]`));
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (debugElement) {
        return debugElement.nativeElement as HTMLElement;
    } else {
        throw new Error("Element " + id + " not found");
    }
}

export const routerMockEventSubject = new ReplaySubject<RouterEvent>(1);

export const routerMock = {
    navigate: () => null,
    events: routerMockEventSubject.asObservable(),
    url: "/",
};

export const activeRouteMockQueryParamMap = new Map<string, string>();

export const activeRouteMock = {
    snapshot: {
        queryParamMap: {
            get: (key: string) => activeRouteMockQueryParamMap.get(key),
        },
    },
};

export const snapshotParamMapMock = {
    provide: ActivatedRoute,
    useValue: {
        snapshot: {
            paramMap: {
                get: (key: string) => {
                    switch (key) {
                        case "accountName":
                            return "accountName";
                        case "datasetName":
                            return "datasetName";
                    }
                },
            },
        },
    },
};

export function findInputElememtByDataTestId<T>(fixture: ComponentFixture<T>, id: string): HTMLInputElement {
    return findElementByDataTestId(fixture, id) as HTMLInputElement;
}

export function dispatchInputEvent<T>(fixture: ComponentFixture<T>, id: string, value: string): void {
    const element = findInputElememtByDataTestId(fixture, id);
    element.value = value;
    element.dispatchEvent(new Event("input"));
    fixture.detectChanges();
}
