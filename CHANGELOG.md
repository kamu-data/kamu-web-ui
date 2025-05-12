# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [Unreleased]
### Added
- Ethereum logs source: show blockchain logo and chain name in Lineage graph
- Add query dialect drop-down for "Data" and "Query" pages
- Dataset header: implemented "Derive from" counter
### Changed
- Separate routes for all tabs of the DatasetSettings component
- Metadata tab: improved the view of the pagination button

## [0.46.0] - 2025-04-24 
### Added
- Device flow authentication
### Changed
- Improved the performance of the query execution timer
### Fixed
- Query explainer: fixed bug with the privacy issue

## [0.45.2] - 2025-04-09
### Added
- Overview tab: added current role for user in Details section
### Fixed
- Fixed bug with infinity spinner for global search

## [0.45.1] - 2025-04-08
### Fixed
- Fixed grammatical error in the UI configuration

## [0.45.0] - 2025-04-08
### Added
- Added semantic search
### Changed
- Separate routes for all tabs for Account component
- Separate routes for all tabs for AccountSettings component
- Separate routes for all tabs for FlowDetails component

## [0.44.0] - 2025-03-31
### Added
- Transform settings: enable a transform without setting batching parameters
- Implemented `MergeStrategySnapshot` and `MergeStrategyUpsertStream` merge strategies
- Implemented unknown response for broken dataset flows
### Fixed
- Wrong redirect after login

## [0.43.0] - 2025-03-25
### Added
- Flows table: added a hint to a long message
- Account flows tab: added loading state
- Sharing dataset feature

## [0.42.1] - 2025-03-20
### Fixed
- Account settings: the "Email" option is now available

## [0.42.0] - 2025-03-20
### Added
- Login page: added ability to switch buttons with tab
- Added account resolver for account page
### Fixed
- Flows tab: fixed redirection for derivative dataset when list flows is empty
- Scheduled updates: remove disabled state for "Save" button

## [0.41.1] - 2025-03-07
### Fixed
- `/page-not-found` route hierarchy

## [0.41.0] - 2025-03-07
### Added
- Added resolver `BlockMetadataResolver` for metadata block page
- Added `DEVELOPER.md` file
- Added license header for all *.ts files
- Account page: added account name
### Changed
- Modified `README.md` file
- Changed the method of getting route and query parameters via input decorator for some components
### Fixed
- Remove "Dashboard" link from application header
- Disabled "keywords" feature for "demo" mode
- Metadata block page for SetTransfom: private inputs are not displayed for non-admin
- Query explainer: page empty if query returns empty result

## [0.40.1] - 2025-02-20
### Changed
- Dataset Settings: separated "Scheduled updates" and "Transform settings" tabs
### Fixed
- Autofocus for `Login` page
- Color for buttons from stepper navigation
- Styles for avatar from app header
- Edit SetTransform event: set `DataFusion` as default engine
- Edit SetTransform event: return to the `Overview` tab after editing an event
- Edit SetTransform event: rename some labels
- Data access panel: after navigating to another datase the links are not updated 

## [0.40.0] - 2025-02-13
### Changed
- Restructuring of the application catalogs
### Fixed
- Batching trigger form: removed disabled state when updates turn off
- Edit SetTransform: initializing the correct engine
- Edit SetTransform: deleting input datasets with same name
- Edit SetTransform: opening links for account name and dataset name in a new tab

## [0.39.1] - 2025-02-03
### Changed
- Feature flags: set  the "account-settings.email" to "stable" value

## [0.39.0] - 2025-02-03
### Added
- Added a feature for changing account email
- Added `redirectUrl` parameter in the URL for login page
### Fixed
- Private datasets: return to the previously opened page after login
- Cleanup of access modifiers in Angular classes

## [0.38.0] - 2025-01-27
### Changed
- Replaced the package for custom svg icons with the MatIconRegistry
- Replaced the lodash package with custom helpers
- Replaced the moment.js package with date-fns

