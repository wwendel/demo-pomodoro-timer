import { Component, Injectable, Input, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';
import { PomodoroTimerComponent, IInterval, ICompletedSession, ISessionSummary } from './components/pomodoroTimer/pomodoroTimer.component';
import { TaskSelectorComponent } from './components/taskSelector/taskSelector.component';
import { TaskService, ITask } from './services/task.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: []
})
export class AppComponent {

  constructor (private taskService: TaskService){
    this.timerCycle = environment.timerCycle;
    if (environment.timeMultiplier)
    {
      this.timeMultiplier = environment.timeMultiplier;
    }
  }

  @Input() title: string = 'Pomodoro Timer';
  @Input() selectedTask: ITask;
  @ViewChild(PomodoroTimerComponent) pomodoro: PomodoroTimerComponent; 
  @ViewChild(TaskSelectorComponent) tasks: TaskSelectorComponent; 
  allowTaskSelection: boolean = true;
  haveTaskSelection: boolean = false;
  timerCycle : Array<IInterval>;
  timeMultiplier: number = 60; //Only needed if timerCycle i not expressed in minutes.

  onAfterRefresh($event: Array<ITask>): void {
    this.selectedTask = $event[0];
    this.haveTaskSelection = (this.selectedTask && this.selectedTask.name) ? true : false;
  }

  onSelectionChange($event: ITask): void {
       this.selectedTask = $event;
       this.haveTaskSelection = (this.selectedTask && this.selectedTask.name) ? true : false;
  }

  onStatusChange($event: ISessionSummary): void {

    var isRunning = $event.isRunning,
        summary = $event.summary,
        isCompleted = $event.isCompleted,
        isCancelled = !isCompleted;

    if (isCompleted && summary) { 
      var task:ITask = this.selectedTask;
      this.taskService.completeTask(task);
      this.selectedTask = null;
      this.allowTaskSelection = true;
      this.haveTaskSelection = false;
      this.tasks.refresh();
    } else if (isRunning) {
      this.allowTaskSelection = false;
    } else if (isCancelled) { 
      this.allowTaskSelection = true;
      this.haveTaskSelection = false;
    }
  }

  updateTask():void {
     this.taskService.completeTask(this.selectedTask);
  }

}
