![logo](http://www.chasersmith.com/nonocross-online/logo-re.png)

A [nonogram](https://en.wikipedia.org/wiki/Nonogram) puzzle Angular web app that can generate various sized nonograms. Has a nonogram editor that can export custom puzzles as txt files so they can be imported and shared. Has Firebase authentication allowing users to login with google or registered accounts. Planned implementation of user-made custom nonogram browser/library.

**This project utilizes [Firebase](https://firebase.google.com/) for its api integration**
In order to deploy the project, a Firebase project will need to be setup and connected by setting the appropriate environment variables in the Angular project. Remove "_CHANGEME" from the included environments folder and set the variables in `src/environments/environment.ts` and `src/environments/environment.prod.ts` for production


## Angular CLI Help

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.11.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
