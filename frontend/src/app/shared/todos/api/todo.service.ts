import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../model/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  protected basePath = 'http://localhost:3000/api';

  constructor(private httpClient: HttpClient) {}

  getHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return headers;
  }

  getTodos(): Observable<Todo[]> {
    return this.httpClient.get<Todo[]>(`${this.basePath}/todos`, {
      headers: this.getHeaders(),
    });
  }

  createTodo(todo: Todo): Observable<Todo> {
    return this.httpClient.post<Todo>(`${this.basePath}/todos/create`, todo, {
      headers: this.getHeaders(),
    });
  }

  deleteTodo(todoId: string): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.basePath}/todos/${todoId}/delete/`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getTodo(id: string): Observable<Todo> {
    return this.httpClient.get<Todo>(`${this.basePath}/todos/${id}`, {
      headers: this.getHeaders(),
    });
  }

  updateTodo(todo: Todo): Observable<Todo> {
    return this.httpClient.patch(
      `${this.basePath}/todos/update/${todo.id}`,
      todo,
      { headers: this.getHeaders() }
    );
  }
}
