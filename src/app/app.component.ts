import { AuthenticationService } from './authentication.service';

import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatApp';
  constructor(public auth:AuthenticationService) { 
    
  }
  currentUser; 
}
