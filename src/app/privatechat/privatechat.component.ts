import { MessageApiService } from './../message-api.service';
import { MessageService } from './../message.service';
import { Component, OnInit } from '@angular/core';
import { user } from './../models/user';
import { AuthenticationService } from './../authentication.service';
import { FormGroup, FormControl , Validators, Form} from '@angular/forms';
import { Router ,NavigationExtras} from '@angular/router';
import { WebsocketService } from '../websocket.service';
import * as io from 'socket.io-client';
import { pipe, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
declare let toastr:any;
@Component({
  selector: 'app-privatechat',
  templateUrl: './privatechat.component.html',
  styleUrls: ['./privatechat.component.css']
})
export class PrivatechatComponent implements OnInit {
  socket : SocketIOClient.Socket;
  constructor(public authService:AuthenticationService,private router:Router,private WebsocketService:WebsocketService,private messageApiService:MessageApiService,private messageService:MessageService) {
    //console.log(this.router.getCurrentNavigation().extras.state.receiver)
   }
  receiver:string;
  backupmessages;any;
  modal:string;
  ngOnInit(): void {
      if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
   }
    const navigation = this.router.getCurrentNavigation();
    this.receiver = history.state.receiver;
    console.log("receiver:",this.receiver);
    if(this.receiver!=undefined){
    this.messageService.getMessages(this.receiver)
    .subscribe(
      messages => {
          console.log("messages",messages);
          if(messages['messages']!=[])
          this.loadMessages(messages['messages']);
      },
      error => {
        console.log("Errorrr",error);
      }
    );
    }
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
      toastr.success(data.message,"New Message");
      
    });
  }
  output:string[]=[];
  sender:string=localStorage.getItem('emailId');
  getMessages()
  {
    this.messageService.getMessages(this.receiver)
    .subscribe(
      messages => {
          console.log("messages");
          if(messages['messages']!=[])
          this.loadMessages(messages['messages']);
      },
      error => {
        console.log("Errorrr",error);
      }
    );
  }
  updateMessage(data:any):void
  {
    //console.log("data",data.message);
    this.output.push(data);
  }
  loadMessages(messageData:any)
  {
    let data;
    let startIndex=0;
    if(messageData.resetIndex && messageData.resetIndex[0].by==this.sender)
    startIndex=messageData.resetIndex[0].index;
    else if(messageData.resetIndex && messageData.resetIndex[1] && messageData.resetIndex[1].by==this.sender)
    startIndex=messageData.resetIndex[1].index;
    else
    startIndex=0;
    console.log(startIndex);
     for (let index = Number(startIndex)+1; index < messageData['messageContent'].length; index++) {
          const element = messageData['messageContent'][index];
          if(element.sent == this.sender)
          {
             data={sender:this.sender,flag:'s',message:element.message}
          }
          else
          {
            data={receiver:this.receiver,flag:'r',message:element.message}
          }
          console.log("reset",element.reset)
          if(element.reset==undefined)
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

   downloadAsJson()
   {
     if(this.receiver)
     {
          var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.output));
          var dlAnchorElem = document.getElementById('downloadasjson');
          dlAnchorElem.setAttribute("href",     dataStr     );
          dlAnchorElem.setAttribute("download", "messages.json");
          dlAnchorElem.click();
     }
     else
     {
          this.modal="Please enter a receiver's name";
          document.getElementById('alert').click();
     }
    
   }

   saveincloud()
   {
    if(this.receiver)
    {
       
      this.messageApiService.storeMessagesinCloud(this.sender,this.receiver).subscribe(
        data => {
          toastr.success("Backup Success",data['msg']);
           console.log("Successfully stored in cloud",data);
        },
        error => {
          
        }
      )
    }
    else
    {
         this.modal="Please enter a receiver's name";
         document.getElementById('alert').click();
    }
   }
  
   resetData()
   {
    if(this.receiver)
    {
       
      this.messageApiService.resetData(this.sender,this.receiver).subscribe(
        data => {
          toastr.success("Reset Success",data['msg']);
          this.output=[];
        },
        error => {
          
        }
      )
      }
      else
      {
          this.modal="Please enter a receiver's name";
          document.getElementById('alert').click();
      }
   }

}
