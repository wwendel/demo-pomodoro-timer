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

    getTasks (): Promise<Array<ITask>> {
       var promise: Promise<Array<ITask>> = new Promise((resolve,reject)=>{
            var list = [{name:null}]; //Add dummy item to front
            try {
                var tasks = this.tasks.filter((t)=> {return !t.isCompleted;});  
                //TODO: Get from repository
                for(let task of tasks) {
                    list.push(task);
                }
                resolve (list);
            } catch (error) {
                reject(error);
            }
       });
       return promise;
    }

    addTask(task: ITask): Promise<void> {
        return new Promise((resolve, reject)=>{
           //TODO: Save to repository
           this.tasks.push(task);
            resolve();
        });
    }

    completeTask(task: ITask): Promise<void> {
        return new Promise((resolve, reject)=>{
            var taskIndex: number = this.tasks.findIndex( (t) => { return t.name==task.name;} )
            if (taskIndex>-1) {
                //TODO: Save to repository
                this.tasks.splice(taskIndex,1);
                task.isCompleted = true;
            }
            resolve();
         });
     }
}
