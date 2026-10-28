/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

/// <reference types="vite/client" />

const FOUND_TEMPLATES = Object.entries(
    import.meta.glob<string>("./**/*.html", { query: "?raw", import: "default", eager: true }),
);
// A coverage run resolves the glob from the project root, so its keys start with this and include files outside the app.
const ROOT_PREFIX = "./src/app/";
const FROM_ROOT = FOUND_TEMPLATES.some(([path]) => path.startsWith(ROOT_PREFIX));

// Every template of the app, as text, keyed by its path relative to this file.
const TEMPLATES: Record<string, string> = Object.fromEntries(
    FROM_ROOT
        ? FOUND_TEMPLATES.filter(([path]) => path.startsWith(ROOT_PREFIX)).map(([path, template]) => [
              `./${path.slice(ROOT_PREFIX.length)}`,
              template,
          ])
        : FOUND_TEMPLATES,
);

/**
 * Form inputs that show no validation message, each with the reason it needs none. An input whose control has a
 * validator but no message keeps the form invalid without telling the user why.
 */
const INPUTS_WITHOUT_MESSAGE: Record<string, string> = {
    "./dataset-create/dataset-create.component.html owner": "a select that starts on the user's own account",
    "./dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.component.html sliceUnit":
        "a select that always holds a unit",
    "./dataset-view/additional-components/dataset-settings-component/tabs/ingest-configuration/flow-retry-policy-form/flow-retry-policy-form.component.html backoffType":
        "a select that always holds a backoff type",
    "./dataset-view/additional-components/overview-component/components/edit-license-modal/edit-license-modal.component.html spdxId":
        "optional, and the backend accepts any text",
    "./dataset-view/additional-components/metadata-component/components/form-components/topics-field/topics-field.component.html item.controls.qos":
        "a select whose empty option means the broker's default",
    "./dataset-view/additional-components/metadata-component/components/form-components/key-value-field/key-value-field.component.html item.controls.value":
        "optional: a header or variable may be empty",
    "./dataset-view/additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.component.html format":
        "a select that always holds a format",
    "./dataset-view/additional-components/metadata-component/components/source-events/steps/prepare-step/prepare-step.component.html subPath":
        "optional, and the backend accepts any path",
};

/**
 * The keys of the text inputs, selects and text areas bound to a reactive form control that no `appFieldError`
 * element reports on, either through the input's template reference or through the same control expression.
 */
function inputsWithoutMessage(path: string, template: string): string[] {
    const errorElements = [...template.matchAll(/<[^>]*\bappFieldError\b[^>]*>/gs)].map(([element]) => element);
    const found: string[] = [];
    for (const [, , attributes] of template.matchAll(/<(input|select|textarea|ng-select)\b([^>]*?)\/?>/gs)) {
        const binding = /formControlName="([\w.]+)"|\[formControl(?:Name)?\]="([^"]+)"/.exec(attributes);
        if (!binding || /type="(checkbox|radio|hidden)"/.test(attributes)) {
            continue;
        }
        const control = binding[1] ?? binding[2];
        const reference = /#(\w+)(?![\w=])/.exec(attributes)?.[1];
        const reported = errorElements.some(
            (element) =>
                (reference !== undefined && element.includes(`[input]="${reference}"`)) ||
                element.includes(`[fieldControl]="${control}"`),
        );
        if (!reported) {
            found.push(`${path} ${control}`);
        }
    }
    return found;
}

describe("Form fields", () => {
    const unreported = Object.entries(TEMPLATES).flatMap(([path, template]) => inputsWithoutMessage(path, template));

    it("should read the templates", () => {
        expect(Object.keys(TEMPLATES).length).toBeGreaterThan(100);
        expect(Object.keys(TEMPLATES)).toContain("./auth/login/login.component.html");
    });

    it("should show a validation message for every form input, or list the input with a reason", () => {
        const offenders = unreported.filter((key) => !(key in INPUTS_WITHOUT_MESSAGE));

        expect(offenders).toEqual([]);
    });

    it("should list only inputs that still show no message", () => {
        const current = new Set(unreported);
        const stale = Object.keys(INPUTS_WITHOUT_MESSAGE).filter((key) => !current.has(key));

        expect(stale).toEqual([]);
    });
});
