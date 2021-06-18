import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RawPeople } from '../shared/interfaces/interfaces';
import { EMPTY_DATA } from '../shared/data.mock';

import { StarWarsService } from '../shared/services/star-wars.service';

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
  displayedColumns: string[] = ['name', 'homeWorld', 'birthYear', 'films'];
  dropdownOptions: DropdownSelect[] = [
    {value: 'name', viewValue: 'Name'},
    {value: 'homeWorld', viewValue: 'Home World'},
    {value: 'film', viewValue: 'Film'}
  ]
  errorMessage = '';
  filterType = 'name';
  filterText = ''; // with filterText: string; VSCode threw "Property 'filterText' has no initializer and is not definitely assigned in the constructor." "
  people: any; // TODO a 'person' should be defined as an interface imported from an interface file for the people array
  filteredPeople: any;// same interface as above

  next = '';
  previous = '';
  first = '';
  last = '';
  pageSize = 10;

  constructor(private starWarsService: StarWarsService) {
   }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort; 

  ngOnInit(): void {
    this.starWarsService.people$.subscribe(people => this.setPeople(people));
    this.dataSource.paginator = this.paginator;
  }

  setPeople(people: any) {
    this.filterText = ''
    this.errorMessage = '';
    this.count = people.count;
    this.next = people.next;
    this.previous = people.previous;
    this.people = people.results;
    this.dataSource = new MatTableDataSource<RawPeople>(people.results);
    this.dataSource.sort = this.sort;
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
    console.log('this.people ', this.people, this.filterType, this.filterText);
    this.checkForPeople();
    const filterText = this.filterText.toLowerCase();
    if (this.people && this.filterType == 'name') {
       this.dataSource.data = this.people?.filter(
        (person: { name: string, homeworld: string, films: string[] }) => {
          const name = person.name.toLowerCase();
          return name.includes(filterText);
        }
      )
    }
    if (this.people && this.filterType == 'homeWorld') {
       this.dataSource.data = this.people?.filter(
        (person: { name: string, homeworld: string, films: string[] | any[] }) => {
          const homeworld = person.homeworld.toLowerCase();
          console.log(homeworld);
          return homeworld.includes(filterText);
        }
      )
    }
    if (this.people && this.filterType == 'film') {
       this.dataSource.data = this.people?.filter(
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
    console.log(url);
    this.starWarsService.getMoreResults(url).subscribe(
      (people: any) =>  this.starWarsService.people$.next(people)
      );
  }

  /** this is to get the details of each items when a url is given */
  getPersonData(people: any ) {
    //this.starWarsService.getPersonData(people.results[0].homeworld).subscribe(res => console.log(res));

  }

  getPlanet(people: any) {

  }

  getFilms() {
    
  }

}