## [0.37.0] - 2025-01-17
### Added
- Create dataset: unlock dataset visibility selection
- Saved sql request in the URL after completing the network request
### Changed
- Environment variables and secrets: made `key` field unavailable for editing
- Improved representation of retractions and corrections in data table

## [0.36.0] - 2025-01-08
### Added
- Added initialization messages at the start of the flow
### Changed
- Query explainer: improved `INPUT DATA` section view
  - added `Run` and `Copy` buttons for a sql code
- Modified "Scheduled updates" view
- Implemented new API for environment variables
### Fixed
- Flows table: fixed broken filters in pagination

## [0.35.0] - 2024-12-27
### Added
- Made `force update` link for a flow table
- Disable the `Run` button during query execution
### Changed
- Flow configuration separation
- Minor updates for most dependencies

## [0.34.0] - 2024-12-18
### Added
- Handling feature elements in 3 modes
  - `production` mode: only implemented features available
  - `demo` mode: unimplemented features are disabled
  - `develop` mode: unimplemented features are available
- Made a tile element clickable
### Fixed
- Fixed error handling for the query explainer

## [0.33.0] - 2024-12-03
### Added
- Warning when deleting datasets which are out of sync with their push remotes
### Fixed
- Visibility for Update button and Flows tab from configuration
- Error in console during initialization
- Readme section: redirection after clicking the `Run` button

## [0.32.0] - 2024-11-28
### Added
- Query page: added default query after searching for first dataset
- Set the container width for large screens
- Added contextual schemas in Data tab
### Changed
- Readme section: modified 'Run' button into a link
- Hint extension for tile widget account
- Separated runtime and UI configurations
### Fixed
- Typo in feature flags (enableDatasetEnvVarsManagement)
                                                  ^

## [0.31.0] - 2024-11-22
### Added
- Added Terms of Service link

## [0.30.0] - 2024-11-22
### Added
- Added a new page `Query` that allows you to make sql queries without being tied to a dataset
- Impovements for readme section
  - Add syntax highlight support for SQL in markdown
  - Add copy to clipboard button for SQL blocks
  - Add run button that opens "Data" tab in new window and executes the selected query

## [0.29.0] - 2024-11-12
### Fixed
- Readme section refresh when navigating between datasets
### Changed
- `Get Data` panel redesign

## [0.28.3] - 2024-10-30
### Fixed
- Query explainer successfully validates commitment and shows data
- Simplify the language in flow scheduling

## [0.28.2] - 2024-10-25
### Fixed
- The `/query-explainer` view allows anonymous access

## [0.28.1] - 2024-10-25
### Added
- Switched to Node.JS v18.20.4
### Fixed
- Bug with line breaks for the schema content

## [0.28.0] - 2024-10-25
### Added
- Added the ability to resize the monaco editor vertically
- Added query explainer page for admin

## [0.27.1] - 2024-10-04
### Fixed
- Lineage graph: redirect to another dataset
- Application search: redirect to another dataset
- Lineage tab displayed correctly
- Prettified history timeline

## [0.27.0] - 2024-09-25
### Added
- Added the ability to view task logs using Grafana only for the admin(Logs tab)
- Detect dataset cache after the flows are completed
- Added `Share query` button to the Data tab
### Fixed
- Added autofocus to the login field on the login page

## [0.26.4] - 2024-09-13
### Added
- Support `FlowEventScheduleForActivationEvent` in flow history
### Fixed
- Replaced mock initiator for flows tab for account
- Restored `Fetch uncacheable` checkbox when configuration exists

## [0.26.3] - 2024-09-13
### Fixed
- Hid the `force-update` link
- Renamed `Hard compaction` to `Reset` descriprion(flows table) when user choose reset with flatten metadata

## [0.26.2] - 2024-09-09
### Added
- Added reset flatten option for derivative datasets

