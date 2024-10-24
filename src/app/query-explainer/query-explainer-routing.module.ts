import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { QueryExplainerComponent } from "./query-explainer.component";

const routes: Routes = [
    {
        path: "",
        component: QueryExplainerComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QueryExplainerRoutingModule {}
