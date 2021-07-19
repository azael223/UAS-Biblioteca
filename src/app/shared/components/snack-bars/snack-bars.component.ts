import { Component, Inject, OnInit } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA,
} from '@angular/material/snack-bar';

export interface snackData {
  message: string;
  type: 'success' | 'error' | 'warning';
}

@Component({
  selector: 'app-snack-bars',
  templateUrl: './snack-bars.component.html',
  styleUrls: ['./snack-bars.component.scss'],
})
export class SnackBarsComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: snackData,
    public _snackBarRef: MatSnackBarRef<SnackBarsComponent>
  ) {}

  public type = {
    error: {
      icon: 'cancel',
    },
    success: {
      icon: 'check_circle',
    },
    warning: {
      icon: 'error_outline',
    },
    info: {
      icon: 'info',
    },
  };
  ngOnInit(): void {}

  close() {
    this._snackBarRef.dismiss();
  }
}
