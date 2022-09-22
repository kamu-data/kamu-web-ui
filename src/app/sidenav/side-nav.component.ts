import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-side-nav",
    template: `
        <h2>Single-slot content projection</h2>
        <ng-content></ng-content>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideNavComponent {}
