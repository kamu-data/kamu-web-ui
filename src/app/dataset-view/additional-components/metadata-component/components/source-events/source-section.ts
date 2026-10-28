/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DestroyRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
    AbstractControl,
    FormArray,
    FormControl,
    FormGroup,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms";

import { distinctUntilChanged } from "rxjs";

import { regexValidator } from "@common/validation/text.validators";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

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
    NameValueControls,
    NumberInputControl,
    OptionalControlName,
    PipeStepControls,
    SourceField,
    TextControl,
    TopicControls,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-event-controls.types";
import {
    layoutValidators,
    sourceField,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/source-field";

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

/** Requires a pattern only while the event time comes from the path. */
function patternRequiredFromPath(control: AbstractControl): MaybeNull<ValidationErrors> {
    return control.parent?.get("kind")?.value === EventTimeSourceKind.FROM_PATH ? Validators.required(control) : null;
}

/** The event time group; its pattern is required only while the kind is "From path". */
export function eventTimeControl(): ControlFactory<FormGroup<EventTimeControls>> {
    return () => {
        const group = new FormGroup<EventTimeControls>({
            kind: new FormControl(EventTimeSourceKind.FROM_METADATA, { nonNullable: true }),
            pattern: textControl("", [patternRequiredFromPath, regexValidator()]),
            timestampFormat: textControl(""),
        });
        // The group owns both controls, so the subscription ends with it. `onlySelf` leaves the group's status to
        // `kind`, which updates its parent after this handler; revalidating the group here would re-enable it in
        // the middle of `group.disable()`.
        group.controls.kind.valueChanges.subscribe(() =>
            group.controls.pattern.updateValueAndValidity({ onlySelf: true }),
        );
        return group;
    };
}

export function textControl(value: string, validators: ValidatorFn[] = []): TextControl {
    return new FormControl(value, { nonNullable: true, validators });
}

/** An entry of a list of strings, such as a command argument or a primary key column. */
export function listItemControl(value = ""): TextControl {
    return textControl(value, [Validators.required]);
}

export function nameValueGroup(name = "", value = ""): FormGroup<NameValueControls> {
    return new FormGroup<NameValueControls>({
        name: textControl(name, [Validators.required]),
        value: textControl(value),
    });
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

/** What the step component needs of a section: the form, and the fields of the selected kind. */
export interface SourceStepSection {
    readonly form: FormGroup;
    readonly kindControl: FormControl<string>;
    readonly fields: readonly SourceField[];
}

/**
 * One step of the source event editor: its form holds `kindControl` and the controls the config
 * lists for the kind selected there. Choosing another kind removes the previous kind's controls and
 * adds the new ones, except those named in `kept`, which carry their value from kind to kind. A kept
 * control the selected kind does not list is disabled, so its validators do not block the form.
 */
export class SourceSection<T extends ControlsOf<T>> implements SourceStepSection {
    private builtKind: string;
    private builtFields: readonly SourceField[] = [];

    public constructor(
        public readonly form: FormGroup<T>,
        public readonly kindControl: FormControl<string>,
        private readonly config: JsonFormData<T>,
        private readonly destroyRef: DestroyRef,
        private readonly kept: readonly OptionalControlName<T>[] = [],
    ) {
        this.builtKind = this.kindControl.value;
        this.addControls(this.builtKind);
        this.kindControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((kind: string) => {
            this.switchKind(kind);
        });
    }

    /** The fields of the selected kind, each with the control built for it; a new array only when the kind changes. */
    public get fields(): readonly SourceField[] {
        return this.builtFields;
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
        this.builtFields = this.entries(kind).map((item) => {
            const validators = [
                ...(item.required ? [Validators.required] : []),
                ...layoutValidators(item),
                ...(item.validators ?? []),
            ];
            const created = item.create(validators);
            // A kept control of the same name stays in the form, and the field binds to it.
            this.form.addControl(item.name, created);
            const control = this.form.get(item.name) ?? created;
            const shown = (): boolean => item.shownWhen?.(this.form) ?? true;
            return sourceField(item, control, shown);
        });
        // A control can depend on one listed after it, so these are wired once all of the kind's controls exist.
        this.entries(kind).forEach((item) => {
            const control = this.form.get(item.name);
            item.dependsOn?.forEach((name) => {
                // Revalidating re-emits an unchanged value; skipping it ends the round trip between two controls
                // that depend on each other.
                this.form
                    .get(name)
                    ?.valueChanges.pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
                    .subscribe(() => control?.updateValueAndValidity());
            });
            if (item.dependsOn) {
                control?.updateValueAndValidity();
            }
        });
    }
}