## [0.26.1] - 2024-09-06
### Fixed
- Set consistent state with `force update` link
### Changed
- Replaced dataset names, account names, history blocks, settings vertical tabs to links
- Replaced all trackSubscriptions with takeUntilDestroyed operator
- Replaced all components with self closing tag

## [0.26.0] - 2024-08-30
### Fixed
- Disabled unused menu items for account settings
- The file name for the file upload service may contain special characters
- Added form initialization for an existing configuration(Compaction tab)
- Added typed forms for all application
### Changed
- Added an `required` option for input parameters
- Replaced the constructor with `inject` function for all components and services

## [0.25.1] - 2024-08-22
### Added
- Added the ability to reset the dataset in 2 modes(`Reset to Seed` and `Flatten metadata`)
- Extended `Fetch uncacheable` checkbox for the update scheduler.
- Added active link `force update` for the flow with uncacheable source(Flows table)
### Fixed
- Access tokens: when you turn on the switch, all tokens are displayed (active and revoked)


## [0.25.0] - 2024-08-13
### Added
- Migrated Angular v.14 to Angular v.16 

## [0.24.0] - 2024-08-12
### Fixed
- "Update now" button is present when user is not logged in 
- Changed tab size in the monaco editor
- Removed sliding animation from pop-up windows
- Minor modifications for variables and secrets tab
- Optimized and modified the query for getting data for the flow list
### Added
- Improved UX of flows table:
  - Main description message is clickable
  - Duration block displayed correctly(added delay)
- Added multiple filters selection for the flows table
- Implemented links for the main menu of the dataset
- Redirected to original URL after login flow
- Added recursive flag for compaction for full mode

## [0.23.2] - 2024-07-23
### Fixed
- Fixed bug with update after closing window(Overview tab)

## [0.23.1] - 2024-07-19
### Added
- Displayed application version in console 


## [0.23.0] - 2024-07-18
### Added
- Added access token feature
- Added environment variables and secrets for the dataset
- Added new flag(enableDatasetEnvVarsManagement) in the runtime configuration
### Fixed
- Fixed bug with cache(Data tab) on the deployment version
- Extended full source info for EthereumLogs(Metadata tab)
- Added multi-line fields for ETH filter & signature(Metadata block)
- Fixed styles for the mobile version(portrait view) of the lineage graph
- Improved error description when loading data for a dataset from a file
- Removed initial links when push source exist(Overview tab)

## [0.22.0] - 2024-06-27
### Fixed
- Fixed GraphQL cache issue upon mutation methods
- Show an empty result block instead of a block add data(Data tab)
- Renamed term compacting to compaction
- Fixed a bug for the handler for an empty result block(Data tab)
- Fixed a bug with the loader in the header when searching

## [0.21.1] - 2024-06-24
### Added
- Support `EthereumLogs` as a new kind of polling source type (wizard, block history, metadata)
### Fixed
- Closed security error with initial drag & drop area for data displayed to anonymous users


## [0.21.0] - 2024-06-24
### Added
- Added `EthereumLogs` polling source and metadata block support 

## [0.21.0] - 2024-06-24
### Added
- Added ingest via file upload

## [0.20.0] - 2024-06-10
### Added
- Added MQTT polling source support 
- Added MQTT metadata block support
- Provided 2 mode for compaction: `Full` and `MetadataOnly`
- Added ability to view summary of flowsfor all datasets of the account
### Fixed
- Sql query timer improvements

## [0.19.0] - 2024-05-14
### Added
- Display dataset ID in Details section(Overview tab)
- Added visual feedback on query execution(Data tab)

## [0.18.1] - 2024-04-18
### Fixed
- Fixed icon size for `RisingWave` engine

## [0.18.0] - 2024-04-18
### Added
- Support `RisingWave` engine
- Added `Compacting` tab in the root dataset settings
### Fixed
- Hide the Scheduling tab when `SetPollingSource` or `SetTransform` undefined
### Changed
- Dataset Overview: adding a small indentation to block history icon

