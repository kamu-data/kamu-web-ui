# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
## Added
- Added access token feature
## Fixed
- Fixed bug with cache(Data tab) on the deployment version
- Extended full source info for EthereumLogs(Metadata tab)
- Added multi-line fields for ETH filter & signature(Metadata block) 

## [0.22.0] -2024-06-27
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
