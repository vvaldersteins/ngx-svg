import { Component } from '@angular/core';

@Component({
  selector: 'svg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private width = 200;
  private radius = 1;
  title = 'app';

  inform(evt) {
    console.log(evt);
  }
}
