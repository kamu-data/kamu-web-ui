/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

// Ordered scenarios, run in one SPA session per data profile. Order matters for the leak checks:
// pages visited after account flows (ng-select height) and after the data-access modal (checkbox
// size, tab ripple) show whether a leaked rule reaches them.
//
// A name is the comparison key: never renumber, append with the next free number. `entry` is the
// catalogue entry (e2e/catalogue) the scenario realises; the entry's profile picks the backend data
// and its tier decides whether the scenario runs.
const DS = "/kamu/population";
const DERIV = "/kamu/population-big";
const PUSH = "/kamu/nested-events";
const ACC = "/kamu/~select";

const ACC_ROOT = "/kamu";
// 11 x 11 rows: more than the 50-row page, so "load more" offers its options.
const CROSS_JOIN = `select a.city, b.city as other_city, a.population from 'kamu/population' a cross join 'kamu/population' b order by 1, 2`;

async function datasetInfo(s, name) {
  const d = await s.gql(
    `query($n: DatasetName!) { datasets { byOwnerAndName(accountName: "kamu", datasetName: $n) {
            metadata { chain { blocks(page: 0, perPage: 1) { nodes { blockHash } } } }
            webhooks { subscriptions { id label } }
            flows { runs { listFlows(perPage: 1) { nodes { flowId } } } } } } }`,
    { n: name },
  );
  return d.datasets.byOwnerAndName;
}
const lastFlowId = async (s, name) => (await datasetInfo(s, name)).flows.runs.listFlows.nodes[0].flowId;
const webhookId = async (s, label) =>
  (await datasetInfo(s, "population")).webhooks.subscriptions.find((w) => w.label === label).id;

async function runQuery(s) {
  await s.click('[data-test-id="runSqlQueryButton"]');
  await s.mustWaitFor("app-load-more .btn-toggle", 30000);
}

async function closeOverlay(s) {
  if (await s.eval(`!!document.querySelector(".cdk-overlay-backdrop")`)) {
    await s.click(".cdk-overlay-backdrop");
  }
  await s.key("Escape");
}

