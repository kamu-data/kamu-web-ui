import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { TaskElement, generateTasks } from "../components/flows-table/tasks-table.types";

@Injectable({
    providedIn: "root",
})
export class TasksService {
    public datasetAllTasks(): Observable<TaskElement[]> {
        return of(generateTasks());
    }
}
