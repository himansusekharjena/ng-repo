import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

interface DialogData {
  planet: Object;
};

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  constructor (
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  planet = [];

  ngOnInit() {
    this.planet = Object.keys(this.data.planet).map(key => ({ key, value: this.data.planet[key] }));
    console.log(this.planet);
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
