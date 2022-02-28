import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'yad-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss'],
})
export class LoadingModalComponent implements OnInit {
  // @Input() show: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LoadingModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { message: string }
  ) {}

  ngOnInit(): void {}
}
