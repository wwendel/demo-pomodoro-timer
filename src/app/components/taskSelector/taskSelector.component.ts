import { Component, EventEmitter, Injectable, Input, Output, OnDestroy } from '@angular/core';
import { TaskService, ITask } from '../../services/task.service';
import { TaskEditorComponent } from '../taskEditor/taskEditor.component';

@Component({
  selector: 'task-selector',
  templateUrl: './taskSelector.component.html',
  styleUrls: ['./taskSelector.component.scss'],
  providers:[]
})
export class TaskSelectorComponent {
 
  @Input() allowSelection: boolean = true;
  @Input() allowAddition: boolean = true;
  @Output("selectionChange") selectionChange: EventEmitter<ITask> = new EventEmitter;
  @Output("afterRefresh") afterRefresh: EventEmitter<ITask[]> = new EventEmitter;
  tasks: Array<ITask>;
  selectedTask: ITask;
  isEdit: boolean = false;
  private isNeedRefresh: boolean = false;

  constructor (private taskService: TaskService){
  }

  ngOnInit() {
    this.fetchTasks();
  }

  @Input() refresh(): void {
    this.fetchTasks();
    this.afterRefresh.next(this.tasks);
    this.isNeedRefresh = false;
  }

  private fetchTasks() {
    this.tasks = this.taskService.getTasks();
    this.selectedTask = null;
    this.selectFirstTask();
  }

  private selectFirstTask(): void {
    if (this.tasks.length)
    {
      let task: ITask = this.tasks[0];
      if (task.name){
        this.selectedTask = task;
      }
    }
  }

  private selectLastTask(): void {
    if (this.tasks.length)
    {
      let task: ITask = this.tasks[this.tasks.length-1];
      if (task.name){
        this.selectedTask = task;
      }
    }
  }

  onSelectionChange(event: Event):void {
    let selector: any = event.target;
    let currentTask: ITask = this.tasks[selector.selectedIndex];
    this.selectedTask = (currentTask && currentTask.name) ? currentTask : null;
    this.selectionChange.next(this.selectedTask);
  }

  initCreateTask(event: Event): void {
    this.isEdit = true;
  }

  onNewTask(task: ITask): void {
    this.isNeedRefresh = true;
  }

  onEditDone(isTaskAdded: boolean): void {
    if (isTaskAdded) {
      this.isNeedRefresh = true;
      if (this.allowSelection){
        this.refresh();
        this.selectLastTask();
      }
    }
    this.isEdit = false;
  }

}
