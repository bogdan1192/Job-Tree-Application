import { Injectable } from '@angular/core';
import { NewStepModel, TaskModel } from '../shared/taskModel';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  constructor(protected http: HttpClient) {}

  public getRootLevel(): Observable<TaskModel[][]> {
    const headers = {
      'Access-Control-Allow-Origin': 'localhost:5296',
    };
    return this.http.get<any>('http://localhost:5296/rootTree', { headers });
  }

  public getChildren(id: number): Observable<TaskModel[][]> {
    const headers = {
      'Access-Control-Allow-Origin': '*',
    };
    return this.http.get<any>(`http://localhost:5296/children/${id}`, {
      headers,
    });
  }

  public addChild(id: number, step: NewStepModel): Observable<void> {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    };
    return this.http.post<any>(`http://localhost:5296/add/${id}`, step, {
      headers,
    });
  }
}
