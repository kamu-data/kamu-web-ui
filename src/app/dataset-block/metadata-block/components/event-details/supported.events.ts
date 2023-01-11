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
}

export interface EventPropertyLogo {
    name: string;
    url_logo?: string;
}
