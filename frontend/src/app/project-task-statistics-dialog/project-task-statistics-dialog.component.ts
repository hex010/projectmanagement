import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../services/task.service';
import { TaskStatus } from '../models/TaskStatus.enum';
import { TaskAdditionResponseInterface } from '../models/TaskAdditionResponse.interface';

@Component({
  selector: 'app-project-task-statistics-dialog',
  templateUrl: './project-task-statistics-dialog.component.html',
  styleUrls: ['./project-task-statistics-dialog.component.scss']
})
export class ProjectTaskStatisticsDialogComponent {
  public task!: TaskAdditionResponseInterface;

  constructor(@Inject(MAT_DIALOG_DATA) public taskId : number,
  private taskService : TaskService) {}
  
  ngOnInit(): void {
    this.taskService.getTask(this.taskId).subscribe(
      (data) => {
        this.task = data;
      }
    );
  }

  isTaskFinished() : boolean{
    return this.task.taskStatus === this.taskService.getTaskStatusKeyByValue(TaskStatus.Completed);
  }
  
  getInProgressDate() {
    if(this.task.inProgressDate) return this.task.inProgressDate;
    return "dar nėra vykdoma";
  }

  getFinishDate() {
    if(this.task.finishDate) return this.task.finishDate;
    return "dar nėra užbaigta";
  }

  calculateIngoingTaskDate() {
    const startDateObj = new Date(this.task.startDate);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - startDateObj.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  calculateFinishedTaskDate() {
    const endDateObj = new Date(this.task.finishDate);
    const currentDate = new Date();

    const timeDifference = currentDate.getTime() - endDateObj.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  calculateFinishedTaskDuration() {
    const startDateObj = new Date(this.task.startDate);
    const finishDateObj = new Date(this.task.finishDate);

    const timeDifference = finishDateObj.getTime() - startDateObj.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  }

  calculateFinishedTaskLateDate() {
    const endDateObj = new Date(this.task.endDate); //kada turejo buti uzbaigtas
    const finishDateObj = new Date(this.task.finishDate); //kada realiai uzbaigtas buvo

    const timeDifference = finishDateObj.getTime() - endDateObj.getTime();

    const daysLate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if(daysLate <= 0)
      return "nebuvo vėluota";
    else
      return (daysLate + " dienas"); 
  }

  calculateFinishedTaskEarlierDate() {
    const endDateObj = new Date(this.task.endDate); //kada turejo buti uzbaigtas
    const finishDateObj = new Date(this.task.finishDate); //kada realiai uzbaigtas buvo

    const timeDifference = endDateObj.getTime() - finishDateObj.getTime();

    const daysLate = Math.ceil(timeDifference / (1000 * 3600 * 24));

    if(daysLate <= 0)
      return "nebuvo baigta anksčiau";
    else
      return (daysLate + " dienas"); 
  }

  getFinishedTaskComment() {
    return this.task.taskFinishComment;
  }
}
