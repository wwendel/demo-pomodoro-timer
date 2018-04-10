import { Injectable, Input } from '@angular/core';

export interface ITask {
    name: string,
    isCompleted?: boolean
}

//Singleton service with which to 
//get and save tasks to repository.
@Injectable()
export class TaskService {

    private tasks: Array<ITask>;

    constructor (){
        var tasks: Array<ITask> = [
            { name: "Do the Laundry."},
            { name: "Take out the Trash."},
            { name: "Call Mom."}
        ];
        this.tasks = tasks;
    }

    getTasks () {
        var list = [{name:null}]; //Add dummy item to front
       var tasks = this.tasks.filter((t)=> {return !t.isCompleted;});  
       //TODO: Get from repository
       for(let task of tasks) {
            list.push(task);
        }
        return list;
    }

    addTask(task: ITask): void {
       this.tasks.push(task);
       //TODO: Save to repository
    }

    completeTask(task: ITask): void {
        var taskIndex: number = this.tasks.findIndex( (t) => { return t.name==task.name;} )

        if (taskIndex>-1) {
            this.tasks.splice(taskIndex,1);
            task.isCompleted = true;
            //TODO: Save to repository
        }
     }
}
