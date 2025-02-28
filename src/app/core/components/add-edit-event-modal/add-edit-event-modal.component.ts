import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';

import { EControlNames } from '../../enums/e-control-names';
import { IEvent } from '../../interfaces/i-event';
import { ControlConverterPipe } from '../../pipes/control-converter/control-converter.pipe';
import { generateUniqueId } from '../../utils/functions';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-add-edit-event-modal',
  templateUrl: './add-edit-event-modal.component.html',
  styleUrls: ['./add-edit-event-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    //provideNativeDateAdapter(),
  ],
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatButton,
    MatCheckbox,
    MatIconButton,
    MatDialogModule,
    ReactiveFormsModule,
    ControlConverterPipe,
    MatDatepickerToggle,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
})
export class AddEditEventModalComponent implements OnInit {
  public formGroup: FormGroup;
  public EControlNames = EControlNames;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: IEvent,
    private dialogRef: MatDialogRef<AddEditEventModalComponent>,
    private fb: FormBuilder,
  ) {}

  public get getHeaderName(): string {
    return this.data ? 'Edit event' : 'Add event';
  }

  ngOnInit(): void {
    this.dialogRef.addPanelClass('add-edit-event-modal');
    this.initFormGroup(this.data);
  }

  public closeModal(): void {
    this.dialogRef.close();
  }

  public handleSubmit(): void {
    this.dialogRef.close({
      id: this.data?.id || generateUniqueId(),
      ...this.formGroup.getRawValue(),
    });
  }

  public clearName(): void {
    this.formGroup.get(EControlNames.NAME)?.reset(null);
  }

  private initFormGroup(event: IEvent): void {
    this.formGroup = this.fb.group({
      [EControlNames.NAME]: [event?.name || null, [Validators.required]],
      [EControlNames.START_DATE]: [
        event?.start_date || null,
        [Validators.required],
      ],
      [EControlNames.END_DATE]: [
        event?.end_date || null,
        [Validators.required],
      ],
      [EControlNames.IS_HOLIDAY]: [event?.is_holiday || null],
    });
  }
}
