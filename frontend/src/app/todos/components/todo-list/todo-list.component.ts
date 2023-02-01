import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { TodoService } from 'src/app/shared/todos/api/todo.service';
import { Todo } from 'src/app/shared/todos/model/todo';
import { User } from 'src/app/shared/users/data-access/model/user';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent {
  user: User;
  todos: Todo[];
  /** For todos request */
  fetching: boolean;
  error: any;
  form: FormGroup;

  constructor(
    private _route: ActivatedRoute,
    private _todosService: TodoService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit() {
    this.user = this._route.snapshot.data['user'];
    this._createForm();
    this.fetchTodos();
  }
  _createForm() {
    this.form = this._formBuilder.group({
      todo: ['', Validators.required],
    });
  }

  fetchTodos() {
    this.fetching = true;
    this.error = null;

    this._todosService
      .getTodos()
      .pipe(
        finalize(() => {
          this.form.reset();
          this.form.enable();
          this.fetching = false;
        })
      )
      .subscribe(
        (todos) => {
          this.todos = todos;
        },
        (error) => {
          this.error = error;
        }
      );
  }

  addTodo(todoObj: Todo) {
    this.form.disable();
    this._todosService.createTodo(todoObj).subscribe(
      () => {
        this.fetchTodos();
      },
      (error) => {
        this.error = error;
      }
    );
  }

  deleteTodo(todoId: string) {
    this._todosService.deleteTodo(todoId).subscribe(
      () => {
        this.fetchTodos();
      },
      (error) => {
        this.error = error;
      }
    );
  }

  updateTodo(id: string) {
    this._router.navigate(['todos', 'edit', id]);
  }
}
