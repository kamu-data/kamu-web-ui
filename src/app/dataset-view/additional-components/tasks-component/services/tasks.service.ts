import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Task } from "src/app/api/kamu.graphql.interface";
import { mockTasks } from "../components/tasks-table/tasks-table.types";

@Injectable({
    providedIn: "root",
})
export class TasksService {
    public datasetAllTasks(): Observable<Task[]> {
        return of(mockTasks);
    }
}
