import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IPeople } from '../shared/interfaces/interfaces';
import { EMPTY_DATA } from '../shared/data.mock';

import { StarWarsService } from '../shared/services/star-wars.service';
import { Subject } from 'rxjs';

interface DropdownSelect {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})

export class PeopleComponent implements OnInit {
  count = 0;
  dataSource = new MatTableDataSource<any>(EMPTY_DATA.results);
  displayedColumns: string[] = ['name', 'homeworld', 'birth_year', 'films'];
  dropdownOptions: DropdownSelect[] = [
    {value: 'name', viewValue: 'Name'},
    {value: 'homeworld', viewValue: 'Home World'},
    {value: 'film', viewValue: 'Film'}
  ]
  errorMessage = '';
  filterType = 'name';
  filterText = ''; // with filterText: string; VSCode threw "Property 'filterText' has no initializer and is not definitely assigned in the constructor." "
  people: any; // TODO a 'person' should be defined as an interface imported from an interface file for the people array
  filteredPeople: any;// same interface as above
  name = 'name';
  homeWorld = 'homeWorld';
  film = 'film';
  next = '';
  previous = '';
  first = '';
  last = '';
  pageSize = 10;

  private destroy$ = new Subject();

  constructor(private starWarsService: StarWarsService) {
   }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort; 

  ngOnInit(): void {
    this.starWarsService.people$.pipe(takeUntil(this.destroy$)).subscribe(people => this.setPeople(people));
    this.dataSource.paginator = this.paginator;
  }

  setPeople(people: any) {
    this.filterText = ''
    this.errorMessage = '';
    this.count = people.count;
    this.next = people.next;
    this.previous = people.previous;
    this.people = this.getPlanets(people);
    this.people = this.getFilms(people);
    this.dataSource = new MatTableDataSource<IPeople>(people.results);
    this.dataSource.sort = this.sort;
  }

   /** this is to get the details of each items when a url is given */
   getPlanets(people: any) {
    people.results.map((person: { homeworld: string; }) => this.starWarsService.getPersonData(person.homeworld).pipe(takeUntil(this.destroy$)).subscribe(res => person.homeworld = res.name));
    return people;
  }

  getFilms(people: any) {
   people.results.forEach((result: any) => {
     const newArray: any[] = [];
     result.films.map((film: string) => {
       this.starWarsService.getPersonData(film).pipe(takeUntil(this.destroy$)).subscribe(res => newArray.push(res.title))
      });
      result.films = newArray;
   });

   return people;
  }

  selectFindBy(event: any) {
    this.filterType = event.source.value;
  }

  checkForPeople() {
    if (!this.people) {
      this.errorMessage = 'Please load people before filtering';

    }
    if (this.people || this.people && this.filterText === '') {
      this.errorMessage = '';

    }
  }

  applyPeopleFilter() {
    this.checkForPeople();
    const filterText = this.filterText.toLowerCase();
    if (this.people && this.filterType == this.name) {
       this.dataSource.data = this.people?.results.filter(
        (person: { name: string, homeworld: string, films: string[] }) => {
          const name = person.name.toLowerCase();
          return name.includes(filterText);
        }
      )
    }
    if (this.people && this.filterType == this.homeWorld) {
       this.dataSource.data = this.people?.results.filter(
        (person: { name: string, homeworld: string, films: string[] | any[] }) => {
          const homeworld = person.homeworld.toLowerCase();
          return homeworld.includes(filterText);
        }
      )
    }
    if (this.people && this.filterType == this.film) {
       this.dataSource.data = this.people?.results.filter(
        (person: { name: string | any[], homeworld: string | any[], films: string[] | any[] }) => {
          // TODO filter based on all films within the array
          return person.films[0].includes(this.filterText);
        }
      )
    }
  }

  handlePageEvent(event: any) {
    const nextPage = event.pageIndex + 1;
    const url = `https://swapi.dev/api/people/?page=${nextPage}`
    this.starWarsService.getMoreResults(url).pipe(takeUntil(this.destroy$)).subscribe(
      (people: any) =>  this.starWarsService.people$.next(people)
    );
  }

}
