import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../services/transactions/transaction.service';
import { EstablishmentService } from '../../services/establishments/establishment.service';
import { Establishment } from '../../models/establishment.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {

  establishments: Establishment[] = [];
  selectedEstablishment: string | undefined;
  vehiclePlate: string = '';

  constructor(
    private service: TransactionService,
    private establishmentService: EstablishmentService,
    private snackBar: MatSnackBar
    ) {
    }

  ngOnInit(): void {
    this.findEstablishments();
  }

  findEstablishments() {
    this.establishmentService.getAll().subscribe({
      next: data => {
        if (data.body) {
          this.establishments = data.body.establishments;
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })
  }

  registerEntry() {
    if (this.selectedEstablishment && this.vehiclePlate) {
      this.service.entry(this.selectedEstablishment, this.vehiclePlate).subscribe({
        next: data => {
          if (data) {
            this.onMessage('Entry registred', '', 2000);
            this.selectedEstablishment = '';
            this.vehiclePlate = '';
          }
        },
        error: (err: any) => {
          this.onMessage(err.error.message, '', 2000);
        }
      })
    } else {
      this.onMessage('Enter the fields', '', 2000);
    }
  }

  registerExit() {
    if (this.selectedEstablishment && this.vehiclePlate) {
      this.service.exit(this.selectedEstablishment, this.vehiclePlate).subscribe({
        next: data => {
          if (data) {
            this.onMessage('Exit registred', '', 2000);
            this.selectedEstablishment = '';
            this.vehiclePlate = '';
          }
        },
        error: (err: any) => {
          this.onMessage(err.error.message, '', 2000);
        }
      })
    } else {
      this.onMessage('Enter the fields', '', 2000);
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
