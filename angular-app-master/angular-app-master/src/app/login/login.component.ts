import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgModule } from '@angular/core';
import { Router } from "@angular/router";
import axios from 'axios';

import { peopleUrl } from '../../config';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) { }

  loading = false;
  errorMessage = '';
  inputs = {
    name: '',
    password: ''
  };
  users = [];
  pages = [];

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.router.navigate(['/']);
    }
  }

  ngAfterViewInit() {
    this.loading = true;
    const people = localStorage.getItem('people');
    if (people) {
      this.users = JSON.parse(people);
      this.loading = false;
    } else {
      axios(peopleUrl)
        .then(({ data }) => {
          this.users = data.results || [];
          if (data.count && !isNaN(data.count) && this.users.length > 0) {
            for (let i = 2; i <= Math.ceil(data.count / this.users.length); i++) {
              this.pages.push(i);
            }
            this.getAllNames();
          }
        })
        .catch(console.error);
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  getAllNames() {
    const promises = [];
    this.pages.forEach((pageNumber) => {
      promises.push(axios(`${peopleUrl}/?page=${pageNumber}`).then(res => res.data));
    })
    Promise.all(promises)
      .then((values) => {
        values.forEach((data) => {
          this.users = [...this.users, ...(data.results || [])];
        });
        this.loading = false;
        localStorage.setItem('people', JSON.stringify(this.users));
      })
      .catch(console.error);
  }

  setErrorMessage(message) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 4000);
  }

  login() {
    let { name } = this.inputs;
    const { password } = this.inputs;
    name = name.toLocaleLowerCase();
    const user = this.users.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (user) {
      if (name === user.name.toLowerCase() && password === user.birth_year) {
        localStorage.setItem('user', JSON.stringify({ name, password }));
        this.router.navigate(['/'], { replaceUrl: true });
      } else {
        this.setErrorMessage("Username/password doesn't match");
      }
    } else {
      this.setErrorMessage("User doesn't exist");
      this.inputs.name = '';
      this.inputs.password = '';
    }
  }

}
