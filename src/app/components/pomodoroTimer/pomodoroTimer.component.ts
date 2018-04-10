import { Component, EventEmitter, Injectable, Input, OnDestroy, Output} from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
//import * as soundfile  from '../../assets/alarm.wav';

export interface ISessionSummary {
  isRunning: boolean;
  isCompleted: boolean;
  summary?: ICompletedSession
}

export interface ICompletedSession extends ICompletedTimerCycle{
  cycles: number
}

export interface ICompletedTimerCycle {
  duration: number,
  work: number,
  rest: number
}

export interface IInterval {
   work: number,
   restMin: number,
   restMax: number,
   next?: IInterval,
   isLast?: boolean
}

@Component({
  selector: 'pomodoro-timer',
  templateUrl: './pomodoroTimer.component.html',
  styleUrls: ['./pomodoroTimer.component.scss']
})
export class PomodoroTimerComponent {

  private defaultTimeMultiplier: number = 60;
  @Input() timerCycle: Array<IInterval>;
  @Input() timeMultiplier: number;
  @Output("statusChange") statusChange: EventEmitter<ISessionSummary> = new EventEmitter;

  constructor (){
  }

  ngOnInit() {
    if (!this.timerCycle) {
      this.timerCycle = this.defaultTimerCycle;
    }
    this.timeMultiplier = this.timeMultiplier || this.defaultTimeMultiplier;
    this.initializeTimerCycle();
  }

  private defaultTimerCycle: Array<IInterval> = [
    { work: 25, restMin: 3,  restMax: 5},
    { work: 25, restMin: 3,  restMax: 5},
    { work: 25, restMin: 3,  restMax: 5},
    { work: 25, restMin: 25, restMax: 5},
  ];

  //Wires up timerCycle for ease of use
  private initializeTimerCycle (): void {
    var intervals = this.timerCycle;
    var lastInterval = intervals.length - 1;
    for(var i:number=0; i<=lastInterval; i++){
      var interval = intervals[i];       
      if (i==lastInterval) {
        interval.next = intervals[0];
        interval.isLast = true;
      } else {
        interval.next = intervals[i+1];
        interval.isLast = false;
      }
    }
  }

  title:            string = 'Pomodoro Timer';
  timer:            Observable<any>;
  subscription:     any;
  audio:            any;

  completedTimerCycles: Array<ICompletedTimerCycle> = [];
  currentInterval:  IInterval;
  intervalDuration: number;

  sessionStart:    number = 0;
  sessionElapsed:  number = 0;
  cycleStart:      number = 0;
  cyclesElapsed:   number = 0;
  intervalStart:   number = 0;
  intervalElapsed: number = 0;
  restStart:       number = 0;
  restElapsed:     number = 0;
  cumulativeWork:  number = 0;
  cumulativeRest:  number = 0;
  totalElapsed:    number = 0;

  showAlert:       boolean = false;
  isInitialized:   boolean = false;
  allowResume:     boolean = false;

  //Reinitialize counters for new session
  initializeCounters(): void {

    this.completedTimerCycles = [];
    this.currentInterval = null;
    this.intervalDuration = 0;
    
    this.sessionStart= 0;
    this.sessionElapsed = 0;
    this.cycleStart= 0;
    this.cyclesElapsed = 0;
    this.intervalStart = 0;
    this.intervalElapsed = 0;
    this.restStart= 0;
    this.restElapsed = 0;
    this.cumulativeWork = 0;
    this.cumulativeRest = 0;
    this.totalElapsed = 0;
  
    this.showAlert = false;
    this.allowResume = false;
  }

  initializeTimer(intervalInSeconds: number, callback: (ticks:number) => void): void {
    this.intervalDuration = intervalInSeconds * 1000;
    this.timer = Observable.timer(0, this.intervalDuration);
    this.subscription = this.timer.subscribe(callback);
    this.currentInterval = this.timerCycle[0];
    this.sessionStart = 0;
    this.isInitialized  = true;
  }

