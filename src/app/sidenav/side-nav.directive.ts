import { Directive, inject, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[side-nav]",
})
export class SideNavDirective {
    public container = inject(ViewContainerRef);
}
