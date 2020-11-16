import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export interface user{
  id:number
  name:string
}

@Component({
  selector: 'app-user-registry-view',
  templateUrl: './user-registry-view.component.html',
  styleUrls: ['./user-registry-view.component.scss']
})
export class UserRegistryViewComponent implements OnInit {

  @Input('users') users : user[]
  @Output() onChecked = new EventEmitter<number>()

  public displayedColumns = ["pos","name","check"]

  constructor() { }

  checkUser(){
  }

  ngOnInit(): void {
  }

}
