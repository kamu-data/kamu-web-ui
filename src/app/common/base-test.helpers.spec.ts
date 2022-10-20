/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { RouterEvent } from "@angular/router";

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
    return findElement(fixture, selector).nativeElement;
}

export function emitClickOnElement<T>(
    fixture: ComponentFixture<T>,
    selector: string,
): void {
    findNativeElement(fixture, selector).click();
}

export function getSpy(object: any, method: string): jasmine.Spy<any> {
    return spyOn<any>(object, method).and.callThrough();
}

export function checkHint(
    fixture: ComponentFixture<any>,
    selector: string,
    expectedHint: string,
): void {
    const element: HTMLElement = findNativeElement(fixture, selector);
    void expect(element.innerText.trim()).toEqual(expectedHint);
}

export function findElementByDataTestId<T>(
    fixture: ComponentFixture<T>,
    id: string,
): HTMLElement {
    return fixture.debugElement.query(By.css(`[data-test-id="${id}"]`))
        .nativeElement;
}

export const routerMockEventSubject = new ReplaySubject<RouterEvent>(1);

export const routerMock = {
    navigate: () => null,
    events: routerMockEventSubject.asObservable(),
    url: '/',
};

export const activeRouteMockQueryParamMap = new Map<string, string>();

export const activeRouteMock = {
    snapshot: {
        queryParamMap: {
            get: (key: string) => activeRouteMockQueryParamMap.get(key),
        },
    },
};
