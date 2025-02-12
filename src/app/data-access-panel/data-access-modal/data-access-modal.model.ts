export enum DataAccessTabsEnum {
    LINK = "link",
    KAMU_CLI = "kamuCli",
    REST = "rest",
    SQL = "sql",
    STREAM = "stream",
    CODE = "code",
    ODATA = "odata",
    EXPORT = "export",
}

export interface DataAccessMenuItem {
    name: string;
    iconName: string;
    activeTab: DataAccessTabsEnum;
    iconClassName?: string;
}

export const dataAccessMenuOptions: DataAccessMenuItem[] = [
    {
        name: "Link",
        iconName: "link",
        activeTab: DataAccessTabsEnum.LINK,
    },
    {
        name: "Kamu CLI",
        iconName: "terminal",
        activeTab: DataAccessTabsEnum.KAMU_CLI,
    },
    {
        name: "REST",
        iconName: "public",
        activeTab: DataAccessTabsEnum.REST,
    },
    {
        name: "SQL",
        iconName: "table",
        activeTab: DataAccessTabsEnum.SQL,
    },
    {
        name: "Stream",
        iconName: "stream",
        activeTab: DataAccessTabsEnum.STREAM,
    },
    {
        name: "Code",
        iconName: "code",
        activeTab: DataAccessTabsEnum.CODE,
    },
    {
        name: "OData",
        iconName: "post_add",
        activeTab: DataAccessTabsEnum.ODATA,
    },
    {
        name: "Export",
        iconName: "ios_share",
        activeTab: DataAccessTabsEnum.EXPORT,
    },
];
