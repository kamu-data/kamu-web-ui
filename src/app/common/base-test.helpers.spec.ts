import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { RouterEvent } from "@angular/router";
import { MaybeNull } from "./app.types";

export function findElement<T>(
    fixture: ComponentFixture<T>,
    selector: string,
): DebugElement {
    return fixture.debugElement.query(By.css(selector));
}

export function findNativeElement<T>(
    fixture: ComponentFixture<T>,
    selector: string,
): HTMLElement {
    return findElement(fixture, selector).nativeElement as HTMLElement;
}

export function emitClickOnElement<T>(
    fixture: ComponentFixture<T>,
    selector: string,
): void {
    findNativeElement(fixture, selector).click();
}

export function findElementByDataTestId<T>(
    fixture: ComponentFixture<T>,
    id: string,
): HTMLElement {
    const debugElement: MaybeNull<DebugElement> = fixture.debugElement.query(
        By.css(`[data-test-id="${id}"]`),
    );
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