  killTimer():void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.currentInterval = null;
    this.timer = null;
    this.isInitialized  = false;
  }

  soundRestAlarm(): void {
    this.soundAlarm("assets/alarm.wav");
  }

  soundWorkAlarm(): void {
    this.soundAlarm("assets/alarm.wav");
  }

  soundAlarm (audioSource: string): void {
    let audio = new Audio();
    this.audio = audio;
    audio.src = audioSource;
    audio.load();
    audio.play();
  }

  getElapsedTimeDisplay(): string {
    return this.formatSecondsAsTime(this.totalElapsed);
  }

  getRemainingTimeDisplay(): string {
    try{
      var total:number = this.restStart > 0 ? this.currentInterval.restMax : this.currentInterval.work,
          elapsed: number = this.totalElapsed - (this.restStart || this.intervalStart),
          remaining: number = total - elapsed,
          timeString: string = "";

      if (elapsed < 0) return "";
      if (remaining>0) {
        timeString = this.formatSecondsAsTime(remaining);
      }
      return timeString;
    } catch {
      return "";
    }
  }

  getCancelClass(): string {
    return "btn-secondary doneButton"
  }

  getDoneClass(): string {
    return "btn-secondary doneButton"
  }

  //Consider moving utility service
  formatSecondsAsTime(totalSeconds: number): string {

    let hours: number = Math.floor(totalSeconds / 3600);
    let minutes: number = Math.floor(totalSeconds / 60);
    let seconds: number = totalSeconds % 60;

    let timeString:string = hours > 0 ? hours.toString() + ':' : '';
    let minuteString:string = minutes.toString();
    if (minutes < 10) {
      minuteString = '0' + minuteString;
    }

    let secondString = seconds.toString();
    if (seconds < 10) {
      secondString = '0' + secondString;
    }
    timeString += minuteString + ':' + secondString;
    return timeString;
  }

  startSession(): void {

    //Initialize a new work session
    if (!this.isInitialized)
    {
      this.initializeTimerCycle();
    }
    this.initializeCounters();

    //Announce start of session
    this.statusChange.next( { isRunning: true, isCompleted: false});

    //Listen for timer ticks (one per second):
    this.initializeTimer(1, (ticks)=>{

      var isTicking = true, //future: isPaused, but passage of time monitored;
          isResting = this.restStart > 0,
          isWorking = isTicking && !isResting,
          interval = this.currentInterval,
          multiplier = this.timeMultiplier,
          intervalDuration: number,
          minRest: number,
          maxRest: number,
          restElapsed: number;

      this.totalElapsed++;
      this.intervalElapsed++;

      if (isWorking) {
        this.cumulativeWork += 1;
        intervalDuration = interval.work * multiplier;
        if  (this.intervalElapsed >= intervalDuration) {
          this.beginRest(ticks);
        }
      } else if (isResting) {
        this.cumulativeRest += 1;
        restElapsed = ticks - this.restStart
        this.restElapsed = restElapsed;
        minRest = interval.restMin * multiplier;
        maxRest = interval.restMax * multiplier;
        if (restElapsed >= maxRest) {
          this.endRest(true);
        } else if (restElapsed > minRest){
          this.allowResume = true;
        }
      }
    });
  }

  resumeWork(): void  {
    this.endRest();
  }

  beginRest(ticks)
  {
    this.restStart = ticks;
    this.restElapsed = 0;
    this.showAlert = true;
    this.soundRestAlarm();
  }
  
  endRest(alarm:boolean = false) {
    this.restStart = 0;
    this.restElapsed = 0;
    this.showAlert = false;
    this.nextInterval();
    if (alarm)
    {
      this.soundWorkAlarm();
    }
  }

  nextInterval(): void  {
    if (this.currentInterval.isLast) {
       this.completeCycle();
       this.cyclesElapsed++;
       this.cycleStart = this.totalElapsed;
      }
    this.allowResume = false;
    this.restStart = 0;
    this.restElapsed = 0;
    this.currentInterval = this.currentInterval.next;
    this.intervalStart = this.totalElapsed;
    this.intervalElapsed = 0;
    this.showAlert = false;
  }

  completeCycle(): void {
    let completedCycle: ICompletedTimerCycle = { 
        duration: this.totalElapsed - this.cycleStart,
        work: this.cumulativeWork,
        rest: this.cumulativeRest
      };
    this.completedTimerCycles.push(completedCycle);
    this.endCycle();
  }

  endCycle(): void {
    this.restStart = 0;
    this.restElapsed = 0;
    this.intervalElapsed = 0;
    this.intervalStart = 0;
  }

  cancelSession():void {
    this.killTimer();
    this.endCycle();
    this.initializeCounters();
    this.statusChange.next({isRunning: false, isCompleted:false});
  }

  completeSession(): void {
    this.endSession();
    this.initializeCounters();
  }

  endSession(): void {
    var numberOfCycles: number = this.completedTimerCycles.length;
    var sessionSummary: ICompletedSession = {
      cycles: numberOfCycles,
      duration: this.totalElapsed, 
      work: this.cumulativeWork,
      rest: this.cumulativeRest
    }
    this.killTimer();
    this.endCycle();
    this.initializeCounters();
    this.statusChange.next({ isRunning: false, isCompleted: true, summary: sessionSummary});
  }

  onDestroy(): void {
    if (this.subscription)
    {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
