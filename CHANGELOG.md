# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased
### Added
- Deleting and renaming a dataset on Settings tab
- Added icons for dataset's tabs
### Changed
- Upgraded to Node.JS generation 16.x
- Upgraded to Angular 14.3
- Switched to different Angular wrapper for Monaco editor (ngx-monaco-editor-v2)
- Selected library updates/downgrades to align with Angular 14.3 and Node.JS 16.x
- GraphQL code generator tuned to produce string type by default for scalars
- Fixed bug with disabled state for "Run" button after error
- Refactored redundant selectors and cast class names to lowercase
- Fixed bug with updating the list of datasets after deletion
- Refactored observable subscriptions to pipe async
- Truncated fields in material table using a configurable length
- Added Load More data functionality to dataset data tab


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
