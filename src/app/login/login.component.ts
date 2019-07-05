import {Component, Type, OnInit, OnDestroy} from '@angular/core';
import { MessageService } from '../services/message.service';
import * as io from 'socket.io-client';
import * as _ from "lodash";
import {Observable} from 'rxjs';

@Component({
  selector: 'login-bar',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private messageService: MessageService) { }
  serviceData = [];
  private _configUrl = "http://localhost:3000";  // URL to web API
  private socket;

   ngOnInit() {
     this.messageService.getServiceData().subscribe(res => {
      this.serviceData = res;
    });

    this.socket = io(this._configUrl);
    this.socket.on('data_upated', (data) => {
      console.log('I got reqUpdate from Server1');
      this.messageService.getServiceData().subscribe(res => {
        this.serviceData = res;
      });
    });

    /*this.messageService.getMessages().subscribe(res => {
      console.log('The data', res);
      this.serviceData = res;
    });*/

  }
}
