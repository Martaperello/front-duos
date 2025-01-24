import { Component } from '@angular/core';
import { LayoutService } from './Shared/services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showLayout$ = this.layoutService.showLayout$;
  constructor(private layoutService: LayoutService) {}
}
