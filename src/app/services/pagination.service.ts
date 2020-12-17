import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  readonly PAGES = [10, 25, 50, 100];

  readonly PAGINATION_KEY = 'pag_';

  constructor() {}

  public get pagination() {
    let pag = Number(localStorage.getItem(this.PAGINATION_KEY));
    pag = typeof pag === 'number' ? pag : this.PAGES[0];
    pag = this.PAGES.some((page) => page === pag) ? pag : this.PAGES[0];
    return pag;
  }

  public set pagination(pages: number) {
    localStorage.setItem(this.PAGINATION_KEY, pages.toString());
  }
}
