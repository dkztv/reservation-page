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

  activeSlot = "";

  static readonly WEEK_COUNT = 5;
  static readonly DAY_COUNT = 7;

  static readonly SELECTED_CALENDAR_DAY = 6;
  static readonly START_CALENDAR_DAY = 27;
  static readonly MONTH_LAST_DAY = 31;

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
    let currentDay = AppComponent.START_CALENDAR_DAY;
    for (let i = 0; i < AppComponent.WEEK_COUNT; i++) {
      let week = [];
      for (let j = 0; j < AppComponent.DAY_COUNT; j++) {
        week.push(currentDay);
        if (currentDay === AppComponent.MONTH_LAST_DAY) {
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
    return day === AppComponent.SELECTED_CALENDAR_DAY;
  }

  isLastMonthDay(day: number, week: Array<number>) : boolean {
    const isFoundWeekDay = week.find(weekDay => weekDay == AppComponent.MONTH_LAST_DAY);
    return day >= AppComponent.START_CALENDAR_DAY && isFoundWeekDay !== undefined;
  }

  selectSlot(slot: string) {
    this.activeSlot = this.activeSlot === slot ? "" : slot;
  }

  isSelectedSlot(slot: string) : boolean {
    return slot === this.activeSlot;
  }
}

export interface Guest {
  value: number;
  viewValue: string;
}
