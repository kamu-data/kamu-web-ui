import { AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

@Directive({
    selector: "[appAutofocus]",
    standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
    private el = inject(ElementRef);

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.el.nativeElement.focus();
        }, 50);
    }
}
