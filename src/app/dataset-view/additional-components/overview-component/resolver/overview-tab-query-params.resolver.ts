import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

import { OverviewTabQueryParamsType } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";

export const overviewTabQueryParamsResolverFn: ResolveFn<OverviewTabQueryParamsType> = (
    route: ActivatedRouteSnapshot,
) => {
    const pathPrefix = route.queryParamMap.get(ProjectLinks.URL_QUERY_PARAM_PATH_PREFIX) ?? "/";
    return {
        pathPrefix,
    };
};
