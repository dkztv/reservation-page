import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ReservationService} from "./service/reservation.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  month = [];
  displayedWeekDays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  guests: Guest[] = [
    {value: 1, viewValue: '1 guest'},
    {value: 2, viewValue: '2 guests'},
    {value: 3, viewValue: '3 guests'},
    {value: 4, viewValue: '4 guests'}
  ];
  guestForm: FormGroup;

  actualSlots: Array<string> = [];

  activeSlot: '';

  private unsubscribe$ = new Subject();

  constructor(public reservationService: ReservationService) {
    this.guestForm = new FormGroup({
      guest: new FormControl(null)
    });

    this.guestForm.controls['guest'].setValue(this.guests[1].value);

    this.guestForm.controls['guest'].valueChanges.subscribe(newCount => {
      reservationService.getActualSlots(newCount).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(newSlots => {
        this.actualSlots = newSlots;
      });
    })
  }

  ngOnInit() {
    this.initCalendar();
    this.initActualSlots();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  initCalendar() {
    let currentDay = 27;
    for (let i = 0; i < 5; i++) {
      let week = [];
      for (let j = 0; j < 7; j++) {
        week.push(currentDay);
        if (currentDay == 31) {
          currentDay = 0;
        }
        currentDay++;
      }
      this.month.push(week);
    }
  }

  initActualSlots() {
    this.reservationService.getActualSlots().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe(newSlots => {
      this.actualSlots = newSlots;
      if (this.actualSlots[4])
        this.selectSlot(this.actualSlots[4])
    });
  }

  isSelectedDay(day: number) : boolean {
    return day == 6;
  }

  isLastMonthDay(day: number, week: Array<number>) : boolean {
    let isFoundWeekDay = week.find(weekDay => weekDay == 31);
    return day >= 27 && isFoundWeekDay != undefined;
  }

  selectSlot(slot) {
    this.activeSlot = this.activeSlot == slot ? '' : slot;
  }

  isSelectedSlot(slot: string) : boolean {
    return slot == this.activeSlot;
  }
}

export interface Guest {
  value: number;
  viewValue: string;
}
