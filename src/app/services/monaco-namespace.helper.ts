import * as monaco from "monaco-editor";

export function getMonacoNamespace(): typeof monaco {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    return (window as any).monaco as typeof monaco;
}