export const SCENARIOS = [
  // Before any leaking component has loaded.
  { name: "01-dataset-create-fresh", entry: "create-dataset", url: "/v/new-dataset", waitFor: "ng-select" },
  {
    name: "02-search",
    entry: "search-datasets",
    url: "/v/search",
    waitFor: "mat-checkbox",
    expectText: "dataset(s) found",
  },
  {
    name: "03-header-user-menu",
    entry: "header-navigation",
    url: "/v/search",
    waitFor: '[data-test-id="openUserInfoBlock"]',
    steps: async (s) => {
      await s.click('[data-test-id="openUserInfoBlock"]');
      await s.waitFor(".mat-mdc-menu-panel");
    },
    after: closeOverlay,
  },
  {
    name: "04-account-datasets",
    entry: "account-datasets",
    url: `${ACC}/datasets`,
    waitFor: "app-dataset-list-item",
    expectText: "Datasets",
  },
  {
    name: "05-account-datasets-page2",
    entry: "account-datasets",
    url: `${ACC}/datasets?page=2`,
    waitFor: "app-dataset-list-item",
  },
  {
    name: "06-overview",
    entry: "dataset-overview",
    url: DS,
    waitFor: "mat-chip, .mat-mdc-standard-chip",
    expectText: "Population root dataset",
  },
  {
    name: "07-data-access-modal-link",
    entry: "data-access",
    url: DS,
    waitFor: '[data-test-id="searchAdditionalButtons"]',
    steps: async (s) => {
      await s.click('[data-test-id="searchAdditionalButtons"]');
      await s.waitFor("app-data-access-modal");
      if (await s.eval(`!!document.querySelector('[data-test-id="action-list-link-tab"]')`)) {
        await s.click('[data-test-id="action-list-link-tab"]');
      }
      await s.waitFor("app-data-access-link-tab mat-checkbox");
    },
    after: async (s) => {
      await s.eval(
        `document.querySelector("ngb-modal-window")?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }))`,
      );
      await s.settle(800);
      if (await s.eval(`!!document.querySelector("ngb-modal-window")`))
        throw new Error("data-access modal did not close");
    },
  },
  // After the data-access modal: its unscoped checkbox rules have leaked, if any.
  {
    name: "08-search-after-modal",
    entry: "search-datasets",
    url: "/v/search",
    waitFor: "mat-checkbox",
    expectText: "dataset(s) found",
  },
  {
    name: "09-settings-general",
    entry: "dataset-general-settings",
    url: `${DS}/settings/general`,
    waitFor: "mat-radio-button",
  },
  {
    name: "10-settings-scheduling",
    entry: "pipeline-triggers",
    url: `${DS}/settings/scheduling`,
    waitFor: "mat-slide-toggle",
  },
  {
    name: "11-settings-ingest-configuration",
    entry: "ingest-and-compaction",
    url: `${DS}/settings/ingest-configuration`,
    waitFor: "mat-checkbox, mat-slide-toggle",
  },
  {
    name: "12-settings-compaction",
    entry: "ingest-and-compaction",
    url: `${DS}/settings/compaction`,
    waitFor: "app-dataset-settings-compacting-tab",
  },
  {
    name: "13-settings-access",
    entry: "collaborators",
    url: `${DS}/settings/access`,
    waitFor: "mat-checkbox",
    expectText: "alice",
  },
  {
    name: "14-settings-transform",
    entry: "pipeline-triggers",
    url: `${DERIV}/settings/transform`,
    waitFor: "mat-slide-toggle",
  },
  {
    name: "15-settings-webhooks",
    entry: "webhooks",
    url: `${DS}/settings/webhooks`,
    waitFor: "app-dataset-settings-webhooks-tab",
    expectText: "demo-hook",
  },
  { name: "16-dataset-flows", entry: "dataset-flows", url: `${DS}/flows`, waitFor: "app-flows-table table" },
  {
    name: "17-dataset-flows-options-menu",
    entry: "dataset-flows",
    url: `${DS}/flows`,
    waitFor: "app-flows-table td button.mat-mdc-menu-trigger",
    steps: async (s) => {
      await s.click("app-flows-table td button.mat-mdc-menu-trigger");
      await s.waitFor(".mat-mdc-menu-panel");
    },
    after: closeOverlay,
  },
  {
    name: "18-dataset-flows-filter-dropdown",
    entry: "dataset-flows",
    url: `${DS}/flows`,
    waitFor: "angular2-multiselect .c-btn",
    steps: async (s) => {
      await s.click("angular2-multiselect .c-btn");
      await s.waitFor("angular2-multiselect .dropdown-list");
    },
    after: async (s) => {
      await s.click("app-flows-table table");
      await s.key("Escape");
    },
  },
  {
    name: "19-metadata-commit-navigator",
    entry: "metadata",
    url: `${PUSH}/metadata`,
    waitFor: "app-commit-navigator ul.pagination, ul.pagination",
  },
  {
    name: "20-schema-editor-nested",
    entry: "source-editors",
    url: `${PUSH}/add-push-source?name=default`,
    waitFor: "app-edit-schema-table, button",
    steps: async (s) => {
      // Step 2 "Read" holds the schema editor.
      await s.eval(`[...document.querySelectorAll("button")].find((b) => b.innerText.trim() === "Next")?.click()`);
      await s.idle();
      await s.waitFor("app-edit-schema-table .dynamic-table");
      // Expand nested struct editors when the table offers it.
      await s.eval(
        `document.querySelectorAll('[data-test-id^="expand"], .expand-struct-button').forEach((b) => b.click())`,
      );
    },
  },
  {
    name: "21-account-flows-processes",
    entry: "account-flows",
    url: `${ACC}/flows?nav=processes`,
    waitFor: "mat-button-toggle-group",
  },
  {
    name: "22-account-flows-processes-triage",
    entry: "account-flows",
    url: `${ACC}/flows?nav=processes&mode=triage`,
    waitFor: "mat-button-toggle-group",
  },
  {
    name: "23-account-flows-processes-custom",
    entry: "account-flows",
    url: `${ACC}/flows?nav=processes&mode=custom`,
    waitFor: "ng-select",
  },
  {
    name: "24-account-flows-activity",
    entry: "account-flows",
    url: `${ACC}/flows?nav=activity`,
    waitFor: "app-flows-table, mat-button-toggle-group",
  },
  // After account flows: its unscoped ng-select rule has leaked, if any.
  { name: "25-dataset-create-after-flows", entry: "create-dataset", url: "/v/new-dataset", waitFor: "ng-select" },
  {
    name: "26-webhook-form-after-flows",
    entry: "webhooks",
    url: `${DS}/settings/webhooks/new`,
    waitFor: "app-webhook-form, form",
  },
  {
    name: "27-access-tokens",
    entry: "access-tokens",
    url: "/v/settings/access-tokens",
    waitFor: "app-access-tokens-tab",
  },
  { name: "28-search-page2", entry: "search-datasets", url: "/v/search?page=2", waitFor: "app-dataset-list-item" },
  // Menus whose content is not only mat-menu-item: they show whether the menu label
  // tokens reach the rest of the menu.
  {
    name: "29-xmenu-query-run-options",
    entry: "dataset-data-tab",
    url: `${DS}/data`,
    waitFor: 'app-query-and-result-sections [data-test-id="searchAdditionalButtons"]:not([disabled])',
    steps: async (s) => {
      await s.click('app-query-and-result-sections [data-test-id="searchAdditionalButtons"]');
      await s.waitFor(".mat-mdc-menu-panel .select-menu-modal");
    },
    after: closeOverlay,
  },
  {
    name: "30-xmenu-dataset-additional-options",
    entry: "dataset-overview",
    url: DS,
    waitFor: '[data-test-id^="additional-options-trigger-"]:not([disabled])',
    steps: async (s) => {
      await s.click('[data-test-id^="additional-options-trigger-"]:not([disabled])');
      await s.waitFor(".mat-mdc-menu-panel .select-menu-modal");
    },
    after: closeOverlay,
  },
  // Ids that change with every seed (block hash, flow ids, webhook ids) are looked up at run time.

  // Overview of a collection: the mat-button-toggle-group view switch and the entries table.
  {
    name: "31-overview-collection",
    entry: "collection",
    url: `${ACC_ROOT}/demo-collection`,
    waitFor: "app-collection-view tr.mat-mdc-row",
    expectText: "population-big",
  },
  {
    name: "32-overview-collection-row-hover",
    entry: "collection",
    url: `${ACC_ROOT}/demo-collection`,
    waitFor: "app-collection-view tr.mat-mdc-row",
    hover: "app-collection-view tr.mat-mdc-row:nth-of-type(2)",
  },
  // A folder: the "up" row, hovered.
  {
    name: "33-overview-collection-folder-up-hover",
    entry: "collection",
    url: `${ACC_ROOT}/demo-collection?pathPrefix=%2Freports%2F`,
    waitFor: "app-collection-view .up-row",
    expectText: "/reports",
    hover: "app-collection-view .up-row",
  },
  {
    name: "34-overview-versioned-file",
    entry: "versioned-file",
    url: `${ACC_ROOT}/demo-file`,
    waitFor: "app-versioned-file-view",
    expectText: "This node does not serve file content directly",
  },
  {
    name: "35-data-tab",
    entry: "dataset-data-tab",
    url: `${DS}/data`,
    waitFor: "app-query-and-result-sections app-dynamic-table",
    expectText: "city1",
  },
  // Metadata tabs; 19 covers the schema tab.
  {
    name: "36-metadata-polling-source",
    entry: "metadata",
    url: `${DS}/metadata/polling-source`,
    waitFor: "app-metadata-polling-source-tab",
    expectText: "seed-data/part*.csv",
  },
  {
    name: "37-metadata-license",
    entry: "metadata",
    url: `${DS}/metadata/license`,
    waitFor: "app-metadata-license-tab",
    expectText: "CC-BY-4.0",
  },
  {
    name: "38-metadata-watermark",
    entry: "metadata",
    url: `${DS}/metadata/watermark`,
    waitFor: "app-metadata-watermark-tab",
    expectText: "Watermark",
  },
  {
    name: "39-metadata-transformation",
    entry: "metadata",
    url: `${DERIV}/metadata/transformation`,
    waitFor: "app-metadata-transformation-tab",
    expectText: "population > 1000",
  },
  {
    name: "40-metadata-push-sources",
    entry: "metadata",
    url: `${PUSH}/metadata/push-sources`,
    waitFor: "app-metadata-push-sources-tab",
    expectText: "default",
  },
  {
    name: "41-history",
    entry: "history",
    url: `${DS}/history`,
    waitFor: "app-history, app-timeline",
    expectText: "new records",
  },
  {
    name: "42-lineage",
    entry: "lineage",
    url: `${DS}/lineage`,
    waitFor: "app-lineage-graph, app-lineage",
    expectText: "population-big",
  },
  {
    name: "43-block",
    entry: "block",
    url: async (s) => `${DS}/block/${(await datasetInfo(s, "population")).metadata.chain.blocks.nodes[0].blockHash}`,
    waitFor: "app-metadata-block, app-block-header",
    expectText: "Block",
  },
  // Flows tab of a root dataset with a polling source and no flow runs.
  {
    name: "44-dataset-flows-no-runs",
    entry: "dataset-flows",
    url: `${ACC_ROOT}/idle-feed/flows`,
    waitFor: '[data-test-id="empty-flow-runs-block"]',
    expectText: "No flow runs",
  },
  {
    name: "45-dataset-flows-failed",
    entry: "dataset-flows",
    url: `${ACC_ROOT}/broken-feed/flows`,
    waitFor: "app-flows-table tr.mat-mdc-row",
    expectText: "failed",
  },
  // Associated channels: the webhooks chip shows the subscriptions table (enabled + paused).
  {
    name: "46-dataset-flows-channels-webhooks",
    entry: "dataset-flows",
    url: `${DS}/flows`,
    waitFor: "app-flows-associated-channels mat-chip-option",
    steps: async (s) => {
      await s.click("app-flows-associated-channels mat-chip-option .mdc-evolution-chip__action");
      await s.mustWaitFor("app-subscriptions-table tr.mat-mdc-row");
    },
    expectText: ["demo-hook", "paused-hook"],
  },
  // A channel toggle switched on: no subscription selected, so the flows table shows its
  // hand-written no-data row.
  {
    name: "47-dataset-flows-channel-toggle-on",
    entry: "dataset-flows",
    url: `${DS}/flows`,
    waitFor: "app-flows-associated-channels mat-chip-option",
    steps: async (s) => {
      // 46 left the chip selected on the same page; select it only if needed.
      if (
        !(await s.eval(
          `!!document.querySelector("app-flows-associated-channels mat-chip-option.mat-mdc-chip-selected")`,
        ))
      ) {
        await s.click("app-flows-associated-channels mat-chip-option .mdc-evolution-chip__action");
      }
      await s.mustWaitFor(
        "app-flows-associated-channels mat-button-toggle-group:not(.mat-button-toggle-group-disabled)",
      );
      await s.click("app-flows-associated-channels mat-button-toggle button");
      await s.mustWaitFor("app-flows-associated-channels .mat-button-toggle-checked");
      await s.mustWaitFor("app-flows-table tr.mat-row td.mat-cell");
    },
    expectText: "No data matching the filter",
  },
  // Flow details: a failed ingest, every tab.
  ...["summary", "history", "logs", "usage", "admin"].map((tab, k) => ({
    name: `${48 + k}-flow-details-failed-${tab}`,
    entry: "flow-details",
    url: async (s) => `${ACC_ROOT}/broken-feed/flow-details/${await lastFlowId(s, "broken-feed")}/${tab}`,
    waitFor: "app-dataset-flow-details",
    expectText: { summary: "FAILED", history: "Flow", logs: "Grafana", usage: "Usage", admin: "Admin" }[tab],
  })),
  {
    name: "53-flow-details-success-summary",
    entry: "flow-details",
    url: async (s) => `${DS}/flow-details/${await lastFlowId(s, "population")}/summary`,
    waitFor: "app-dataset-flow-details",
    expectText: "SUCCESS",
  },
  // Settings tabs not in 09-15.
  {
    name: "54-settings-variables-and-secrets",
    entry: "variables-and-secrets",
    url: `${DS}/settings/variables-and-secrets`,
    waitFor: "app-dataset-settings-secrets-manager-tab td.mat-mdc-cell",
    expectValue: ["API_URL", "API_TOKEN", "eu-west-1"],
  },
  {
    name: "55-settings-webhook-edit",
    entry: "webhooks",
    url: async (s) => `${DS}/settings/webhooks/${await webhookId(s, "demo-hook")}`,
    waitFor: "form",
    expectValue: "demo-hook",
  },
  {
    name: "56-settings-webhook-rotate-secret",
    entry: "webhooks",
    // Opening this page rotates paused-hook's secret (a mutation, invisible on every other
    // page) and shows the new random one: replace it with zeros of the same length.
    url: async (s) => `${DS}/settings/webhooks/rotate-secret/${await webhookId(s, "paused-hook")}`,
    waitFor: "app-dataset-settings-webhooks-tab",
    steps: async (s) => {
      const n = await s.eval(`(() => { let n = 0;
                for (const el of document.querySelectorAll("app-dataset-settings-webhooks-tab input, app-dataset-settings-webhooks-tab *")) {
                    if (el.tagName === "INPUT" && /^[0-9a-f]{32,}$/.test(el.value)) { el.value = "0".repeat(el.value.length); n++; }
                    else if (el.children.length === 0 && /^\\s*[0-9a-f]{32,}\\s*$/.test(el.textContent)) { el.textContent = el.textContent.replace(/[0-9a-f]/g, "0"); n++; }
                } return n; })()`);
      if (!n) throw new Error("rotate-secret: no secret found to mask");
    },
    expectText: "secret",
  },
  // Disabled nested fieldsets under an enabled radio: switch the trigger on (not saved),
  // then pick the option without the nested form.
  {
    name: "57-settings-scheduling-stop-policy-never",
    entry: "pipeline-triggers",
    url: `${DS}/settings/scheduling`,
    waitFor: '[data-test-id="ingest-trigger-updates-enabled"] button.mdc-switch',
    steps: async (s) => {
      await s.click('[data-test-id="ingest-trigger-updates-enabled"] button.mdc-switch');
      await s.click('[data-test-id="stop-policy-never"] input');
      if (
        !(await s.eval(
          `!!document.querySelector('[data-test-id="stop-policy-after-consecutive-failures"]:not(.mat-mdc-radio-disabled) fieldset.nested-fieldset:disabled')`,
        ))
      ) {
        throw new Error("expected a disabled nested fieldset under an enabled radio");
      }
    },
  },
  {
    name: "58-settings-transform-immediate",
    entry: "pipeline-triggers",
    url: `${DERIV}/settings/transform`,
    waitFor: '[data-test-id="transform-trigger-updates-enabled"] button.mdc-switch',
    steps: async (s) => {
      await s.click('[data-test-id="transform-trigger-updates-enabled"] button.mdc-switch');
      await s.click('[data-test-id="batching-rule-immediate"] input');
      await s.click('[data-test-id="stop-policy-never"] input');
      if (
        !(await s.eval(
          `!!document.querySelector('[data-test-id="batching-rule-buffering"]:not(.mat-mdc-radio-disabled) fieldset.nested-fieldset:disabled')`,
        ))
      ) {
        throw new Error("expected a disabled nested fieldset under an enabled radio");
      }
    },
  },
  // Source event editors.
  {
    name: "59-add-polling-source",
    entry: "source-editors",
    url: `${DS}/add-polling-source`,
    waitFor: ".mat-stepper-horizontal",
    expectText: "Fetch",
  },
  {
    name: "60-schema-editor-rows",
    entry: "source-editors",
    url: `${ACC_ROOT}/extra-01/add-push-source?name=default`,
    waitFor: "button",
    steps: async (s) => {
      await s.clickText("button", "Next");
      await s.mustWaitFor("app-edit-schema-table td.mat-column-type .type-view-row");
    },
    expectText: "Int64",
  },
  {
    name: "61-schema-editor-row-hover",
    entry: "source-editors",
    // Same URL as 60, whose stepper is already past the Read step: reload.
    full: true,
    url: `${ACC_ROOT}/extra-01/add-push-source?name=default`,
    waitFor: "button",
    steps: async (s) => {
      await s.clickText("button", "Next");
      await s.mustWaitFor("app-edit-schema-table td.mat-column-type .type-view-row");
    },
    hover: "app-edit-schema-table tr.mat-mdc-row:nth-of-type(2) td.mat-column-type",
  },
  {
    name: "62-set-transform",
    entry: "transform-editor",
    url: `${DERIV}/set-transform`,
    waitFor: "app-set-transform",
    expectText: "Set Transformation",
  },
  // Account settings tabs; 27 covers access tokens.
  {
    name: "63-account-settings-emails",
    entry: "account-settings",
    url: "/v/settings/emails",
    waitFor: "app-emails-tab",
    expectText: "Email address",
  },
  {
    name: "64-account-settings-account",
    entry: "account-settings",
    url: "/v/settings/account",
    waitFor: "app-account-tab",
    expectText: "Change username",
  },
  {
    name: "65-account-settings-storage",
    entry: "account-settings",
    url: "/v/settings/storage",
    waitFor: "app-storage-tab",
    expectText: "Storage",
  },
  {
    name: "66-account-settings-security",
    entry: "account-settings",
    url: "/v/settings/security",
    waitFor: "app-password-and-authentication-tab",
    expectText: "Change password",
  },
  // Account flows: order direction switched off.
  {
    name: "67-account-flows-processes-order-off",
    entry: "account-flows",
    url: `${ACC}/flows?nav=processes`,
    waitFor: ".order-direction-toggle button.mdc-switch",
    steps: async (s) => {
      await s.click(".order-direction-toggle button.mdc-switch");
      if (
        (await s.eval(
          `document.querySelector(".order-direction-toggle button.mdc-switch").getAttribute("aria-checked")`,
        )) !== "false"
      ) {
        throw new Error("order direction toggle is still on");
      }
    },
  },
  {
    name: "68-admin-dashboard",
    entry: "admin-dashboard",
    url: "/v/admin-dashboard",
    waitFor: "app-admin-dashboard",
    expectText: "admin-dashboard",
  },
  {
    name: "69-query-explainer",
    entry: "query-explainer",
    url: "/v/query-explainer",
    waitFor: "app-query-explainer",
    expectText: "Verify commitment",
  },
  {
    name: "70-return-to-cli",
    entry: "cli-login",
    url: "/v/return-to-cli",
    waitFor: "app-return-to-cli",
    expectText: "return back to CLI",
  },
  {
    name: "71-page-not-found",
    entry: "error-pages",
    url: "/v/page-not-found",
    waitFor: "app-page-not-found",
    allowErrorText: true,
  },
  {
    name: "72-unknown-url",
    entry: "error-pages",
    url: "/v/no-such-page/here",
    waitFor: "app-page-not-found",
    allowErrorText: true,
  },
  {
    name: "73-account-whitelist-not-found",
    entry: "error-pages",
    url: "/v/account-whitelist-not-found",
    waitFor: "app-account-whitelist-not-found",
  },
  { name: "74-login-unavailable", entry: "error-pages", url: "/v/login-unavailable", waitFor: "app-login-unavailable" },
  // Query with more than 50 rows: "load more" with its options closed, then opened.
  {
    name: "75-query-load-more-closed",
    entry: "global-query",
    url: `/v/query?sqlQuery=${encodeURIComponent(CROSS_JOIN)}`,
    waitFor: '[data-test-id="runSqlQueryButton"]',
    steps: runQuery,
  },
  {
    name: "76-query-load-more-opened",
    entry: "global-query",
    url: `/v/query?sqlQuery=${encodeURIComponent(CROSS_JOIN)}`,
    waitFor: '[data-test-id="runSqlQueryButton"]',
    steps: async (s) => {
      await runQuery(s);
      await s.click("app-load-more .btn-toggle");
      await s.mustWaitFor("app-load-more .btn-toggle.opened");
    },
  },
  // Narrow viewports: the header below the md breakpoint, collapsed and with the menu open.
  {
    name: "77-narrow-header",
    entry: "header-navigation",
    url: "/v/search",
    viewport: { width: 768, height: 900 },
    waitFor: "app-header",
    expectText: "dataset(s) found",
  },
  {
    name: "78-narrow-header-menu-open",
    entry: "header-navigation",
    url: "/v/search",
    viewport: { width: 600, height: 900 },
    waitFor: '[data-test-id="appHeaderMenuButton"]',
    steps: async (s) => {
      await s.click('[data-test-id="appHeaderMenuButton"]');
    },
  },
  {
    name: "79-account-overview",
    entry: "account-datasets",
    url: `${ACC_ROOT}`,
    waitFor: "app-account",
    expectText: "Datasets",
  },
  // A selected collection row, hovered: only `.mat-mdc-row:hover` gives it the pointer cursor.
  {
    name: "86-overview-collection-selected-row-hover",
    entry: "collection",
    url: `${ACC_ROOT}/demo-collection`,
    waitFor: "app-collection-view tr.mat-mdc-row",
    steps: async (s) => {
      await s.click("app-collection-view tr.mat-mdc-row:nth-of-type(2)");
      await s.waitFor("app-collection-view tr.mat-mdc-row.selected-row");
    },
    hover: "app-collection-view tr.mat-mdc-row.selected-row",
  },
  // A confirmation dialog, cancelled afterwards: its buttons are FORCE_TARGETS with a held :active
  {
    name: "87-modal-dialog",
    entry: "access-tokens",
    url: "/v/settings/access-tokens",
    waitFor: "app-access-tokens-tab .revoke-token-button",
    steps: async (s) => {
      await s.click("app-access-tokens-tab .revoke-token-button");
      await s.mustWaitFor('app-modal-dialog [data-test-id="noButton"]');
    },
    expectText: "Do you want to revoke a token?",
    after: async (s) => {
      await s.click('app-modal-dialog [data-test-id="noButton"]');
      await s.settle(800);
      if (await s.exists("ngb-modal-window")) throw new Error("the revoke dialog did not close");
    },
  },

  // ---- Logged-out phase: the first "anon" scenario clears the session. Keep these last.
  {
    name: "80-anon-login",
    entry: "login",
    phase: "anon",
    url: "/v/login",
    waitFor: "app-login",
    expectText: "Select your Login Method",
  },
  {
    name: "81-anon-search",
    entry: "anonymous-browsing",
    phase: "anon",
    url: "/v/search",
    waitFor: "app-dataset-list-item",
    expectText: "dataset(s) found",
  },
  {
    name: "82-anon-overview",
    entry: "anonymous-browsing",
    phase: "anon",
    url: DS,
    waitFor: "mat-chip, .mat-mdc-standard-chip",
    expectText: "Population root dataset",
  },
  {
    name: "83-anon-page-not-found",
    entry: "error-pages",
    phase: "anon",
    url: "/v/page-not-found",
    waitFor: "app-page-not-found",
    allowErrorText: true,
  },
  // The authenticated guard sends anonymous users to the default page.
  {
    name: "84-anon-dataset-create-redirect",
    entry: "anonymous-browsing",
    phase: "anon",
    url: "/v/new-dataset",
    waitFor: "app-dataset-list-item",
    expectPath: "/v/search",
    expectText: "dataset(s) found",
  },
  {
    name: "85-anon-login-password-form",
    entry: "login",
    phase: "anon",
    url: "/v/login",
    waitFor: "app-login",
    steps: async (s) => {
      await s.clickText("button", "Login with Password");
      await s.mustWaitFor('input[type="password"]');
    },
  },

  // ---- The `empty` profile: a node with accounts and no data
  {
    name: "e01-search-empty",
    entry: "empty-instance",
    url: "/v/search",
    waitFor: "app-dataset-list",
    expectText: "0 dataset(s) found",
  },
  {
    name: "e02-account-datasets-empty",
    entry: "empty-instance",
    url: `${ACC}/datasets`,
    waitFor: "app-datasets-tab",
    expectText: "Datasets list is empty",
  },
  {
    name: "e03-new-dataset-empty",
    entry: "create-first-dataset",
    url: "/v/new-dataset",
    waitFor: "ng-select",
    expectText: "Create a new dataset",
  },
  {
    name: "e04-account-flows-empty",
    entry: "empty-account-flows",
    url: `${ACC}/flows?nav=processes`,
    waitFor: "app-account-flows-processes-subtab",
    expectText: "Total: 0",
  },

  // ---- The `with-data-mt` profile: kamu-cli's image of real published datasets and organizations
  {
    name: "w01-search",
    entry: "browse-published-data",
    url: "/v/search",
    waitFor: "app-dataset-list-item",
    expectText: "82 dataset(s) found",
  },
  {
    name: "w02-organization",
    entry: "browse-published-data",
    url: "/acme.fishing.co",
    waitFor: "app-datasets-tab app-dataset-list-item",
    expectText: "acme.fishing.co/vessels.fuel",
  },
  {
    name: "w03-published-overview",
    entry: "published-dataset-pages",
    url: "/kamu/covid19.canada.daily-cases",
    waitFor: "app-overview app-dynamic-table",
    expectText: "Pan-Canadian COVID-19 daily case counts",
  },
  {
    name: "w04-published-lineage",
    entry: "published-dataset-pages",
    url: "/kamu/covid19.canada.daily-cases/lineage",
    waitFor: "app-lineage-graph",
    expectText: "covid19.ontario.case-details",
  },
  {
    name: "w05-published-data-tab",
    entry: "published-data-query",
    url: "/kamu/covid19.canada.daily-cases/data",
    waitFor: "app-query-and-result-sections app-dynamic-table",
    expectText: "total_daily",
  },
  {
    name: "w06-organization-settings",
    entry: "organization-settings",
    url: "/acme.fishing.co/~select/settings",
    waitFor: "app-settings-tab",
    expectText: "Delete account",
  },
];

// Elements whose :hover / :focus / :active states are snapshotted; the ripple and state-layer
// overrides, and the pressed look of buttons, only show in these states.
export const FORCE_TARGETS = [
  { selector: ".mdc-checkbox", states: ["hover"] },
  { selector: "input.mdc-checkbox__native-control", states: ["focus"] },
  { selector: ".mat-mdc-radio-button .mdc-radio", states: ["hover"] },
  { selector: "input.mdc-radio__native-control", states: ["focus"] },
  { selector: "button.mdc-switch", states: ["hover", "focus"] },
  { selector: ".mat-mdc-menu-item", states: ["hover", "focus"] },
  { selector: ".page-link", states: ["hover", "focus"] },
  { selector: ".mat-button-toggle-button", states: ["hover", "focus"] },
  { selector: ".mat-mdc-chip", states: ["hover"] },
  { selector: "tr.mat-mdc-row", states: ["hover"], max: 2 },
  { selector: ".up-row", states: ["hover"], max: 1 },
  { selector: ".modal__btn", states: ["hover", "focus", "active"] },
  { selector: ".btn", states: ["active"], max: 2 },
  { selector: ".mat-mdc-button-base", states: ["active"], max: 2 },
];
