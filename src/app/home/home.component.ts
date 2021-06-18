import { Component, OnInit } from '@angular/core';
import { MOCK_DATA } from '../shared/data.mock';
import { StarWarsService } from '../shared/services/star-wars.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private starWarsService: StarWarsService) { }

  ngOnInit(): void {
  }
  
  loadPeople(): void {
    this.starWarsService.getPeople().subscribe(
      (people: any) => this.useRealData(people),
      (error) => this.useMockData(error)
      );
  }

  useRealData(people: any): void {
    this.starWarsService.people$.next(people)
  }

  useMockData(error: any): void {
    console.log('fail', error, MOCK_DATA);
    this.starWarsService.people$.next(MOCK_DATA);
  }
}
