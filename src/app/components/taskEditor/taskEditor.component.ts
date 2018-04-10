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

  addTask (event: Event): Promise<void> {
    return new Promise( (resolve, reject) => {
      this.task.name = this.name;
      this.taskService.addTask(this.task)
        .then(result=>{
          this.done.next(true);
          resolve();
        });
    });
  }

}
