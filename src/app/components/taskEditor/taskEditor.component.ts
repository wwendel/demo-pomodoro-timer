import { Component, EventEmitter, Injectable, Input, Output, OnDestroy } from '@angular/core';
import { TaskService, ITask } from '../../services/task.service';

@Component({
  selector: 'task-editor',
  templateUrl: './taskEditor.component.html',
  styleUrls: ['./taskEditor.component.scss'],
  providers: []
})
export class TaskEditorComponent {
 
  private name: string;
  @Input() task: ITask;
  @Input() isNew: boolean;
  @Output("newTask") newTask: EventEmitter<ITask> = new EventEmitter;
  @Output("done") done: EventEmitter<boolean> = new EventEmitter;
  
  constructor (private taskService: TaskService){
  }

  ngOnInit() {
    this.task =  this.task || { name: name};
  }

  cancel(): void {
    this.done.next(false);
  }

  add (event: Event): void {
    this.task.name = this.name;
    this.addTask(this.task);
    this.done.next(true);
  }

  addTask(task: ITask):void {
      this.taskService.addTask(task);
  }

}
