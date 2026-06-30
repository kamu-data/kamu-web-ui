/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AfterViewInit, Directive, ElementRef, inject } from "@angular/core";

@Directive({
    selector: "[appAutofocus]",
    standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
    private el = inject(ElementRef);

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.el.nativeElement.focus();
        }, 50);
    }
}
