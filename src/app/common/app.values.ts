import { Injectable } from "@angular/core";

@Injectable()
export default class AppValues {
    public static readonly APP_LOGO = "assets/icons/kamu_logo_icon.svg";
    public static readonly LOCAL_STORAGE_ACCESS_TOKEN = "access_token";
    public static readonly DEFAULT_USERNAME = "anonymous";
    public static readonly DEFAULT_AVATAR_URL =
        "https://avatars.githubusercontent.com/u/11951648?v=4";
    public static readonly HTTP_PATTERN = new RegExp(
        /^(http:\/\/)|(https:\/\/)/i,
    );
    public static readonly DISPLAY_DATE_FORMAT = "DD MMM YYYY";
    public static readonly DISPLAY_TOOLTIP_DATE_FORMAT = "MMM D, YYYY, HH:mm A";
    public static readonly UNIMPLEMENTED_MESSAGE = "Feature coming soon";
    public static readonly SQL_QUERY_LIMIT = 50;
    public static readonly SHORT_DELAY_MS = 200;
    public static readonly LONG_DELAY_MS = 2000;
    public static readonly DEFAULT_OFFSET_COLUMN_NAME = "offset";
    public static readonly CLIBPOARD_KAMU_CLI =
        "kamu pull kamu.dev/anonymous/dataset";
    public static readonly CLIPBOARD_KAFKA =
        "https://api.kamu.dev/kafka/anonymous/dataset";
    public static readonly MARKDOWN_CONTAIN = `## Markdown __rulez__!
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
