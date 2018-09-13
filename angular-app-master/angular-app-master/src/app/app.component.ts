import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }

  logout() {
    if (localStorage.getItem('user')) {
      localStorage.removeItem('user');
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
