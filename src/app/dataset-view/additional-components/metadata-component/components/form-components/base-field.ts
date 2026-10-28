/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectorRef, DestroyRef, Directive, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractControl } from "@angular/forms";

/**
 * A field of the source event editor, bound to the control its step built for it. The field re-renders on any
 * change of that control, including one made outside it, such as items an edit service pushes into a list.
 */
@Directive()
export abstract class BaseField<C extends AbstractControl> implements OnInit {
    @Input({ required: true }) public control: C;
    @Input({ required: true }) public label: string;
    @Input({ required: true }) public tooltip: string;
    @Input() public dataTestId?: string;

    protected readonly cdr = inject(ChangeDetectorRef);
    protected readonly destroyRef = inject(DestroyRef);

    public ngOnInit(): void {
        this.control.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cdr.markForCheck());
    }
}
