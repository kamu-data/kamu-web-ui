import { AccountTabs } from "./account.constants";

export interface AccountPageQueryParams {
    tab?: AccountTabs;
    page?: number;
}
