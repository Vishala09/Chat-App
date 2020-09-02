import { user } from './../models/user';
import { MessageService } from './../message.service';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl , Validators, Form} from '@angular/forms';
import { Router,NavigationExtras} from '@angular/router';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(public authService:AuthenticationService,private router:Router,private messageService:MessageService) { }
  allUsers;
  allContacts;
  search:string;
  searchedData:string[]=[];
  showUser:user = {userId:"",password:"",emailId:""}
  clk:boolean=false;
  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/login']);
   }
   else
   {
    this.authService.getAllUsers()
    .subscribe(
      allusers => {
        
        this.allUsers=allusers['emailIds'];
        console.log(this.allUsers,"all users");
      },
      error => {
        console.log("Errorrr",error);
      }
    );
    this.messageService.getContactsData()
    .subscribe(
      contacts => {
        this.allContacts=contacts;
        console.log(this.allContacts,"all allContacts");
      },
      error => {
        console.log("Errorrr",error);
      }
    );
   }
  }
  getRandomColor()
  {
    return "#"+((1<<24)*Math.random()|0).toString(16)
  }
  searchContacts()
  { //console.log("searching...",this.search,this.allUsers.length)
    this.searchedData=[];
     for(let i=0;i<this.allUsers.length;i++)
     {
     
       if(this.allUsers[i].emailId.includes(this.search))
       {
         if(!this.searchedData.includes(this.allUsers[i].emailId))
          {

           this.searchedData.push(this.allUsers[i].emailId);
          }
       }
     }
     if(this.search=="")
     {
       this.searchedData=[];
     }
  }
  
  openChatWindow(data)
  {
     //console.log(event.target.innerText)
     const navigationExtras: NavigationExtras = {
      state: {
        receiver : data
      }
    };
     this.router.navigate(["privateChat"],navigationExtras)
  }

  showUserInfo(user)
  {
    this.clk=true;
    this.showUser.emailId=user.emailId;
    this.showUser.userId=user.userId;
    document.getElementById('userInfo').style.display="inline";
  }
}
