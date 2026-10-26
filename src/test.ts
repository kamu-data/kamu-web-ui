// Test entry point (the `main` option of the angular.json test target); the builder finds the specs itself.

import "zone.js/testing";

import { NgModule, provideCheckNoChangesConfig, provideZoneChangeDetection } from "@angular/core";
import { getTestBed } from "@angular/core/testing";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";

// TestBed defaults to zoneless change detection; tests run in the zone-based mode the app uses.
// Exhaustive checkNoChanges also verifies OnPush views that were not marked dirty, so a spec that
// changes component state without re-rendering fails with NG0100 instead of asserting on a stale DOM.
@NgModule({ providers: [provideZoneChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })] })
class TestEnvironmentModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment([BrowserTestingModule, TestEnvironmentModule], platformBrowserTesting(), {
    teardown: { destroyAfterEach: true },
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
});
