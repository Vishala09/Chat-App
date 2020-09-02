import { MessageService } from './../message.service';
import { Component, OnInit } from '@angular/core';
import { user } from './../models/user';
import { AuthenticationService } from './../authentication.service';
import { FormGroup, FormControl , Validators, Form} from '@angular/forms';
import { Router ,NavigationExtras} from '@angular/router';
import { WebsocketService } from '../websocket.service';
import * as io from 'socket.io-client';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
declare let toastr:any;
@Component({
  selector: 'app-privatechat',
  templateUrl: './privatechat.component.html',
  styleUrls: ['./privatechat.component.css']
})
export class PrivatechatComponent implements OnInit {
  socket : SocketIOClient.Socket;
  constructor(public authService:AuthenticationService,private router:Router,private WebsocketService:WebsocketService,private messageService:MessageService) {
    //console.log(this.router.getCurrentNavigation().extras.state.receiver)
   }
  receiver:string;
  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.receiver = history.state.receiver;
    console.log("receiver:",this.receiver);
    this.messageService.getMessages(this.receiver)
    .subscribe(
      messages => {
          console.log("messages",messages);
          if(messages['messages']!=[])
          this.loadMessages(messages['messages'][0]);
      },
      error => {
        console.log("Errorrr",error);
      }
    );
    // this.WebsocketService.listen('chat').subscribe((data)=>{
    //       this.updateMessage(data);
    // });
    this.WebsocketService.emit("user_connected",this.sender);
    this.WebsocketService.listen('user_connected').subscribe((data)=>{
            console.log("userconnected data",data);
    });
    this.WebsocketService.listen("new_message").subscribe((data) => {
      console.log("received data",data);
      data['flag']='r';
      this.updateMessage(data);
      toastr.success("New Message",data.message);
      
    });
  }
  output:string[]=[];
  sender:string=localStorage.getItem('emailId');
  
  updateMessage(data:any):void
  {
    //console.log("data",data.message);
    this.output.push(data);
  }
  loadMessages(messageData:any)
  {
    let data;
     for (let index = 0; index < messageData['messageContent'].length; index++) {
          const element = messageData['messageContent'][index];
          if(element.sent == this.sender)
          {
             data={sender:this.sender,flag:'s',message:element.message}
          }
          else
          {
            data={receiver:this.receiver,flag:'r',message:element.message}
          }
          this.output.push(data);
     }
    
  }
  //handle:string;
  message:string;
  sendMessage():void
  { 
    let senderr = localStorage.getItem('emailId');
    this.updateMessage({sender:senderr,message:this.message,flag:"s"});
    console.log( {
      sender: senderr,
      receiver: this.receiver,
      message: this.message
    })
    this.WebsocketService.emit("send_message", {
      sender: this.sender,
      receiver: this.receiver,
      message: this.message
    });
  //   // this.WebsocketService.emit('chat',{
  //   //   message:this.message,
  //   //   handle:this.receiver
  //   // })
    
   }
}
