/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DebugElement, reflectComponentType, Type } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconRegistry } from "@angular/material/icon";
import { By, DomSanitizer } from "@angular/platform-browser";
import {
    ActivatedRoute,
    ActivatedRouteSnapshot,
    CanActivateFn,
    Data,
    GuardResult,
    Params,
    RedirectCommand,
    ResolveFn,
    Router,
    RouterEvent,
    RouterStateSnapshot,
    UrlTree,
} from "@angular/router";

import { firstValueFrom, isObservable, ReplaySubject } from "rxjs";

import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import ProjectLinks from "src/app/project-links";

/**
 * Sets an `@Input` of the fixture's component, named by its class field, through
 * `ComponentRef.setInput()`, so `ngOnChanges`, setters and OnPush re-rendering run as in the app.
 * The field name and the value are type-checked against the component; an alias is resolved from
 * the component's metadata. Throws when the field is not an input.
 */
export function setComponentInput<C, K extends keyof C & string>(
    fixture: ComponentFixture<C>,
    name: K,
    value: C[K],
): void {
    const componentType = fixture.componentRef.componentType;
    const input = reflectComponentType(componentType)?.inputs.find((item) => item.propName === name);
    if (!input) {
        throw new Error(`"${name}" is not an @Input of ${componentType.name}`);
    }
    fixture.componentRef.setInput(input.templateName, value);
}

export function findElement<T>(fixture: ComponentFixture<T>, selector: string): DebugElement {
    return fixture.debugElement.query(By.css(selector));
}

/** A DOM element class, such as `HTMLButtonElement`, that a lookup checks its result against. */
export type ElementClass<E extends Element> = new () => E;

function describeNode(node: unknown): string {
    return node instanceof Element ? `<${node.tagName.toLowerCase()}> (${node.constructor.name})` : String(node);
}

function checkElementClass<E extends Element>(node: unknown, elementClass: ElementClass<E>, what: string): E {
    if (node instanceof elementClass) {
        return node;
    }
    throw new Error(`${what} is ${describeNode(node)}, expected ${elementClass.name}`);
}

/**
 * The native element of a `DebugElement`, checked to be an instance of `elementClass`.
 * Throws when it is not.
 */
export function nativeElementOf<E extends Element>(debugElement: DebugElement, elementClass: ElementClass<E>): E {
    return checkElementClass(debugElement.nativeElement, elementClass, `Element ${debugElement.name}`);
}

/**
 * The native element matching a CSS selector, checked to be an `elementClass` (`HTMLElement`
 * by default). Throws when nothing matches or the element is of another class.
 */
export function findNativeElement<T>(fixture: ComponentFixture<T>, selector: string): HTMLElement;
export function findNativeElement<T, E extends Element>(
    fixture: ComponentFixture<T>,
    selector: string,
    elementClass: ElementClass<E>,
): E;
export function findNativeElement<T>(
    fixture: ComponentFixture<T>,
    selector: string,
    elementClass: ElementClass<Element> = HTMLElement,
): Element {
    const debugElement: MaybeNull<DebugElement> = findElement(fixture, selector);
    if (!debugElement) {
        throw new Error(`Element "${selector}" not found`);
    }
    return checkElementClass(debugElement.nativeElement, elementClass, `Element "${selector}"`);
}

export function emitClickOnElement<T>(fixture: ComponentFixture<T>, selector: string): void {
    findNativeElement(fixture, selector).click();
}

export function emitClickOnElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): void {
    getElementByDataTestId(fixture, id).click();
}

/**
 * The element with the given `data-test-id`, checked to be an `elementClass` (`HTMLElement` by
 * default); `undefined` when none is rendered. Throws when the element is of another class.
 */
export function findElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): MaybeUndefined<HTMLElement>;
export function findElementByDataTestId<T, E extends Element>(
    fixture: ComponentFixture<T>,
    id: string,
    elementClass: ElementClass<E>,
): MaybeUndefined<E>;
export function findElementByDataTestId<T>(
    fixture: ComponentFixture<T>,
    id: string,
    elementClass: ElementClass<Element> = HTMLElement,
): MaybeUndefined<Element> {
    const debugElement: MaybeNull<DebugElement> = fixture.debugElement.query(By.css(`[data-test-id="${id}"]`));
    if (!debugElement) {
        return undefined;
    }
    return checkElementClass(debugElement.nativeElement, elementClass, `Element "${id}"`);
}

