import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

export interface SearchBarConfig {
  debounceTime?: number;
  icon?: string;
  placeholder?: string;
}

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor() {}

  private onDestroy$ = new Subject<any>();

  public searchControl = new FormControl('', []);

  public valueChange$ = new BehaviorSubject<string>('');

  @Output('onSearch') public onSearch = new EventEmitter<string>();

  @Input('config') public config: SearchBarConfig = {
    debounceTime: 500,
    icon: 'search',
    placeholder: 'Buscar...',
  };

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(takeUntil(this.onDestroy$), debounceTime(this.config.debounceTime))
      .subscribe((value) => {
        this.valueChange$.next(value);
        this.onSearch.emit(value);
      });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  toQueryLanguage(props?: string[]) {
    let query = { like: this.valueChange$.value, options: 'i' };
    if (props && props.length)
      return props.map((prop) => <any>{ [prop]: query });
    return query;
  }
}
