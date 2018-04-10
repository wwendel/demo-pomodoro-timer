// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  timerCycle : [
    { work: 3, restMin: 2,  restMax: 3},
    { work: 3, restMin: 2,  restMax: 3},
    { work: 3, restMin: 2,  restMax: 3},
    { work: 3, restMin: 2,  restMax: 5},
  ],
  timeMultiplier: 1 //i.e. values above expressed in seconds
  //timerCycle expressed in minutes, by default (i.e. multiplier = 60).
  //Timer cycle shortened to 3 seconds of work, typical, for dev purposes.
};
