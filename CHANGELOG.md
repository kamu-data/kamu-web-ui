# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added initial loading screen for app
- Added a progress bar when initializing the editor on the Data tab
- Showing editor markers on SQL query errors
### Changed
- Separated main data query and lineage data 
- Improve reporting of fatal errors from modal window to toaster window
- Monaco-based editors isolated in `EditorModule`
### Fixed
- GraphQL caching issues when switching between History and Lineage tabs
- Correct author avatars on history tab
- Eliminated console warnings on application load
- Schema panel on Data tab always show dataset schema

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
- GitHub Client ID is now a part of runtime configuration rathern than Angular environment

## [0.12.0] - 2023-10-09
### Added
- Login page accepts a callback URL, and emits a POST request if it is defined, 
  instead of normal login functionality - to be used by CLI application for remote logins
### Changed
- Added a new service responsible for constructing a graph
- Established a naming convention for service event subjects, public observables, and emit methods 
### Fixed
- GraphQL runtime errors are not wrapped into application-specific exceptions
- Unexpected swithing to Settings tab while surfing over Lineage graph
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
  - supporting Github and login/password login methods
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
- Clipboard command line comands now include real dataset alias.
### Changed:
- Cleanup of heade menu content (depending on whether user is logged in or not)
- Signifficant extension of unit test coverage
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
- Upgraded to Node.JS generation 16.x
- Upgraded to Angular 14.3
- Switched to different Angular wrapper for Monaco editor (ngx-monaco-editor-v2)
- Switched from SASS to SCSS stylesheets
- Selected library updates/downgrades to align with Angular 14.3 and Node.JS 16.x
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
