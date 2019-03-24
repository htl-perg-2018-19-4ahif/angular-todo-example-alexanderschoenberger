import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MatDialog } from '@angular/material';
import { EditComponent } from './edit/edit.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  name: string = "";
  title = 'todo';
  todos: ITodoItem[] = [];
  filter: boolean = false;
  description: string;
  error: string;
  names: string[];
  newUserName: string;
  url = "http://localhost:8080/api";
  editTodo: boolean;
  constructor(private http: HttpClient, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadTodos();
    this.loadPeoples();
   
  }
  
  public loadTodos(){
    this.http.get(this.url + "/todos").subscribe((data: ITodoItem[]) => {
      this.todos = data;
      console.log(this.todos);
    });
  }
  public loadPeoples(){
    this.http.get(this.url + "/people").subscribe((data: string[]) => {
      data.unshift("");
      this.names = data;
      this.newUserName = data[0]['name'];
    });
  }
  public filterFunction() {
    this.filter ? this.filter = false : this.filter = true
  }
  
  public async delete(number: number) {
    await this.http.delete(this.url + "/todos/" + number).toPromise();
    this.http.get(this.url + "/todos").subscribe((data: ITodoItem[]) => {
      this.todos = data;
      console.log(this.todos);
    });
  }
  public edit(todo: ITodoItem) {
    const dialogRef = this.dialog.open(EditComponent, {
      data: {
        type: "Edit", people: this.names, id: todo.id, assignedTo: todo.assignedTo,
        description: todo.description, done: todo.done, dueTo: todo.dueTo
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      console.log(result);
      if (result) {
        let body = {
          assignedTo: result.assignedTo,
          description: result.description,
          dueTo: result.dueTo,
          done: result.done
        }
        await this.http.patch(this.url + "/todos/" + result.id, body).toPromise();
        this.loadTodos();
      }
    });
  }
  public add() {
    const dialogRef = this.dialog.open(EditComponent, {
      data: { type: "Add", people: this.names }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
          let body = {
            assignedTo: result.assignedTo,
            description: result.description,
            dueTo: result.dueTo
          }
          console.log(result);
          await this.http.post(this.url + "/todos", body).toPromise();
          this.loadTodos();
      }
    });
  }
  public getDate(number:number) {
    let date:Date = new Date(number);
    return date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
  }
}
interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean;
  dueTo: number;
}