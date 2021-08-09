import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

export interface FiltersButtonConfig {
  text?: string;
  icon?: string;
}
export interface DateRangeFilter {
  prop?: string;
  title: string;
}
export interface SelectFilter {
  title: string;
  items: any[];
  bind: string;
  value?: string;
  prop?: string;
}
@Component({
  selector: 'app-filters-button',
  templateUrl: './filters-button.component.html',
  styleUrls: ['./filters-button.component.scss'],
})
export class FiltersButtonComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(private _fb: FormBuilder) {}

  private onDestroy$ = new Subject<any>();

  @Input('config') public config: FiltersButtonConfig = {
    text: 'FILTROS',
    icon: 'tune',
  };
  @Input('dateRange') public dateRange: DateRangeFilter;
  @Input('select') public select: SelectFilter;
  @Output('onChange') public onChange = new EventEmitter<any>();
  public dateRangeForm = this._fb.group({
    start: new FormControl(null, []),
    end: new FormControl(null, []),
  });

  public selectControl = new FormControl(null, []);

  get dateRangeProp() {
    return this.dateRange ? this.dateRange.prop || 'dateRange' : 'dateRange';
  }
  get selectProp() {
    return this.select ? this.select.prop || 'select' : 'select';
  }

  get values() {
    let ranges = null;
    if (
      this.dateRangeForm.controls.start.value &&
      this.dateRangeForm.controls.end.value
    )
      ranges = {
        between: [
          moment(this.dateRangeForm.controls.start.value).toISOString(),
          moment(this.dateRangeForm.controls.end.value).toISOString(),
        ],
      };

    return {
      [this.dateRangeProp]: ranges,
      [this.selectProp]: this.selectControl.value,
    };
  }
  public restartFilter() {
    this.dateRangeForm.reset();
    this.selectControl.reset()
  }
  ngOnInit(): void {
    this.dateRangeForm.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        if (value.start && value.end) {
          this.onChange.emit(this.values);
        }
      });
    this.selectControl.valueChanges
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((value) => {
        this.onChange.emit(this.values);
      });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
