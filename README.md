# Pomodoro

Author: Bill Wendel
This project was initially generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

Configurations for pomodoro timer cycle (intervals of work and rest), are defined in environment.ts. Note there are sepearate configurations for production vs development.  The cycle for development is much shorter, by design, so the state transitions can be quickly witnessed in development environment.

The solution is a web app written in angular 5.2.0 with typescript and bootstrap, and hosted in node.js.

For this demo, changes (such as tasks added or completed) will not be stored.  So, the app will always start (and refesh) with the same data.

FUNCTIONALITY:
1. A task list is provided, with which the User selects a task.
2. The user can add a new task, as needed at any time, even when the pomodoro clock is running.
3. Once a task is selected, the User can then start the timer.
4. The clock will tick and the total elapsed time will be displayed in 00:00:00 format.
5. The time remaining for the current interval is displayed in 00:00:00 format.
6. User will be alerted to rest when the work interval has transpired.
7. When the minimum rest has transpired, a button will appear with which to optionally resume work.
8. When the maximum rest has transpired, the system will prompt the user to resume work.
9. When the clock is ticking, the user cannot switch to a different task.
10. The User can cancel work at any time, either before or after the clock has started.
11. The User can click "Done" to complete the task at any time the clock is running.
12. The number of pomodoro cycles elapsed will be captured, along with coressponding durations: total, work, and rest.
13. When a task is canceled, it remains in the list, and the user may choose another task.
14. When a task is completed, it is saved and removed from the list.  The user must then select the next task.


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Prior to building, you will need the following packages installed globally:

     npm install -g @angular/cli
     ... (additional librarys, such as typescript, etc., as indicated needed by build output)...

Prior to initial build, you will need to update your package files by entering `npm install` at the command line.

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
