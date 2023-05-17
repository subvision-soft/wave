import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'subapp';
  tabs = [
    { icon: 'iconoirHome', label: 'Home', link: '/home' },
    { icon: 'iconoirCamera', label: 'Camera', link: '/camera' }];

}
