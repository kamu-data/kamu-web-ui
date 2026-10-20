// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import "zone.js/testing";

import { NgModule, provideZoneChangeDetection } from "@angular/core";
import { getTestBed } from "@angular/core/testing";
import { BrowserTestingModule, platformBrowserTesting } from "@angular/platform-browser/testing";

// TestBed defaults to zoneless change detection; tests run in the zone-based mode the app uses.
@NgModule({ providers: [provideZoneChangeDetection()] })
class ZoneChangeDetectionTestingModule {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment([BrowserTestingModule, ZoneChangeDetectionTestingModule], platformBrowserTesting(), {
    teardown: { destroyAfterEach: true },
});
