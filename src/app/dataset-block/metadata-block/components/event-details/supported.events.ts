export enum SupportedEvents {
    AddData = "AddData",
    ExecuteQuery = "ExecuteQuery",
    Seed = "Seed",
    SetAttachments = "SetAttachments",
    SetInfo = "SetInfo",
    SetLicense = "SetLicense",
    SetPollingSource = "SetPollingSource",
    SetTransform = "SetTransform",
    SetVocab = "SetVocab",
    SetWatermark = "SetWatermark",
    AddPushSource = "AddPushSource",
}

export interface EventPropertyLogo {
    name: string;
    label?: string;
    url_logo?: string;
}
