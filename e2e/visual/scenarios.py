# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

"""Ordered scenarios, run in one SPA session per data profile.

Order matters for the leak checks: pages visited after account flows (ng-select height) and after the
data-access modal (checkbox size, tab ripple) show whether a leaked rule reaches them.

A name is the comparison key: never renumber, append with the next free number. `entry` is the
catalogue entry (e2e/catalogue) the scenario realises; the entry's profile picks the backend data and
its tier decides whether the scenario runs.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from dataclasses import dataclass, field
from typing import TYPE_CHECKING
from urllib.parse import quote

if TYPE_CHECKING:
    from e2e.visual.session import Session

Step = Callable[["Session"], Awaitable[None]]


@dataclass
class Scenario:
    name: str
    entry: str
    url: str | Callable | None = None
    wait_for: str | None = None
    steps: Step | None = None
    after: Step | None = None
    expect_text: list[str] = field(default_factory=list)
    expect_value: list[str] = field(default_factory=list)
    expect_path: str | None = None
    hover: str | None = None
    # A full page load instead of in-app navigation
    full: bool = False
    viewport: dict | None = None
    allow_error_text: bool = False
    # "anon": logged out; these come last
    phase: str | None = None
    settle: float = 1.2
    # The earlier scenario whose leaking styles this one checks: the two always run together
    follows: str | None = None


@dataclass
class ForceTarget:
    """Elements whose :hover / :focus / :active states are snapshotted: the ripple and state-layer
    overrides, and the pressed look of buttons, only show in these states."""

    selector: str
    states: list[str]
    max: int = 3


DS = "/kamu/population"
DERIV = "/kamu/large-cities"
PUSH = "/kamu/nested-events"
ACC = "/kamu/~select"
ACC_ROOT = "/kamu"
# What encodeURIComponent leaves as is, so URLs read as the app writes them
URI_COMPONENT_SAFE = "!'()*"
# The data tab's default query has no order, and the backend returns rows in the order of its data files,
# whose names change with every seeding
DATA_TAB_QUERY = "select * from 'kamu/population' order by offset desc"
DATA_TAB = f"{DS}/data?sqlQuery={quote(DATA_TAB_QUERY, safe=URI_COMPONENT_SAFE)}"
# 11 x 11 rows: more than the 50-row page, so "load more" offers its options
CROSS_JOIN = (
    "select a.city, b.city as other_city, a.population from 'kamu/population' a "
    "cross join 'kamu/population' b order by 1, 2"
)


def dataset_info(s, name: str) -> dict:
    data = s.gql(
        """query($n: DatasetName!) { datasets { byOwnerAndName(accountName: "kamu", datasetName: $n) {
            metadata { chain { blocks(page: 0, perPage: 1) { nodes { blockHash } } } }
            webhooks { subscriptions { id label } }
            flows { runs { listFlows(perPage: 1) { nodes { flowId } } } } } } }""",
        {"n": name},
    )
    return data["datasets"]["byOwnerAndName"]


def last_flow_id(s, name: str) -> str:
    return dataset_info(s, name)["flows"]["runs"]["listFlows"]["nodes"][0]["flowId"]


def webhook_id(s, label: str) -> str:
    subscriptions = dataset_info(s, "population")["webhooks"]["subscriptions"]
    return next(w["id"] for w in subscriptions if w["label"] == label)


async def run_query(s) -> None:
    await s.click('[data-test-id="runSqlQueryButton"]')
    await s.must_wait_for("app-load-more .btn-toggle", 30)


async def close_overlay(s) -> None:
    if await s.exists(".cdk-overlay-backdrop"):
        await s.click(".cdk-overlay-backdrop")
    await s.key("Escape")


async def open_user_menu(s) -> None:
    await s.click('[data-test-id="openUserInfoBlock"]')
    await s.wait_for(".mat-mdc-menu-panel")


async def open_data_access_link_tab(s) -> None:
    await s.click('[data-test-id="searchAdditionalButtons"]')
    await s.wait_for("app-data-access-modal")
    if await s.exists('[data-test-id="action-list-link-tab"]'):
        await s.click('[data-test-id="action-list-link-tab"]')
    await s.wait_for("app-data-access-link-tab mat-checkbox")


async def close_data_access(s) -> None:
    await s.eval(
        'document.querySelector("ngb-modal-window")?.dispatchEvent('
        'new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true }))'
    )
    await s.settle(0.8)
    if await s.exists("ngb-modal-window"):
        raise RuntimeError("data-access modal did not close")


async def open_flows_options_menu(s) -> None:
    await s.click("app-flows-table td button.mat-mdc-menu-trigger")
    await s.wait_for(".mat-mdc-menu-panel")


async def open_flows_filter(s) -> None:
    await s.click("angular2-multiselect .c-btn")
    await s.wait_for("angular2-multiselect .dropdown-list")


async def close_flows_filter(s) -> None:
    await s.click("app-flows-table table")
    await s.key("Escape")


async def schema_editor_nested(s) -> None:
    # Step 2 "Read" holds the schema editor
    await s.eval('[...document.querySelectorAll("button")].find((b) => b.innerText.trim() === "Next")?.click()')
    await s.idle()
    await s.wait_for("app-edit-schema-table .dynamic-table")
    # Expand nested struct editors when the table offers it
    await s.eval(
        "document.querySelectorAll('[data-test-id^=\"expand\"], .expand-struct-button').forEach((b) => b.click())"
    )


async def open_query_run_options(s) -> None:
    # The editor loads lazily, after the button is ready; a fast capture would catch its loading bar
    await s.must_wait_for("app-query-and-result-sections .monaco-editor .view-line")
    await s.click('app-query-and-result-sections [data-test-id="searchAdditionalButtons"]')
    await s.wait_for(".mat-mdc-menu-panel .select-menu-modal")


async def open_dataset_options(s) -> None:
    await s.click('[data-test-id^="additional-options-trigger-"]:not([disabled])')
    await s.wait_for(".mat-mdc-menu-panel .select-menu-modal")


async def select_webhooks_channel(s) -> None:
    await s.click("app-flows-associated-channels mat-chip-option .mdc-evolution-chip__action")
    await s.must_wait_for("app-subscriptions-table tr.mat-mdc-row")


async def switch_channel_toggle_on(s) -> None:
    # 46 left the chip selected on the same page; select it only if needed
    if not await s.exists("app-flows-associated-channels mat-chip-option.mat-mdc-chip-selected"):
        await s.click("app-flows-associated-channels mat-chip-option .mdc-evolution-chip__action")
    await s.must_wait_for(
        "app-flows-associated-channels mat-button-toggle-group:not(.mat-button-toggle-group-disabled)"
    )
    await s.click("app-flows-associated-channels mat-button-toggle button")
    await s.must_wait_for("app-flows-associated-channels .mat-button-toggle-checked")
    await s.must_wait_for("app-flows-table tr.mat-row td.mat-cell")


async def expect_rotated_secret(s) -> None:
    """The page shows the new secret; the snapshot masks hide its value."""
    shown = await s.eval(r"""[...document.querySelectorAll("app-dataset-settings-webhooks-tab input, app-dataset-settings-webhooks-tab *")]
        .some((el) => (el.tagName === "INPUT" ? /^[0-9a-f]{32,}$/.test(el.value)
            : el.children.length === 0 && /^\s*[0-9a-f]{32,}\s*$/.test(el.textContent)))""")
    if not shown:
        raise RuntimeError("rotate-secret: no secret shown")


def switch_on_with_nested_disabled(trigger: str, options: list[str], radio: str):
    """Switches a trigger on (not saved), picks the options without a nested form, and checks that the
    nested fieldset under the other, enabled radio is disabled."""

    async def steps(s) -> None:
        await s.click(f'[data-test-id="{trigger}"] button.mdc-switch')
        for option in options:
            await s.click(f'[data-test-id="{option}"] input')
        selector = f'[data-test-id="{radio}"]:not(.mat-mdc-radio-disabled) fieldset.nested-fieldset:disabled'
        if not await s.exists(selector):
            raise RuntimeError("expected a disabled nested fieldset under an enabled radio")

    return steps


async def schema_editor_rows(s) -> None:
    await s.click_text("button", "Next")
    await s.must_wait_for("app-edit-schema-table td.mat-column-type .type-view-row")


async def switch_order_off(s) -> None:
    await s.click(".order-direction-toggle button.mdc-switch")
    checked = await s.eval(
        'document.querySelector(".order-direction-toggle button.mdc-switch").getAttribute("aria-checked")'
    )
    if checked != "false":
        raise RuntimeError("order direction toggle is still on")


async def open_load_more_options(s) -> None:
    await run_query(s)
    await s.click("app-load-more .btn-toggle")
    await s.must_wait_for("app-load-more .btn-toggle.opened")


async def open_header_menu(s) -> None:
    await s.click('[data-test-id="appHeaderMenuButton"]')


async def select_collection_row(s) -> None:
    await s.click("app-collection-view tr.mat-mdc-row:nth-of-type(2)")
    await s.wait_for("app-collection-view tr.mat-mdc-row.selected-row")


async def open_revoke_dialog(s) -> None:
    await s.click("app-access-tokens-tab .revoke-token-button")
    await s.must_wait_for('modal-dialog [data-test-id="noButton"]')


async def cancel_revoke_dialog(s) -> None:
    await s.click('modal-dialog [data-test-id="noButton"]')
    await s.settle(0.8)
    if await s.exists("ngb-modal-window"):
        raise RuntimeError("the revoke dialog did not close")


async def open_password_form(s) -> None:
    await s.click_text("button", "Login with Password")
    await s.must_wait_for('input[type="password"]')


FLOW_DETAILS_TEXT = {"summary": "FAILED", "history": "Flow", "logs": "Grafana", "usage": "Usage", "admin": "Admin"}


def failed_flow_details(tab: str, number: int) -> Scenario:
    return Scenario(
        f"{number}-flow-details-failed-{tab}",
        "flow-details",
        url=lambda s: f"{ACC_ROOT}/failed-ingest/flow-details/{last_flow_id(s, 'failed-ingest')}/{tab}",
        wait_for="app-dataset-flow-details",
        expect_text=[FLOW_DETAILS_TEXT[tab]],
    )


SCENARIOS: list[Scenario] = [
    # Before any leaking component has loaded
    Scenario("01-dataset-create-fresh", "create-dataset", url="/v/new-dataset", wait_for="ng-select"),
    Scenario(
        "02-search", "search-datasets", url="/v/search", wait_for="mat-checkbox", expect_text=["dataset(s) found"]
    ),
    Scenario(
        "03-header-user-menu",
        "header-navigation",
        url="/v/search",
        wait_for='[data-test-id="openUserInfoBlock"]',
        steps=open_user_menu,
        after=close_overlay,
    ),
    Scenario(
        "04-account-datasets",
        "account-datasets",
        url=f"{ACC}/datasets",
        wait_for="app-dataset-list-item",
        expect_text=["Datasets"],
    ),
    Scenario(
        "05-account-datasets-page2", "account-datasets", url=f"{ACC}/datasets?page=2", wait_for="app-dataset-list-item"
    ),
    Scenario(
        "06-overview",
        "dataset-overview",
        url=DS,
        wait_for="mat-chip, .mat-mdc-standard-chip",
        expect_text=["Population root dataset"],
    ),
    Scenario(
        "07-data-access-modal-link",
        "data-access",
        url=DS,
        wait_for='[data-test-id="searchAdditionalButtons"]',
        steps=open_data_access_link_tab,
        after=close_data_access,
    ),
    # After the data-access modal: its unscoped checkbox rules have leaked, if any
    Scenario(
        "08-search-after-modal",
        "search-datasets",
        url="/v/search",
        wait_for="mat-checkbox",
        expect_text=["dataset(s) found"],
        follows="07-data-access-modal-link",
    ),
    Scenario(
        "09-settings-general", "dataset-general-settings", url=f"{DS}/settings/general", wait_for="mat-radio-button"
    ),
    Scenario(
        "10-settings-scheduling", "pipeline-triggers", url=f"{DS}/settings/scheduling", wait_for="mat-slide-toggle"
    ),
    Scenario(
        "11-settings-ingest-configuration",
        "ingest-and-compaction",
        url=f"{DS}/settings/ingest-configuration",
        wait_for="mat-checkbox, mat-slide-toggle",
    ),
    Scenario(
        "12-settings-compaction",
        "ingest-and-compaction",
        url=f"{DS}/settings/compaction",
        wait_for="app-dataset-settings-compacting-tab",
    ),
    Scenario(
        "13-settings-access",
        "collaborators",
        url=f"{DS}/settings/access",
        wait_for="mat-checkbox",
        expect_text=["alice"],
    ),
    Scenario(
        "14-settings-transform", "pipeline-triggers", url=f"{DERIV}/settings/transform", wait_for="mat-slide-toggle"
    ),
    Scenario(
        "15-settings-webhooks",
        "webhooks",
        url=f"{DS}/settings/webhooks",
        wait_for="app-dataset-settings-webhooks-tab",
        expect_text=["demo-hook"],
    ),
    Scenario("16-dataset-flows", "dataset-flows", url=f"{DS}/flows", wait_for="app-flows-table table"),
    Scenario(
        "17-dataset-flows-options-menu",
        "dataset-flows",
        url=f"{DS}/flows",
        wait_for="app-flows-table td button.mat-mdc-menu-trigger",
        steps=open_flows_options_menu,
        after=close_overlay,
    ),
    Scenario(
        "18-dataset-flows-filter-dropdown",
        "dataset-flows",
        url=f"{DS}/flows",
        wait_for="angular2-multiselect .c-btn",
        steps=open_flows_filter,
        after=close_flows_filter,
    ),
    Scenario(
        "19-metadata-commit-navigator",
        "metadata",
        url=f"{PUSH}/metadata",
        # The pager, or on commits before it the pagination component, which sat outside the navigator
        wait_for="app-commit-navigator .commit-pager, ul.pagination",
    ),
    Scenario(
        "20-schema-editor-nested",
        "source-editors",
        url=f"{PUSH}/add-push-source?name=default",
        wait_for="app-edit-schema-table, button",
        steps=schema_editor_nested,
    ),
    Scenario(
        "21-account-flows-processes",
        "account-flows",
        url=f"{ACC}/flows?nav=processes",
        wait_for="mat-button-toggle-group",
    ),
    Scenario(
        "22-account-flows-processes-triage",
        "account-flows",
        url=f"{ACC}/flows?nav=processes&mode=triage",
        wait_for="mat-button-toggle-group",
    ),
    Scenario(
        "23-account-flows-processes-custom",
        "account-flows",
        url=f"{ACC}/flows?nav=processes&mode=custom",
        wait_for="ng-select",
    ),
    Scenario(
        "24-account-flows-activity",
        "account-flows",
        url=f"{ACC}/flows?nav=activity",
        wait_for="app-flows-table, mat-button-toggle-group",
    ),
    # After account flows: its unscoped ng-select rule has leaked, if any
    Scenario(
        "25-dataset-create-after-flows",
        "create-dataset",
        url="/v/new-dataset",
        wait_for="ng-select",
        follows="23-account-flows-processes-custom",
    ),
    Scenario(
        "26-webhook-form-after-flows",
        "webhooks",
        url=f"{DS}/settings/webhooks/new",
        wait_for="app-webhook-form, form",
        follows="23-account-flows-processes-custom",
    ),
    Scenario("27-access-tokens", "access-tokens", url="/v/settings/access-tokens", wait_for="app-access-tokens-tab"),
    Scenario("28-search-page2", "search-datasets", url="/v/search?page=2", wait_for="app-dataset-list-item"),
    # Menus whose content is not only mat-menu-item: they show whether the menu label tokens reach the
    # rest of the menu
    Scenario(
        "29-xmenu-query-run-options",
        "dataset-data-tab",
        url=DATA_TAB,
        wait_for='app-query-and-result-sections [data-test-id="searchAdditionalButtons"]:not([disabled])',
        steps=open_query_run_options,
        after=close_overlay,
    ),
    Scenario(
        "30-xmenu-dataset-additional-options",
        "dataset-overview",
        url=DS,
        wait_for='[data-test-id^="additional-options-trigger-"]:not([disabled])',
        steps=open_dataset_options,
        after=close_overlay,
    ),
    # Ids that change with every seed (block hash, flow ids, webhook ids) are looked up at run time.
    # Overview of a collection: the mat-button-toggle-group view switch and the entries table.
    Scenario(
        "31-overview-collection",
        "collection",
        url=f"{ACC_ROOT}/city-reports",
        wait_for="app-collection-view tr.mat-mdc-row",
        expect_text=["large-cities"],
    ),
    Scenario(
        "32-overview-collection-row-hover",
        "collection",
        url=f"{ACC_ROOT}/city-reports",
        wait_for="app-collection-view tr.mat-mdc-row",
        hover="app-collection-view tr.mat-mdc-row:nth-of-type(2)",
    ),
    # A folder: the "up" row, hovered
    Scenario(
        "33-overview-collection-folder-up-hover",
        "collection",
        url=f"{ACC_ROOT}/city-reports?pathPrefix=%2Freports%2F",
        wait_for="app-collection-view .up-row",
        expect_text=["/reports"],
        hover="app-collection-view .up-row",
    ),
    Scenario(
        "34-overview-versioned-file",
        "versioned-file",
        url=f"{ACC_ROOT}/release-notes",
        wait_for="app-versioned-file-view",
        expect_text=["This node does not serve file content directly"],
    ),
    Scenario(
        "35-data-tab",
        "dataset-data-tab",
        url=DATA_TAB,
        wait_for="app-query-and-result-sections app-dynamic-table",
        expect_text=["city1"],
    ),
    # Metadata tabs; 19 covers the schema tab
    Scenario(
        "36-metadata-polling-source",
        "metadata",
        url=f"{DS}/metadata/polling-source",
        wait_for="app-metadata-polling-source-tab",
        expect_text=["seed-data/population-*.csv"],
    ),
    Scenario(
        "37-metadata-license",
        "metadata",
        url=f"{DS}/metadata/license",
        wait_for="app-metadata-license-tab",
        expect_text=["CC-BY-4.0"],
    ),
    Scenario(
        "38-metadata-watermark",
        "metadata",
        url=f"{DS}/metadata/watermark",
        wait_for="app-metadata-watermark-tab",
        expect_text=["Watermark"],
    ),
    Scenario(
        "39-metadata-transformation",
        "metadata",
        url=f"{DERIV}/metadata/transformation",
        wait_for="app-metadata-transformation-tab",
        expect_text=["population > 1000"],
    ),
    Scenario(
        "40-metadata-push-sources",
        "metadata",
        url=f"{PUSH}/metadata/push-sources",
        wait_for="app-metadata-push-sources-tab",
        expect_text=["default"],
    ),
    Scenario(
        "41-history", "history", url=f"{DS}/history", wait_for="app-history, app-timeline", expect_text=["new records"]
    ),
    Scenario(
        "42-lineage",
        "lineage",
        url=f"{DS}/lineage",
        wait_for="app-lineage-graph, app-lineage",
        expect_text=["large-cities"],
    ),
    Scenario(
        "43-block",
        "block",
        url=lambda s: (
            f"{DS}/block/{dataset_info(s, 'population')['metadata']['chain']['blocks']['nodes'][0]['blockHash']}"
        ),
        wait_for="app-metadata-block, app-block-header",
        expect_text=["Block"],
    ),
    # Flows tab of a root dataset with a polling source and no flow runs
    Scenario(
        "44-dataset-flows-no-runs",
        "dataset-flows",
        url=f"{ACC_ROOT}/never-run/flows",
        wait_for='[data-test-id="empty-flow-runs-block"]',
        expect_text=["No flow runs"],
    ),
    Scenario(
        "45-dataset-flows-failed",
        "dataset-flows",
        url=f"{ACC_ROOT}/failed-ingest/flows",
        wait_for="app-flows-table tr.mat-mdc-row",
        expect_text=["failed"],
    ),
    # Associated channels: the webhooks chip shows the subscriptions table (enabled + paused)
    Scenario(
        "46-dataset-flows-channels-webhooks",
        "dataset-flows",
        url=f"{DS}/flows",
        wait_for="app-flows-associated-channels mat-chip-option",
        steps=select_webhooks_channel,
        expect_text=["demo-hook", "paused-hook"],
    ),
    # A channel toggle switched on: no subscription selected, so the flows table shows its hand-written
    # no-data row
    Scenario(
        "47-dataset-flows-channel-toggle-on",
        "dataset-flows",
        url=f"{DS}/flows",
        wait_for="app-flows-associated-channels mat-chip-option",
        steps=switch_channel_toggle_on,
        expect_text=["No data matching the filter"],
    ),
    # Flow details: a failed ingest, every tab
    *[failed_flow_details(tab, 48 + k) for k, tab in enumerate(FLOW_DETAILS_TEXT)],
    Scenario(
        "53-flow-details-success-summary",
        "flow-details",
        url=lambda s: f"{DS}/flow-details/{last_flow_id(s, 'population')}/summary",
        wait_for="app-dataset-flow-details",
        expect_text=["SUCCESS"],
    ),
    # Settings tabs not in 09-15
    Scenario(
        "54-settings-variables-and-secrets",
        "variables-and-secrets",
        url=f"{DS}/settings/variables-and-secrets",
        wait_for="app-dataset-settings-secrets-manager-tab td.mat-mdc-cell",
        expect_value=["API_URL", "API_TOKEN", "eu-west-1"],
    ),
    Scenario(
        "55-settings-webhook-edit",
        "webhooks",
        url=lambda s: f"{DS}/settings/webhooks/{webhook_id(s, 'demo-hook')}",
        wait_for="form",
        expect_value=["demo-hook"],
    ),
    # Opening this page rotates paused-hook's secret (a mutation, invisible on every other page) and
    # shows the new random one, which the snapshot masks hide
    Scenario(
        "56-settings-webhook-rotate-secret",
        "webhooks",
        url=lambda s: f"{DS}/settings/webhooks/rotate-secret/{webhook_id(s, 'paused-hook')}",
        wait_for="app-dataset-settings-webhooks-tab",
        steps=expect_rotated_secret,
        expect_text=["secret"],
    ),
    # Disabled nested fieldsets under an enabled radio: switch the trigger on (not saved), then pick the
    # option without the nested form
    Scenario(
        "57-settings-scheduling-stop-policy-never",
        "pipeline-triggers",
        url=f"{DS}/settings/scheduling",
        wait_for='[data-test-id="ingest-trigger-updates-enabled"] button.mdc-switch',
        steps=switch_on_with_nested_disabled(
            "ingest-trigger-updates-enabled", ["stop-policy-never"], "stop-policy-after-consecutive-failures"
        ),
    ),
    Scenario(
        "58-settings-transform-immediate",
        "pipeline-triggers",
        url=f"{DERIV}/settings/transform",
        wait_for='[data-test-id="transform-trigger-updates-enabled"] button.mdc-switch',
        steps=switch_on_with_nested_disabled(
            "transform-trigger-updates-enabled",
            ["batching-rule-immediate", "stop-policy-never"],
            "batching-rule-buffering",
        ),
    ),
    # Source event editors
    Scenario(
        "59-add-polling-source",
        "source-editors",
        url=f"{DS}/add-polling-source",
        wait_for=".mat-stepper-horizontal",
        expect_text=["Fetch"],
    ),
    Scenario(
        "60-schema-editor-rows",
        "source-editors",
        url=f"{ACC_ROOT}/air-quality-readings/add-push-source?name=default",
        wait_for="button",
        steps=schema_editor_rows,
        expect_text=["Int64"],
    ),
    # Same URL as 60, whose stepper is already past the Read step: reload
    Scenario(
        "61-schema-editor-row-hover",
        "source-editors",
        full=True,
        url=f"{ACC_ROOT}/air-quality-readings/add-push-source?name=default",
        wait_for="button",
        steps=schema_editor_rows,
        hover="app-edit-schema-table tr.mat-mdc-row:nth-of-type(2) td.mat-column-type",
    ),
    Scenario(
        "62-set-transform",
        "transform-editor",
        url=f"{DERIV}/set-transform",
        wait_for="app-set-transform",
        expect_text=["Set Transformation"],
    ),
    # Account settings tabs; 27 covers access tokens
    Scenario(
        "63-account-settings-emails",
        "account-settings",
        url="/v/settings/emails",
        wait_for="app-emails-tab",
        expect_text=["Email address"],
    ),
    Scenario(
        "64-account-settings-account",
        "account-settings",
        url="/v/settings/account",
        wait_for="app-account-tab",
        expect_text=["Change username"],
    ),
    Scenario(
        "65-account-settings-storage",
        "account-settings",
        url="/v/settings/storage",
        wait_for="app-storage-tab",
        expect_text=["Storage"],
    ),
    Scenario(
        "66-account-settings-security",
        "account-settings",
        url="/v/settings/security",
        wait_for="app-password-and-authentication-tab",
        expect_text=["Change password"],
    ),
    # Account flows: order direction switched off
    Scenario(
        "67-account-flows-processes-order-off",
        "account-flows",
        url=f"{ACC}/flows?nav=processes",
        wait_for=".order-direction-toggle button.mdc-switch",
        steps=switch_order_off,
    ),
    Scenario(
        "68-admin-dashboard",
        "admin-dashboard",
        url="/v/admin-dashboard",
        wait_for="app-admin-dashboard",
        expect_text=["admin-dashboard"],
    ),
    Scenario(
        "69-query-explainer",
        "query-explainer",
        url="/v/query-explainer",
        wait_for="app-query-explainer",
        expect_text=["Verify commitment"],
    ),
    Scenario(
        "70-return-to-cli",
        "cli-login",
        url="/v/return-to-cli",
        wait_for="app-return-to-cli",
        expect_text=["return back to CLI"],
    ),
    Scenario(
        "71-page-not-found",
        "error-pages",
        url="/v/page-not-found",
        wait_for="app-page-not-found",
        allow_error_text=True,
    ),
    Scenario(
        "72-unknown-url",
        "error-pages",
        url="/v/no-such-page/here",
        wait_for="app-page-not-found",
        allow_error_text=True,
    ),
    Scenario(
        "73-account-whitelist-not-found",
        "error-pages",
        url="/v/account-whitelist-not-found",
        wait_for="app-account-whitelist-not-found",
    ),
    Scenario("74-login-unavailable", "error-pages", url="/v/login-unavailable", wait_for="app-login-unavailable"),
    # Query with more than 50 rows: "load more" with its options closed, then opened
    Scenario(
        "75-query-load-more-closed",
        "global-query",
        url=f"/v/query?sqlQuery={quote(CROSS_JOIN, safe=URI_COMPONENT_SAFE)}",
        wait_for='[data-test-id="runSqlQueryButton"]',
        steps=run_query,
    ),
    Scenario(
        "76-query-load-more-opened",
        "global-query",
        url=f"/v/query?sqlQuery={quote(CROSS_JOIN, safe=URI_COMPONENT_SAFE)}",
        wait_for='[data-test-id="runSqlQueryButton"]',
        steps=open_load_more_options,
    ),
    # Narrow viewports: the header below the md breakpoint, collapsed and with the menu open
    Scenario(
        "77-narrow-header",
        "header-navigation",
        url="/v/search",
        viewport={"width": 768, "height": 900},
        wait_for="app-header",
        expect_text=["dataset(s) found"],
    ),
    Scenario(
        "78-narrow-header-menu-open",
        "header-navigation",
        url="/v/search",
        viewport={"width": 600, "height": 900},
        wait_for='[data-test-id="appHeaderMenuButton"]',
        steps=open_header_menu,
    ),
    Scenario("79-account-overview", "account-datasets", url=ACC_ROOT, wait_for="app-account", expect_text=["Datasets"]),
    # A selected collection row, hovered: only `.mat-mdc-row:hover` gives it the pointer cursor
    Scenario(
        "86-overview-collection-selected-row-hover",
        "collection",
        url=f"{ACC_ROOT}/city-reports",
        wait_for="app-collection-view tr.mat-mdc-row",
        steps=select_collection_row,
        hover="app-collection-view tr.mat-mdc-row.selected-row",
    ),
    # A confirmation dialog, cancelled afterwards: its buttons are FORCE_TARGETS with a held :active
    Scenario(
        "87-modal-dialog",
        "access-tokens",
        url="/v/settings/access-tokens",
        wait_for="app-access-tokens-tab .revoke-token-button",
        steps=open_revoke_dialog,
        expect_text=["Do you want to revoke a token?"],
        after=cancel_revoke_dialog,
    ),
    # ---- Logged-out phase: the first "anon" scenario clears the session. Keep these last.
    Scenario(
        "80-anon-login",
        "login",
        phase="anon",
        url="/v/login",
        wait_for="app-login",
        expect_text=["Select your Login Method"],
    ),
    Scenario(
        "81-anon-search",
        "anonymous-browsing",
        phase="anon",
        url="/v/search",
        wait_for="app-dataset-list-item",
        expect_text=["dataset(s) found"],
    ),
    Scenario(
        "82-anon-overview",
        "anonymous-browsing",
        phase="anon",
        url=DS,
        wait_for="mat-chip, .mat-mdc-standard-chip",
        expect_text=["Population root dataset"],
    ),
    Scenario(
        "83-anon-page-not-found",
        "error-pages",
        phase="anon",
        url="/v/page-not-found",
        wait_for="app-page-not-found",
        allow_error_text=True,
    ),
    # The authenticated guard sends anonymous users to the default page
    Scenario(
        "84-anon-dataset-create-redirect",
        "anonymous-browsing",
        phase="anon",
        url="/v/new-dataset",
        wait_for="app-dataset-list-item",
        expect_path="/v/search",
        expect_text=["dataset(s) found"],
    ),
    Scenario(
        "85-anon-login-password-form",
        "login",
        phase="anon",
        url="/v/login",
        wait_for="app-login",
        steps=open_password_form,
    ),
    # ---- The `empty` profile: a node with accounts and no data
    Scenario(
        "e01-search-empty",
        "empty-instance",
        url="/v/search",
        wait_for="app-dataset-list",
        expect_text=["0 dataset(s) found"],
    ),
    Scenario(
        "e02-account-datasets-empty",
        "empty-instance",
        url=f"{ACC}/datasets",
        wait_for="app-datasets-tab",
        expect_text=["Datasets list is empty"],
    ),
    Scenario(
        "e03-new-dataset-empty",
        "create-first-dataset",
        url="/v/new-dataset",
        wait_for="ng-select",
        expect_text=["Create a new dataset"],
    ),
    Scenario(
        "e04-account-flows-empty",
        "empty-account-flows",
        url=f"{ACC}/flows?nav=processes",
        wait_for="app-account-flows-processes-subtab",
        expect_text=["Total: 0"],
    ),
    # ---- The `with-data-mt` profile: kamu-cli's image of real published datasets and organizations
    Scenario(
        "w01-search",
        "browse-published-data",
        url="/v/search",
        wait_for="app-dataset-list-item",
        expect_text=["82 dataset(s) found"],
    ),
    Scenario(
        "w02-organization",
        "browse-published-data",
        url="/acme.fishing.co",
        wait_for="app-datasets-tab app-dataset-list-item",
        expect_text=["acme.fishing.co/vessels.fuel"],
    ),
    Scenario(
        "w03-published-overview",
        "published-dataset-pages",
        url="/kamu/covid19.canada.daily-cases",
        wait_for="app-overview app-dynamic-table",
        expect_text=["Pan-Canadian COVID-19 daily case counts"],
    ),
    Scenario(
        "w04-published-lineage",
        "published-dataset-pages",
        url="/kamu/covid19.canada.daily-cases/lineage",
        wait_for="app-lineage-graph",
        expect_text=["covid19.ontario.case-details"],
    ),
    Scenario(
        "w05-published-data-tab",
        "published-data-query",
        url="/kamu/covid19.canada.daily-cases/data",
        wait_for="app-query-and-result-sections app-dynamic-table",
        expect_text=["total_daily"],
    ),
    Scenario(
        "w06-organization-settings",
        "organization-settings",
        url="/acme.fishing.co/~select/settings",
        wait_for="app-settings-tab",
        expect_text=["Delete account"],
    ),
]

FORCE_TARGETS: list[ForceTarget] = [
    ForceTarget(".mdc-checkbox", ["hover"]),
    ForceTarget("input.mdc-checkbox__native-control", ["focus"]),
    ForceTarget(".mat-mdc-radio-button .mdc-radio", ["hover"]),
    ForceTarget("input.mdc-radio__native-control", ["focus"]),
    ForceTarget("button.mdc-switch", ["hover", "focus"]),
    ForceTarget(".mat-mdc-menu-item", ["hover", "focus"]),
    ForceTarget(".page-link", ["hover", "focus"]),
    ForceTarget(".mat-button-toggle-button", ["hover", "focus"]),
    ForceTarget(".mat-mdc-chip", ["hover"]),
    ForceTarget("tr.mat-mdc-row", ["hover"], max=2),
    ForceTarget(".up-row", ["hover"], max=1),
    ForceTarget(".modal__btn", ["hover", "focus", "active"]),
    ForceTarget(".btn", ["active"], max=2),
    ForceTarget(".mat-mdc-button-base", ["active"], max=2),
]
