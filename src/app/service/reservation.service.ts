import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {ReservationConverter} from "../converter/reservation-converter";

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http: HttpClient) {}

  getActualSlots(count: number = 2) : Observable<Array<string>> {
    const URL = `https://hostme-services-qa.azurewebsites.net/api/core/mb/restaurants/4530/availability?date=2018-11-25T12:00:00%2B03:00&partySize=${count}&rangeInMinutes=720`;
    return this.http.get(URL).pipe(
      map(responseObject => ReservationConverter.getDateArray(responseObject))
    );
  }
}
