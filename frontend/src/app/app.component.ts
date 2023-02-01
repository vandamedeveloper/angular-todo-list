import { Component } from '@angular/core';
import { UserManagerService } from './shared/core/services/user-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public userManager: UserManagerService) {}
}
