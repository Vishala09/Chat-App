import { MessageService } from './message.service';
import { WebsocketService } from './websocket.service';
import { AuthenticationService } from './authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Routes,RouterModule} from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HttpClientModule} from  '@angular/common/http';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import { MessageComponent } from './message/message.component';
import { PrivatechatComponent } from './privatechat/privatechat.component';
import { FrontComponent } from './front/front.component';

const appRoutes:Routes=[
  {path:'',component:FrontComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'messages/all',component:MessageComponent},
  {path:'privateChat',component:PrivatechatComponent}
]
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    MessageComponent,
    PrivatechatComponent,
    FrontComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthenticationService,WebsocketService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
