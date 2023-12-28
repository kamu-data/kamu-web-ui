import { Transform } from "stream";
import { ReadKind, MergeKind, PreprocessKind } from "../add-polling-source/add-polling-source-form.types";

export interface EditAddPushSourceParseType {
    content: {
        event: AddPushSourceEditFormType;
    };
}

export interface AddPushSourceEditFormType {
    sourceName: string;
    read: {
        kind: ReadKind;
        jsonKind?: ReadKind;
        subPath?: string;
        schema?: string[];
        separator?: string;
        encoding?: string;
        comment?: string;
        quote?: string;
        escape?: string;
        enforceSchema?: boolean;
        nanValue?: string;
        positiveInf?: string;
        negativeInf?: string;
        dateFormat?: string;
        timestampFormat?: string;
    };
    merge: {
        kind: MergeKind;
        primaryKey?: string[];
        compareColumns?: string[];
    };
    preprocess?: Transform & {
        kind: PreprocessKind.SQL;
        query?: string;
    };
}
