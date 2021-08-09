import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarsComponent } from '@components/snack-bars/snack-bars.component';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(private _snackBar: MatSnackBar) {}
  private config: MatSnackBarConfig<any> = {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'right',
  };
  public success(
    message: string,
    config: MatSnackBarConfig<any> = this.config
  ) {
    let data = { message, type: 'success' };
    this._snackBar.openFromComponent(SnackBarsComponent, {
      ...config,
      data,
      panelClass: 'custom-snack-success',
    });
  }
  public error(message: string, config: MatSnackBarConfig<any> = this.config) {
    let data = { message, type: 'error' };
    this._snackBar.openFromComponent(SnackBarsComponent, {
      ...config,
      duration: 10000,
      data,
      panelClass: 'custom-snack-error',
    });
  }
  public warning(
    message: string,
    config: MatSnackBarConfig<any> = this.config
  ) {
    let data = { message, type: 'warning' };
    this._snackBar.openFromComponent(SnackBarsComponent, {
      ...config,
      data,
      panelClass: 'custom-snack-warning',
    });
  }
  public info(message: string, config: MatSnackBarConfig<any> = this.config) {
    let data = { message, type: 'info' };
    this._snackBar.openFromComponent(SnackBarsComponent, {
      ...config,
      data,
      panelClass: 'custom-snack-info',
    });
  }
}
