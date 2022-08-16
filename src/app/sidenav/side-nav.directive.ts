import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: "[side-nav]",
})
export class SideNavDirective {
    public constructor(public container: ViewContainerRef) {}
}