/**
 * The element with the given `data-test-id`, checked to be an `elementClass` (`HTMLElement` by
 * default). Throws when none is rendered or the element is of another class.
 */
export function getElementByDataTestId<T>(fixture: ComponentFixture<T>, id: string): HTMLElement;
export function getElementByDataTestId<T, E extends Element>(
    fixture: ComponentFixture<T>,
    id: string,
    elementClass: ElementClass<E>,
): E;
export function getElementByDataTestId<T>(
    fixture: ComponentFixture<T>,
    id: string,
    elementClass: ElementClass<Element> = HTMLElement,
): Element {
    const element = findElementByDataTestId(fixture, id, elementClass);
    if (element) {
        return element;
    }
    throw new Error("Element " + id + " not found");
}

export function checkVisible<T>(fixture: ComponentFixture<T>, dataTestId: string, visible: boolean): void {
    const element: MaybeUndefined<HTMLElement> = findElementByDataTestId(fixture, dataTestId);
    if (visible) {
        expect(element).toBeTruthy();
    } else {
        expect(element).toBeUndefined();
    }
}

type SupportedInputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function setFieldElementValue(element: SupportedInputElement, value: string): void {
    element.value = value;
    element.dispatchEvent(new Event("input"));
    // Dispatch an `input` or `change` fake event
    // so Angular form bindings take notice of the change.
    const isSelect = element instanceof HTMLSelectElement;
    const event: Event = new Event(isSelect ? "change" : "input", { bubbles: !isSelect });
    element.dispatchEvent(event);
}

export function setFieldValue<T>(fixture: ComponentFixture<T>, dataTestId: string, value: string): void {
    const element = getElementByDataTestId(fixture, dataTestId);
    if (!(
        element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement ||
        element instanceof HTMLSelectElement
    )) {
        throw new Error(
            `Element "${dataTestId}" is ${describeNode(element)}, expected an input, textarea or select element`,
        );
    }
    setFieldElementValue(element, value);
}

export function checkInputDisabled<T>(fixture: ComponentFixture<T>, dataTestId: string, isDisabled: boolean): void {
    const element = getElementByDataTestId(fixture, dataTestId, HTMLInputElement);
    expect(element.disabled).toEqual(isDisabled);
}

export function checkButtonDisabled<T>(fixture: ComponentFixture<T>, dataTestId: string, isDisabled: boolean): void {
    const element = getElementByDataTestId(fixture, dataTestId, HTMLButtonElement);
    expect(element.disabled).toEqual(isDisabled);
}

export const routerMockEventSubject = new ReplaySubject<RouterEvent>(1);

export const routerMock = {
    navigate: () => null,
    events: routerMockEventSubject.asObservable(),
    url: "/",
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
    return getElementByDataTestId(fixture, id, HTMLInputElement);
}

/**
 * Every rendered instance of a component or directive class in the fixture, in DOM order;
 * an empty array when none is rendered.
 */
export function findComponentInstances<T, C>(fixture: ComponentFixture<T>, directive: Type<C>): C[] {
    return fixture.debugElement.queryAll(By.directive(directive)).map((el) => el.injector.get(directive));
}

/**
 * Finds the instance of a component or directive class matching a predicate, e.g. to
 * disambiguate between multiple instances of the same component (by an @Input value)
 * when CSS/data-test-id selectors can't reach the component instance itself.
 * Without a predicate, the first instance. Throws with a descriptive message if no match is found.
 */
export function findComponentInstance<T, C>(
    fixture: ComponentFixture<T>,
    directive: Type<C>,
    predicate: (instance: C) => boolean = () => true,
): C {
    const match = findComponentInstances(fixture, directive).find(predicate);
    if (!match) throw new Error(`No instance of ${directive.name} matching the given predicate was found`);
    return match;
}

/**
 * The instance of a component or directive class on the element with the given `data-test-id`.
 * Throws when no such element is rendered or the class is not on it.
 */
