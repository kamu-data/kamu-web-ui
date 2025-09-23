/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AppUIConfig, AppUIConfigFeatureFlags } from "../../app-config.model";

export default class AppValues {
    public static readonly APP_LOGO = "assets/icons/kamu_logo_icon.svg";
    public static readonly AMAZON_S3_BYO_LOGO = "assets/icons/amazon-s3-byo.svg";
    public static readonly IPFS_LOGO = "assets/icons/ipfs-logo.svg";
    public static readonly LOCAL_STORAGE_ACCESS_TOKEN = "access_token";
    public static readonly LOCAL_STORAGE_LOGIN_DEVICE_CODE = "login_device_code";
    public static readonly LOCAL_STORAGE_LOGIN_REDIRECT_URL = "login_redirect_url";
    public static readonly LOCAL_STORAGE_ACCOUNT_ID = "account_id";
    public static readonly SESSION_STORAGE_SIDE_PANEL_VISIBLE = "side_panel_visible";
    public static readonly SESSION_STORAGE_SQL_CODE = "sql_code";
    public static readonly DEFAULT_USER_DISPLAY_NAME = "anonymous";
    public static readonly DEFAULT_AVATAR_URL = "https://avatars.githubusercontent.com/u/11951648?v=4";
    public static readonly URL_PATTERN = /^(http:\/\/)|(https:\/\/)/i;
    public static readonly URL_PATTERN_ONLY_HTTPS = /^(https:\/\/)/i;
    public static readonly ZERO_OR_POSITIVE_PATTERN = /^[0-9]*$/i;
    public static readonly SCHEMA_NAME_PATTERN = /^[a-zA-Z0-9]+[a-zA-Z0-9\s(_)]*$/i;
    public static readonly SPLIT_ARGUMENTS_PATTERN = /[^\s"']+|"([^"]*)"+|'([^']*)'/g;
    public static readonly DATASET_NAME_PATTERN = /^([a-zA-Z0-9][a-zA-Z0-9-]*)+(\.[a-zA-Z0-9][a-zA-Z0-9-]*)*$/i;

    public static readonly DISPLAY_DATE_FORMAT = "dd MMM yyyy";
    public static readonly DISPLAY_TIME_FORMAT = "y-MM-dd, h:mm:ss a";
    public static readonly CRON_EXPRESSION_DATE_FORMAT = "MMM do yyyy pppp";
    public static readonly TIME_FORMAT = "h:mm:ss a";
    public static readonly UNIMPLEMENTED_MESSAGE = "Feature coming soon";
    public static readonly SAMPLE_DATA_LIMIT = 10;
    public static readonly SQL_QUERY_LIMIT = 50;
    public static readonly SHORT_DELAY_MS = 200;
    public static readonly LONG_DELAY_MS = 2000;
    public static readonly SIMULATION_START_CONDITION_DELAY_MS = 1200;
    public static readonly SIMULATION_UPDATE_WEBHOOK_STATUS_DELAY_MS = 2000;
    public static readonly SET_TRANSFORM_UNAVAILABLE_INPUT_LABEL = "-  Dataset is unavailable";
    public static readonly DEFAULT_OFFSET_COLUMN_NAME = "offset";
    public static readonly DEFAULT_FLOW_INITIATOR = "system process";
    public static readonly HEADERS_SKIP_LOADING_KEY = "Skip-loading";
    public static readonly HEADERS_AUTHORIZATION_KEY = "Authorization";
    public static readonly UPLOAD_FILE_IMAGE = "assets/images/upload-file-gear.gif";
    public static readonly DEFAULT_ADMIN_ACCOUNT_NAME = "kamu";
    public static readonly DEFAULT_MONACO_EDITOR_PLACEHOLDER = "Please type your query here...";
    public static readonly DEFAULT_ENGINE_NAME = "DataFusion";
    public static readonly DEFAULT_ENGINE_IMAGE = "ghcr.io/kamu-data/engine-datafusion:0.8.1";

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

    public static readonly DEFAULT_UI_FEATURE_FLAGS: AppUIConfigFeatureFlags = {
        enableLogout: true,
        enableScheduling: true,
        enableDatasetEnvVarsManagement: true,
        enableTermsOfService: true,
        allowAnonymous: true,
    };

    public static readonly DEFAULT_UI_CONFIGURATION: AppUIConfig = {
        ingestUploadFileLimitMb: 50,
        semanticSearchThresholdScore: 0,
        minNewPasswordLength: 8,
        featureFlags: AppValues.DEFAULT_UI_FEATURE_FLAGS,
    };
}
