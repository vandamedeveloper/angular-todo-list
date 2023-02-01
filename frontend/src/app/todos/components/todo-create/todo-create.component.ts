import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TodoService } from 'src/app/shared/todos/api/todo.service';
import { Todo } from 'src/app/shared/todos/model/todo';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
})
export class TodoCreateComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() fetching: boolean;
  todo?: Todo;
  @Output() todoAdded = new EventEmitter<Todo>();

  constructor(
    private _route: ActivatedRoute,
    private _todoService: TodoService,
    private _router: Router
  ) {}

  addTodo() {
    if (this.form.valid) {
      if (!this.todo) {
        const todo = this.form.controls['todo'].value;
        const todoObj: Todo = {
          todo,
          completed: false,
        };
        this.todoAdded.emit(todoObj);
      } else {
        const todo = this.form.controls['todo'].value;
        const updatedTodo: Todo = { ...this.todo, todo };
        this._todoService.updateTodo(updatedTodo).subscribe(
          () => {
            this._router.navigate(['']);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  ngOnInit() {
    this._route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (id) {
        this._todoService.getTodo(id).subscribe(
          (todo) => {
            this.todo = todo;
          },
          (error) => {
            console.log(error);
          }
        );
      }
    });
  }

  getButtonText() {
    if (this.todo) {
      return 'UPDATE';
    } else {
      return 'ADD';
    }
  }
}
