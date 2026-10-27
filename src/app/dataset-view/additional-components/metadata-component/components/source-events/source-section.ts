/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";

import { getValidators } from "@common/helpers/data.helpers";
import { MaybeUndefined } from "@interface/app.types";

import {
    DecompressFormat,
    EventTimeSourceKind,
    PrepareKind,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import {
    ControlFactory,
    ControlsOf,
    DecompressStepControls,
    EventTimeControls,
    JsonFormControl,
    JsonFormData,
    KindControlLayout,
    NameValueControls,
    NumberInputControl,
    OptionalControlName,
    PipeStepControls,
    TextControl,
    TopicControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";

/** A control holding `value` until the user changes it. */
export function valueControl<V>(value: V): ControlFactory<FormControl<V>> {
    return (validators) => new FormControl<V>(value, { nonNullable: true, validators });
}

export function numberInputControl(): ControlFactory<NumberInputControl> {
    return (validators) => new FormControl<NumberInputControl["value"]>("", { nonNullable: true, validators });
}

export function textListControl(): ControlFactory<FormArray<TextControl>> {
    return (validators) => new FormArray<TextControl>([], validators);
}

export function nameValueListControl(): ControlFactory<FormArray<FormGroup<NameValueControls>>> {
    return (validators) => new FormArray<FormGroup<NameValueControls>>([], validators);
}

export function topicListControl(): ControlFactory<FormArray<FormGroup<TopicControls>>> {
    return (validators) => new FormArray<FormGroup<TopicControls>>([], validators);
}

export function eventTimeControl(): ControlFactory<FormGroup<EventTimeControls>> {
    return () =>
        new FormGroup<EventTimeControls>({
            kind: new FormControl(EventTimeSourceKind.FROM_METADATA, { nonNullable: true }),
        });
}

export function textControl(value: string, validators: ValidatorFn[] = []): TextControl {
    return new FormControl(value, { nonNullable: true, validators });
}

/** An entry of a list of strings, such as a command argument or a primary key column. */
export function listItemControl(value = ""): TextControl {
    return textControl(value, [Validators.required]);
}

export function nameValueGroup(name = "", value = ""): FormGroup<NameValueControls> {
    return new FormGroup<NameValueControls>({ name: textControl(name), value: textControl(value) });
}

export function topicGroup(path = "", qos = ""): FormGroup<TopicControls> {
    return new FormGroup<TopicControls>({ path: textControl(path, [Validators.required]), qos: textControl(qos) });
}

export function pipeStepGroup(command = ""): FormGroup<PipeStepControls> {
    return new FormGroup<PipeStepControls>({
        kind: new FormControl(PrepareKind.PIPE, { nonNullable: true }),
        command: textControl(command, [Validators.required]),
    });
}

export function decompressStepGroup(format = DecompressFormat.ZIP, subPath = ""): FormGroup<DecompressStepControls> {
    return new FormGroup<DecompressStepControls>({
        kind: new FormControl(PrepareKind.DECOMPRESS, { nonNullable: true }),
        format: new FormControl(format, { nonNullable: true }),
        subPath: textControl(subPath),
    });
}

/** What the step component needs of a section: the form its fields bind into, and the layout per kind. */
export interface SourceStepSection {
    readonly form: FormGroup;
    readonly kindControl: FormControl<string>;
    layout(kind: string): readonly KindControlLayout[];
}

/**
 * One step of the source event editor: its form holds `kindControl` and the controls the config
 * lists for the kind selected there. Choosing another kind removes the previous kind's controls and
 * adds the new ones, except those named in `kept`, which carry their value from kind to kind. A kept
 * control the selected kind does not list is disabled, so its validators do not block the form.
 */
export class SourceSection<T extends ControlsOf<T>> implements SourceStepSection {
    private builtKind: string;
    private readonly layouts = new Map<string, readonly KindControlLayout[]>();

    public constructor(
        public readonly form: FormGroup<T>,
        public readonly kindControl: FormControl<string>,
        private readonly config: JsonFormData<T>,
        destroyRef: DestroyRef,
        private readonly kept: readonly OptionalControlName<T>[] = [],
    ) {
        this.builtKind = this.kindControl.value;
        this.addControls(this.builtKind);
        this.kindControl.valueChanges.pipe(takeUntilDestroyed(destroyRef)).subscribe((kind: string) => {
            this.switchKind(kind);
        });
    }

    /** The same array for the same kind on every call, so change detection sees no new rows. */
    public layout(kind: string): readonly KindControlLayout[] {
        let rows = this.layouts.get(kind);
        if (!rows) {
            rows = this.entries(kind).map((entry): KindControlLayout => ({ ...entry, kind }));
            this.layouts.set(kind, rows);
        }
        return rows;
    }

    private entries(kind: string): readonly JsonFormControl<T>[] {
        const kindConfig: MaybeUndefined<{ controls: JsonFormControl<T>[] }> = this.config[kind];
        return kindConfig?.controls ?? [];
    }

    /** Rebuilds the controls for `kind`; selecting the kind they were built for again keeps them. */
    private switchKind(kind: string): void {
        if (kind === this.builtKind) {
            return;
        }
        this.builtKind = kind;
        Object.values(this.config).forEach(({ controls }) => {
            controls.forEach((item) => {
                if (!this.kept.includes(item.name)) {
                    this.form.removeControl(item.name);
                }
            });
        });
        this.addControls(kind);
        const listed = this.entries(kind).map(({ name }) => name);
        this.kept.forEach((name) => {
            const control = this.form.controls[name];
            if (listed.includes(name)) {
                control?.enable();
            } else {
                control?.disable();
            }
        });
    }

    private addControls(kind: string): void {
        this.entries(kind).forEach((item) => {
            this.form.addControl(item.name, item.create(getValidators(item.validators)));
        });
    }
}
