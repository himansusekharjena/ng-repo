import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material';
import axios from 'axios';

import { DialogComponent } from '../dialog/dialog.component';
import { planetsUrl } from '../../config';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  constructor(
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog
  ) { }

  loading = false;
  planets = [];
  pages = [];
  matchingPlanets = [];
  searchInput = '';
  maxPopulation = 0;

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
    }
  }
  
  ngAfterViewInit() {
    this.loading = true;
    const planets = localStorage.getItem('planets');
    if (planets) {
      this.planets = JSON.parse(planets);
      this.planets.forEach((p) => {
        const population = +p.population;
        if (population > this.maxPopulation) {
          this.maxPopulation = population
        }
      });
      this.loading = false;
    } else {
      axios(planetsUrl)
        .then(({ data }) => {
          this.planets = data.results || [];
          if (data.count && !isNaN(data.count) && this.planets.length > 0) {
            for (let i = 2; i <= Math.ceil(data.count / this.planets.length); i++) {
              this.pages.push(i);
            }
            this.getAllPlanets();
          }
        })
        .catch(console.error);
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  handleInput(searchInput) {
    const regEx = new RegExp(`^.*${searchInput.toLowerCase()}.*$`, 'ig');
    this.searchInput = searchInput;
    this.matchingPlanets = this.planets.filter(p => regEx.test(p.name.toLowerCase()));
  }

  getAllPlanets() {
    const promises = [];
    this.pages.forEach((pageNumber) => {
      promises.push(axios(`${planetsUrl}/?page=${pageNumber}`).then(res => res.data));
    })
    Promise.all(promises)
      .then((values) => {
        values.forEach((data) => {
          this.planets = [...this.planets, ...(data.results || [])];
        });
        this.loading = false;
        localStorage.setItem('planets', JSON.stringify(this.planets));
      })
      .catch(console.error);
  }

  getFontSize(population) {
    let populationPercent = (+population / this.maxPopulation) * 100;
    let remainder = populationPercent % 10;
    populationPercent = Math.ceil(populationPercent);
    if (populationPercent > 0 && populationPercent < 10) {
      return '16px';
    }
    else if (populationPercent > 10 && populationPercent < 20) {
      return '26px';
    }
    else if (populationPercent > 20 && populationPercent < 30) {
      return '36px';
    }
    else if (populationPercent > 30 && populationPercent < 40) {
      return '46px';
    }
    else if (populationPercent > 40 && populationPercent < 50) {
      return '56px';
    }
    else if (populationPercent > 50 && populationPercent < 60) {
      return '66px';
    }
    else if (populationPercent > 60 && populationPercent < 70) {
      return '76px';
    }
    else if (populationPercent > 70 && populationPercent < 80) {
      return '86px';
    }
    else if (populationPercent > 80 && populationPercent < 90) {
      return '96px';
    }
    else {
      return `${106 + (remainder === NaN ? 0 : remainder)}px`;
    }
  }

  handleLinkClick(e, planet) {
    e.preventDefault();
    this.dialog.open(DialogComponent, {
      width: '92%',
      data: { planet }
    });
  }
}
