import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

import { IEvent } from '../../interfaces/i-event';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  standalone: true,
  imports: [MatDialogModule, MatIcon, MatButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmModalComponent implements OnInit {
  public modalData: IEvent;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: IEvent,
    private dialogRef: MatDialogRef<ConfirmModalComponent>,
  ) {}

  public ngOnInit(): void {
    this.dialogRef.addPanelClass('confirm-modal');
    this.modalData = this.data;
  }

  public closeModal(value = false): void {
    this.dialogRef.close(value);
  }
}
