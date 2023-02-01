import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoCreateComponent } from './components/todo-create/todo-create.component';
import { TodosRoutingModule } from './todos.routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TodoListComponent, TodoCreateComponent],
  imports: [CommonModule, TodosRoutingModule, ReactiveFormsModule],
})
export class TodosModule {}
