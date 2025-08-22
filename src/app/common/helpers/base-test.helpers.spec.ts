/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By, DomSanitizer } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { ActivatedRoute, RouterEvent } from "@angular/router";
import { MaybeNull } from "../../interface/app.types";
import { MatIconRegistry } from "@angular/material/icon";
import ProjectLinks from "src/app/project-links";

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

export function findElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): HTMLElement | undefined {
    const debugElement: MaybeNull<DebugElement> = fixture.debugElement.query(By.css(`[data-test-id="${id}"]`));
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (debugElement) {
        return debugElement.nativeElement as HTMLElement;
    } else {
        return undefined;
    }
}

export function getElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): HTMLElement {
    const element: HTMLElement | undefined = findElementByDataTestId(fixture, id);
    if (element) {
        return element;
    }
    throw new Error("Element " + id + " not found");
}

export function checkVisible<T>(fixture: ComponentFixture<T>, dataTestId: string, visible: boolean): void {
    const element: HTMLElement | undefined = findElementByDataTestId(fixture, dataTestId);
    visible ? expect(element).toBeTruthy() : expect(element).toBeUndefined();
}

type SupportedInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function setFieldElementValue(element: SupportedInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event("input"));
    // Dispatch an `input` or `change` fake event
    // so Angular form bindings take notice of the change.
    const isSelect = element instanceof HTMLSelectElement;
    const event: Event = new Event(isSelect ? "change" : "input", { bubbles: !isSelect } as EventInit);
    element.dispatchEvent(event);
}

export function setFieldValue<T>(fixture: ComponentFixture<T>, dataTestId: string, value: string): void {
    const element: SupportedInputElement = getElementByDataTestId(fixture, dataTestId) as SupportedInputElement;
    expect(element).not.toBeNull();
    setFieldElementValue(element, value);
}

export function checkInputDisabled<T>(fixture: ComponentFixture<T>, dataTestId: string, isDisabled: boolean): void {
    const element: HTMLInputElement | null = getElementByDataTestId(fixture, dataTestId) as HTMLInputElement;
    expect(element).not.toBeNull();
    expect(element.disabled).toEqual(isDisabled);
}

export function checkButtonDisabled<T>(fixture: ComponentFixture<T>, dataTestId: string, isDisabled: boolean): void {
    const element: HTMLButtonElement | null = getElementByDataTestId(fixture, dataTestId) as HTMLButtonElement;
    expect(element).not.toBeNull();
    expect(element.disabled).toEqual(isDisabled);
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

export const snapshotRedirectUrlMock = {
    provide: ActivatedRoute,
    useValue: {
        snapshot: {
            queryParamMap: {
                get: (key: string) => {
                    switch (key) {
                        case ProjectLinks.URL_QUERY_PARAM_REDIRECT_URL:
                            return "";
                    }
                },
            },
        },
    },
};

export function getInputElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): HTMLInputElement {
    return getElementByDataTestId(fixture, id) as HTMLInputElement;
}

export function dispatchInputEvent<T>(fixture: ComponentFixture<T>, id: string, value: string): void {
    const element = getInputElementByDataTestId(fixture, id);
    element.value = value;
    element.dispatchEvent(new Event("input"));
    fixture.detectChanges();
}

export function registerMatSvgIcons(): void {
    const matIconRegistry = TestBed.inject(MatIconRegistry);
    const domSanitizer = TestBed.inject(DomSanitizer);
    const icons: string[] = [
        "history",
        "public-profile",
        "account",
        "appearance",
        "accessibility",
        "notifications",
        "billing",
        "emails",
        "security",
        "organizations",
        "sign-out",
        "notifications-large",
        "verified-commit",
        "git-commit",
        "copy",
        "code-square",
        "pencil",
        "repository",
        "checked",
        "notifications-checked",
        "search",
        "public",
        "private",
        "information",
        "github-logo",
        "show-options",
        "timer",
        "clock",
        "hour-glass",
        "retry",
        "compact",
        "access-token",
        "tree-structure",
        "people",
        "starred",
        "watch",
        "derive",
        "webhook",
        "metamask",
        "ethereum-2",
        "table-chart-outline",
        "receipt_long",
        "timeline",
        "source_notes",
        "enable",
        "add",
        "configuration",
    ];
    icons.forEach((icon: string) => {
        matIconRegistry.addSvgIcon(icon, domSanitizer.bypassSecurityTrustResourceUrl(`/assets/svg/${icon}.svg`));
    });
}
