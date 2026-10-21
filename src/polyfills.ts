// Loads `$localize` onto the global scope; i18n-tagged templates, such as @ng-bootstrap's, call it.
import "@angular/localize/init";
// The app runs zone-based change detection (`provideZoneChangeDetection` in main.ts).
import "zone.js";