export function findComponentInstanceByDataTestId<T, C>(
    fixture: ComponentFixture<T>,
    id: string,
    directive: Type<C>,
): C {
    const debugElement: MaybeNull<DebugElement> = fixture.debugElement.query(By.css(`[data-test-id="${id}"]`));
    if (!debugElement) {
        throw new Error(`Element "${id}" not found`);
    }
    const instance = debugElement.injector.get(directive, null, { self: true });
    if (!instance) {
        throw new Error(`Element "${id}" has no ${directive.name}`);
    }
    return instance;
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
        "delete",
        "check",
        "close",
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
        "play_pause",
        "clarify",
        "image",
        "collection-folder",
        "question",
        "video",
        "pdf",
        "shift",
        "txt",
        "json",
        "audio",
        "database",
        "delete",
        "pencil",
    ];
    icons.forEach((icon: string) => {
        matIconRegistry.addSvgIcon(icon, domSanitizer.bypassSecurityTrustResourceUrl(`/assets/svg/${icon}.svg`));
    });
}

/**
 * Asserts that a resolver result redirects to the page-not-found view without changing the URL.
 */
export function expectPageNotFoundRedirect(result: unknown): void {
    expect(result).toBeInstanceOf(RedirectCommand);
    if (result instanceof RedirectCommand) {
        const redirectUrl = TestBed.inject(Router).serializeUrl(result.redirectTo);
        expect(redirectUrl).toEqual(`/${ProjectLinks.URL_PAGE_NOT_FOUND}`);
        expect(result.navigationBehaviorOptions?.skipLocationChange).toBeTrue();
    }
}

/**
 * Asserts that a guard or resolver result redirects to `url`, whether as a `UrlTree` or a
 * `RedirectCommand`.
 */
export function expectRedirectTo(result: unknown, url: string): void {
    const target = result instanceof RedirectCommand ? result.redirectTo : result;
    expect(target).toBeInstanceOf(UrlTree);
    if (target instanceof UrlTree) {
        expect(TestBed.inject(Router).serializeUrl(target)).toEqual(url);
    }
}

export interface RouteSnapshotOptions {
    params?: Params;
    queryParams?: Params;
    data?: Data;
    parent?: ActivatedRouteSnapshot;
    children?: ActivatedRouteSnapshot[];
}

/**
 * A real `ActivatedRouteSnapshot`, as a guard or resolver receives it; `parent` and `children`
 * place it in a route tree.
 */
export function routeSnapshot(options: RouteSnapshotOptions = {}): ActivatedRouteSnapshot {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.params = options.params ?? {};
    snapshot.queryParams = options.queryParams ?? {};
    snapshot.data = options.data ?? {};
    const parent = options.parent ?? null;
    const children = options.children ?? [];
    // Outside a navigation a snapshot has no router state, which these getters read the tree from
    Object.defineProperties(snapshot, {
        parent: { value: parent },
        children: { value: children },
        firstChild: { value: children.length ? children[0] : null },
        root: { value: parent ? parent.root : snapshot },
        pathFromRoot: { value: [...(parent ? parent.pathFromRoot : []), snapshot] },
    });
    return snapshot;
}

/**
 * The router state a guard or resolver receives. The class has no public constructor, and the
 * app's guards and resolvers read only its `url`, so specs share this one stand-in.
 */
export function routerStateSnapshot(url: string = "/"): RouterStateSnapshot {
    return { url } as RouterStateSnapshot;
}

/** Runs a functional `CanActivate` guard in the TestBed injector and waits for its result. */
export async function runCanActivate(
    guard: CanActivateFn,
    route: ActivatedRouteSnapshot = routeSnapshot(),
    url: string = "/",
): Promise<GuardResult> {
    const result = TestBed.runInInjectionContext(() => guard(route, routerStateSnapshot(url)));
    return isObservable(result) ? firstValueFrom(result) : result;
}

/** Runs a functional resolver in the TestBed injector and waits for its value or redirect. */
export async function runResolver<T>(
    resolver: ResolveFn<T>,
    route: ActivatedRouteSnapshot = routeSnapshot(),
    url: string = "/",
): Promise<T | RedirectCommand> {
    const result = TestBed.runInInjectionContext(() => resolver(route, routerStateSnapshot(url)));
    return isObservable(result) ? firstValueFrom(result) : result;
}

/** A `Uint64` value as the API sends it: a string, although codegen types the scalar as a number. */
export function uint64FromApi(value: string): number {
    return value as unknown as number;
}
