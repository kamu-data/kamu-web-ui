import { AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

@Directive({
    selector: "[appAutofocus]",
})
export class AutofocusDirective implements AfterViewInit {
    private elementRef = inject(ElementRef);

    ngAfterViewInit(): void {
        setTimeout(() => {
            (this.elementRef.nativeElement as HTMLElement).focus();
        });
    }
}
