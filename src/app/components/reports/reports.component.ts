import { Component, OnInit } from '@angular/core';
import { ReportService } from '../../services/reports/report.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Establishment } from '../../models/establishment.model';
import { EstablishmentService } from '../../services/establishments/establishment.service';
import { HourlySummary } from '../../models/hourly.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {

  establishments: Establishment[] = [];
  selectedEstablishment: string = '';
  startDate: string = '';
  endDate: string = '';

  summary: any;
  hourlySummary: HourlySummary[] = [];
  vehicleMovements: any;

  constructor(private reportService: ReportService, private establishmentService: EstablishmentService, private snackBar: MatSnackBar) {}

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

  getSummary() {
    if (this.selectedEstablishment) {
      this.reportService.getParkingSummary(this.selectedEstablishment).subscribe({
        next: (data) => {
          this.summary = data;
        },
        error: (err) => {
          this.onMessage(err.error.message, '', 2000);
        }
      });
    } else {
      this.onMessage('Enter the establishment', '', 2000);
    }
  }

  getHourlySummary() {
    if (this.selectedEstablishment) {
      this.reportService.getHourlyParkingSummary(this.selectedEstablishment).subscribe({
        next: (data) => {
          this.hourlySummary = data.summaries;
        },
        error: (err) => {
          this.onMessage(err.error.message, '', 2000);
        }
      });
    } else {
      this.onMessage('Enter the establishment', '', 2000);
    }
  }

  getVehicleMovements() {
    if (this.selectedEstablishment) {
      this.reportService.getVehicleMovementReport(this.selectedEstablishment, this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.vehicleMovements = data.movements;
        },
        error: (err) => {
          this.onMessage(err.error.message, '', 2000);
        }
      });
    } else {
      this.onMessage('Enter the establishment', '', 2000);
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