## [0.17.1] - 2024-04-02
### Fixed
- Fixed disabled state for the `Refresh now` button
### Added
- Added data access panel with supported protocols

## [0.17.0] - 2024-03-26
### Added
- Added a summary tab for the flow details page
- Added admin guard
- Added a local loader for search in the header
### Changed
- Changed the appearance of the global loader
- Redesigned data access panel("Get Data" button)

## [0.16.0] - 2024-03-13
### Added
- Introduced dataset scheduling settings page to manage automatically launched ingest/transform flows
- Added new flows tab 
- Added refresh now button on the overveiw tab to start the flow
- Added support for new batching configuration
- Added new start condition for the flow
- Added the ability to cancel a scheduled flow
- Added a history tab for the flow details page
### Changed
- Minor dependency updates
### Fixed
- Fixed bug with authentication (Login vs CLI)
- Settings tab is hidden after login
- Fixed bug with `prevOffset` on the block metadata page
- Reduced flow status types
- Fixed dispay format for a previous checkpoint

## [0.15.0] - 2024-01-17
### Changed
- Implemented changes according to the latest ODF changes
  - Removed `SetWatermark` event
  - Renamed `ExecuteQuery` event to `ExecuteTransform`
  - Extended `ExecuteTransform` event
  - Extended `AddData` event

## [0.14.0] - 2024-01-04
### Added
- Added initial loading screen for app
- Added a progress bar when initializing the editor on the Data 
- Showing editor markers on SQL query errors
- Displayed lineage graph for a single dataset
- Added calculation of graph height on different screens
- Added the ability to add AddPushSource event
- Added support for the SetDataSchema,AddPushSource events on the metadata block page
- Added edit functionality for AddPushSource event
### Changed
- Separated main data query and lineage data 
- Improve reporting of fatal errors from modal window to toaster window
- Monaco-based editors isolated in `EditorModule`
- Changed splash screen
- Evicting dataset objects from Apollo GraphQL cache after significant mutations
### Fixed
- GraphQL caching issues when switching between History and Lineage tabs
- Correct author avatars on history tab
- Eliminated console warnings on application load
- Schema panel on Data tab always show dataset schema
- Minimized usage of `!important` directives in CSS
- Fixed bug with empty offset interval

## [0.13.0] - 2023-10-18
### Added
- Save the toggle state of the lineage graph info panel
### Changed
- Style improvements
  - Made header more compact to maximize the useful space
  - Improved the style of tables
  - The lineage graph made fit without a scroll
  - In account view opened the "Datasets" tab by default 
- Changed sample query limit on overview tab
### Fixed
- Improved UI reaction on situation when GraphQL server refuses to accept access token
- Used correct account avatar in data preview

## [0.12.1] - 2023-10-13
### Added
- Add UI support for ODF protocol changes of v0.32.0
  - support new kind of EventTimeSource: FromSystemTime (Fetch section of SetPollingSource wizard)
  - JSON, NdJSON, NdGeoJSON are the new supported read formats
### Changed
- GitHub Client ID is now a part of runtime configuration rather than Angular environment

## [0.12.0] - 2023-10-09
### Added
- Login page accepts a callback URL, and emits a POST request if it is defined, 
  instead of normal login functionality - to be used by CLI application for remote logins
### Changed
- Added a new service responsible for constructing a graph
- Established a naming convention for service event subjects, public observables, and emit methods 
### Fixed
- GraphQL runtime errors are not wrapped into application-specific exceptions
- Unexpected switching to Settings tab while surfing over Lineage graph
- Datasets are not switching in the lineage graph, when names are identical, only accounts are different
- Adding a watermark prints crash log in console
- Refactoring styles and removed all ViewEncapsulation.None strategies

## [0.11.0] - 2023-09-25
### Added
- Added side panel for lineage graph
### Changed
- Tweaked color scheme and icons

## [0.10.1] - 2023-09-20
### Fixed
- kamu-web-ui#158: pagination broken on profile datasets page

