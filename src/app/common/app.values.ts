import { Injectable } from "@angular/core";

@Injectable()
export default class AppValues {
    public static appLogo = "assets/icons/kamu_logo_icon.svg";
    public static localStorageAccessToken = "access_token";
    public static defaultUsername = "anonymous";
    public static httpPattern = new RegExp(/^(http:\/\/)|(https:\/\/)/i);
    public static displayDateFormat = "DD MMM YYYY";
    public static clipboardKamuCli = "kamu pull kamu.dev/anonymous/dataset";
    public static clipboardKafka =
        "https://api.kamu.dev/kafka/anonymous/dataset";
    public static markdownContain = `## Markdown __rulez__!
---

### Syntax highlight
\`\`\`typescript
const language = 'typescript';
\`\`\`

### Lists
1. Ordered list
2. Another bullet point
   - Unordered list
   - Another unordered bullet

### Blockquote
> Blockquote to the max`;
}
