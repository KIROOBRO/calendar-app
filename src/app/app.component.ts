import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AsyncPipe, DatePipe, NgClass, SlicePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, Self } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import {
  MatSlideToggle,
  MatSlideToggleChange,
} from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { filter } from 'rxjs';

import { AddEditEventModalComponent } from './core/components/add-edit-event-modal/add-edit-event-modal.component';
import { ConfirmModalComponent } from './core/components/confirm-modal/confirm-modal.component';
import { MOK_DAYS_IN_WEEK } from './core/constants/mok-days-in-week';
import { ECalendarViewType } from './core/enums/e-calendar-view-type';
import { MomentDateHelper } from './core/helpers/moment-date.helper';
import { ICurrentWeek } from './core/interfaces/i-current-week';
import { IEvent } from './core/interfaces/i-event';
import { CalendarService } from './core/services/calendar.service';
import { TCalendarViewType } from './core/types/t-calendar-view.type';

@Component({
  selector: 'app-root',
  imports: [
    MatButton,
    MatSlideToggle,
    DatePipe,
    NgClass,
    AsyncPipe,
    SlicePipe,
    MatTooltip,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public events$ = this.calendarService.getEvents;

  public ECalendarViewType = ECalendarViewType;
  public MOK_DAYS_IN_WEEK = MOK_DAYS_IN_WEEK;

  public viewType: TCalendarViewType = 'month';
  public viewDate = MomentDateHelper.getCurrentDate();
  public currentWeek: ICurrentWeek = {
    days: [],
  };

  public weeksInMonth: ICurrentWeek[] = [];

  constructor(
    @Self() private readonly destroyRef$: DestroyRef,
    private dialog: MatDialog,
    private alert: MatSnackBar,
    private calendarService: CalendarService,
  ) {}

  ngOnInit(): void {
    this.calendarService.initCalendarData();
    this.generateCalendar();
  }

  public handlePrevious(): void {
    if (this.viewType === 'month') {
      this.viewDate = MomentDateHelper.getStartPreviousMonth(this.viewDate);
    } else if (this.viewType === 'week') {
      this.viewDate = MomentDateHelper.getStartPreviousWeek(this.viewDate);
    }

    this.generateCalendar();
  }

  public handleNext(): void {
    if (this.viewType === 'month') {
      this.viewDate = MomentDateHelper.getNextMonthPeriod(this.viewDate);
    } else if (this.viewType === 'week') {
      this.viewDate = MomentDateHelper.getNextWeekPeriod(this.viewDate);
    }

    this.generateCalendar();
  }

  public changeView(event: MatSlideToggleChange): void {
    this.viewType = event.checked
      ? ECalendarViewType.WEEK
      : ECalendarViewType.MONTH;

    this.generateCalendar();
  }

  public handleAddEditEvent(
    event: IEvent | null = null,
    eventDate: string | null = null,
  ): void {
    const dialogConfig = new MatDialogConfig<IEvent>();
    dialogConfig.autoFocus = false;
    dialogConfig.data = event;

    this.dialog
      .open(AddEditEventModalComponent, dialogConfig)
      .afterClosed()
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef$))
      .subscribe((res: IEvent) => {
        if (event) {
          this.calendarService.editEvent(res, eventDate as string);

          this.alert.open(
            'The event has been successfully edited!',
            'Success',
            {
              duration: 5000,
            },
          );
          return;
        }

        this.calendarService.addEvent(res);
        this.alert.open('The event has been successfully added!', 'Success', {
          duration: 5000,
        });
      });
  }

  public handleDeleteEvent(
    mouseEvent: MouseEvent,
    event: IEvent,
    eventDate: string,
  ): void {
    mouseEvent.stopImmediatePropagation();

    const dialogConfig = new MatDialogConfig<IEvent>();
    dialogConfig.autoFocus = false;
    dialogConfig.data = event;

    this.dialog
      .open(ConfirmModalComponent, dialogConfig)
      .afterClosed()
      .pipe(filter(Boolean), takeUntilDestroyed(this.destroyRef$))
      .subscribe(() => {
        this.calendarService.deleteEvent(event.id, eventDate);

        this.alert.open('The event has been successfully deleted!', 'Success', {
          duration: 5000,
        });
      });
  }

  public handleDropEvent(event: CdkDragDrop<any>): void {
    console.log(event.container.data);
    console.log(event.previousIndex);
    console.log(event.currentIndex);

    console.log(event);

    if (event.previousContainer === event.container) {
      //console.log(123);
      //console.log(event.container.data);
      //console.log(event.previousIndex);
      //console.log(event.currentIndex);
      //moveItemInArray(
      //event.container.data,
      //event.previousIndex,
      //event.currentIndex,
      //);
    } else {
      console.log(444);
      //transferArrayItem(
      //event.previousContainer.data,
      //event.container.data,
      //event.previousIndex,
      //event.currentIndex
      //);
    }
  }

  private generateCalendar(): void {
    if (this.viewType === 'month') {
      this.generateMonthCalendar();
    } else if (this.viewType === 'week') {
      this.generateWeekCalendar();
    }
  }

  private generateMonthCalendar(): void {
    this.weeksInMonth = [];
    const startOfMonth = MomentDateHelper.getStartDateInCurrentMonth(
      this.viewDate,
    );
    const endOfMonth = MomentDateHelper.getEndDateInCurrentMonth(this.viewDate);
    const currentStartOfMonth =
      MomentDateHelper.getStartDateInCurrentMonthForView(this.viewDate);
    const currentEndOfMonth = MomentDateHelper.getEndDateInCurrentMonthForView(
      this.viewDate,
    );

    const date = startOfMonth.clone();

    while (MomentDateHelper.isDateBefore(date, endOfMonth)) {
      const week: ICurrentWeek = {
        days: [],
      };

      for (let i = 0; i < 7; i++) {
        week.days.push({
          date: date.format('YYYY-MM-DD'),
          dayOfMonth: date.date(),
          isToday: MomentDateHelper.isDateToday(date.toDate()),
          isNotInThisMonth: !MomentDateHelper.isDateInThisMonth(
            date,
            currentStartOfMonth,
            currentEndOfMonth,
          ),
        });
        date.add(1, 'day');
      }

      this.weeksInMonth.push(week);
    }
  }

  private generateWeekCalendar(): void {
    const startOfWeek = MomentDateHelper.getStartOfWeek(this.viewDate);
    const endOfWeek = MomentDateHelper.getEndOfWeek(this.viewDate);
    const date = startOfWeek.clone();
    this.currentWeek.days = [];

    while (MomentDateHelper.isDateBefore(date, endOfWeek)) {
      this.currentWeek.days.push({
        date: date.format('YYYY-MM-DD'),
        dayOfMonth: date.date(),
        isToday: MomentDateHelper.isDateToday(date.toDate()),
        isNotInThisMonth: false,
      });
      date.add(1, 'day');
    }
  }
}