## [0.10.0] - 2023-09-18
### Added
- Implemented authentication and authorization components:
  - runtime configuration allows disabling logout and setting predefined login instructions
  - dynamic endpoint to find out on available login methods on the API server
  - supporting GitHub and login/password login methods
  - GraphQL: added Authorization Bearer header
  - added routing guards related to authentication
  - Settings tab is hidden if no permissions
  - edits on Overview and Metadata tabs are disabled if missing permissions
  - metadata event editors navigate home if missing permissions
  - lineage graph nodes properly navigate over account boundaries
  - data tab contains account name prefix in SQL queries
- Implemented account resolution by name via API:
  - profile page working normally without account mocks
  - lineage graph shows user avatars (dataset owners)
- Showing dataset owners in search autocompletes
- Clipboard command line commands now include real dataset alias.
### Changed:
- Cleanup of header menu content (depending on whether user is logged in or not)
- Significant extension of unit test coverage
- Specialized dataset fragment for Lineage - extracts avatarUrl additionally from the account
- Query for account datasets only when it's necessary
- Reworked error handling in dataset operations

## [0.9.0] - 2023-09-18
### Added
- Deleting and renaming a dataset on Settings tab
- Added icons for dataset's tabs
- Added more content for graph's node
- Added Load More data functionality to dataset data tab
- Started using `stylelint` CSS linting tool
- Added source url for root dataset on the lineage graph
### Changed
- Upgraded to Node.js generation 16.x
- Upgraded to Angular 14.3
- Switched to different Angular wrapper for Monaco editor (ngx-monaco-editor-v2)
- Switched from SASS to SCSS stylesheets
- Selected library updates/downgrades to align with Angular 14.3 and Node.js 16.x
- GraphQL code generator tuned to produce string type by default for scalars
- Fixed bug with disabled state for "Run" button after error
- Refactored redundant selectors and cast class names to lowercase
- Fixed bug with updating the list of datasets after deletion
- Refactored observable subscriptions to pipe async
- Truncated fields in material table using a configurable length


## [0.8.0] - 2023-08-04
### Added
- Added pictures in the dropdown list for engines
- Editing dataset readme file on Overview tab
### Changed
- Internal: code formatter settings revised (print width)

## [0.7.0] - 2023-07-27
### Added
- The ability to add a new dataset in 2 ways: creating from a yaml file and creating an empty dataset.
- Support editing basic dataset information interactively (SetInfo event)
- Support editing dataset license information interactively (SetLicense event)
- Support defining initial polling source information for the root datasets interactively (SetPollingSource event):
  - Fetch step
  - Read step
  - Merge step
- The ability to edit SetPollingSource event
- Editing SetWaterMark event
- Editing SetTransform event
- Support defining initial polling source information for the root datasets interactively (SetPollingSource event):
  - Prepare step(optional)
  - Preprocess step(optional)
- Create a navigator to display the state of the interactive input for the SetPollingSource event

## [0.6.0] - 2023-02-27
### Added
- Link between AddData/ExecuteQuery events and queries tab for the event-specific data intervals
- Docker image that serves the app under Nginx
### Changed
- Yaml representation of events coming from the GraphQL server instead of frontend-side generation
- Improved release procedure

## [0.5.1] - 2023-02-10
### Changed
- Metadata tab of Dataset Viewer should also show query alias in SetTransform inputs

## [0.5.0] - 2023-02-09
### Added
- Support viewing individual block details:
  - basic block information
  - detailed information on event-specific properties in rich format
  - YAML view of event details
  - navigation between blocks with search and filter capabilities
  - highlighting SQL queries in events
- Revised Metadata view page based on the new components from block details views
- Decent reaction on datasets without schema yet
- Unified utility components that display hash, time of event, size in bytes
- Changed spinner behavior. Spinner is now automatically displayed if an external request takes more than configured period of time

## [0.4.0] - 2022-11-18
### Added

- Keeping a CHANGELOG!
- Major refactorings and productization of the web UI
