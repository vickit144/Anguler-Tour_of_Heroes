import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  //Must be public since you are going to bind it in the template
  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
