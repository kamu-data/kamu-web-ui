import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ExecuteQuery } from "src/app/api/kamu.graphql.interface";
import { BaseDynamicEventComponent } from "../base-dynamic-event/base-dynamic-event.component";

@Component({
    selector: "app-execute-query-event",
    templateUrl: "../base-dynamic-event/base-dynamic-event.component.html",
    styleUrls: ["../base-dynamic-event/base-dynamic-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExecuteQueryEventComponent extends BaseDynamicEventComponent<ExecuteQuery> {}
