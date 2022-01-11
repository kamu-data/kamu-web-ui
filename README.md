# Kamu Web UI

### Technologies:

- TypeScript, version: 3.7.3; [Node.js](https://nodejs.org/en/download/releases/), version: 10.11.x;
- [Angular CLI](https://github.com/angular/angular-cli), version 9.0.0.

### Libraries:

- [Angular Material Design](https://material.angular.io/), version: 9.0.0;
- [Angular Service Worker](https://www.npmjs.com/package/@angular/service-worker), version: 9.1.6;
- [Apollo Angular (GQL client)](https://apollo-angular.com/docs/), version: 1.8.0; 
- [GraphQL](https://www.npmjs.com/package/graphql), version: 14.7.0;
- [Bootstrap](https://www.npmjs.com/package/bootstrap), version: 5.1.3; [Popper.js](https://www.npmjs.com/package/@popperjs/core), version: 2.10.2;
- [Bootstrap Icons](https://www.npmjs.com/package/bootstrap-icons), version: 1.5.0;
- [Angular powered Bootstrap widgets](https://www.npmjs.com/package/@ng-bootstrap/ng-bootstrap), version: 6.0.0;
- [Prettier](https://www.npmjs.com/package/prettier), version: 2.5.1;
- Karma, version: 4.3.0; Jasmine, version: 3.4.0; [Cypress Angular Schematic](https://www.npmjs.com/package/@cypress/schematic/v/1.5.1), version: 1.5.1.

## Steps for running:
0. Do it once: 
   - download and install [Node.js](https://nodejs.org/en/download/releases/), version: 10.11.x
     
    or 
   - install Node.js with [Node.js Version Manager](https://github.com/nvm-sh/nvm). 
     
        Using `nvm` (Node.js Version Manager) makes it easier to install and manage multiple versions of Node.js on a single local environment.
    
        To install a specific version of node: `nvm install 10.11`


1. Install packages that project depends on: `npm install`
2. Run application locally: `ng serve` or `npm run start`
   

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code prettier

Run `npm run prettier` for enforce consistent style by parsing your code and re-printing it with its own rules that take the maximum line length into account, wrapping code when necessary.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
