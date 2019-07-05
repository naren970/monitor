import {Component, Type, OnInit, OnDestroy} from '@angular/core';
import { MessageService } from '../services/message.service';
@Component({
  selector: 'message-bar',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  messages = [];
  message = "";

  constructor(private messageService: MessageService) { }

   ngOnInit() {
     this.messageService.getMessages().subscribe(message => {
      this.messages = message;
    });
    }

    sendMessage() {
      this.messageService.sendMessage(this.message);
      this.message = '';
    }
}
