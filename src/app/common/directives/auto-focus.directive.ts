/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { afterNextRender, Directive, ElementRef, inject } from "@angular/core";

@Directive({
    selector: "[appAutofocus]",
})
export class AutoFocusDirective {
    private el = inject<ElementRef<HTMLElement>>(ElementRef);

    public constructor() {
        afterNextRender(() => this.el.nativeElement.focus());
    }
}
