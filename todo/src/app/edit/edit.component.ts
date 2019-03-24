import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDatepicker, MatDatepickerInputEvent } from '@angular/material';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  minDate = new Date();
  constructor(private dialogRef: MatDialogRef<EditComponent>, @Inject(MAT_DIALOG_DATA) public data:ITodoItem) { }

  ngOnInit() {
  }
  public setDate(event: MatDatepickerInputEvent<Date>) {
    this.data.dueTo = event.value.getTime();
    console.log(this.data.dueTo);
  }
}
interface ITodoItem {
  id: number;
  assignedTo?: string;
  description: string;
  done?: boolean;
  dueTo: number;
}