import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { PomodoroTimerComponent } from './components/pomodoroTimer/pomodoroTimer.component';
import { TaskSelectorComponent } from './components/taskSelector/taskSelector.component';
import { TaskEditorComponent } from './components/taskEditor/taskEditor.component';
import { TaskService } from './services/task.service';

@NgModule({
  declarations: [
    AppComponent, 
    TaskSelectorComponent,
    TaskEditorComponent,
    PomodoroTimerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [TaskService],
  bootstrap: [AppComponent]
})
export class AppModule { }