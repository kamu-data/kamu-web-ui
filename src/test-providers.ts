// Providers the unit-test builder adds to every TestBed (the `providersFile` option in angular.json).

import { EnvironmentProviders, provideCheckNoChangesConfig, Provider } from "@angular/core";

// Exhaustive checkNoChanges also verifies OnPush views that were not marked dirty, so a spec that
// changes component state without re-rendering fails with NG0100 instead of asserting on a stale DOM.
const testProviders: (Provider | EnvironmentProviders)[] = [provideCheckNoChangesConfig({ exhaustive: true })];

export default testProviders;
