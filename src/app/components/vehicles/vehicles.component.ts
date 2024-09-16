import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicles/vehicle.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class VehiclesComponent implements OnInit {

  displayedColumns: string[] = ['brand', 'model', 'color', 'plate', 'type', 'options'];
  dataSource: Vehicle[] = [];
  @ViewChild('createVehicle') createVehicle!: TemplateRef<any>;
  isEdit: boolean = false;
  vehicleEdit: Vehicle | undefined;
  vehicleDelete: Vehicle | null = null;
  vehicleForm: FormGroup;
  types = ['CAR', 'MOTORCYCLE']

  constructor(
    private service: VehicleService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private snackBar: MatSnackBar
    ) {
      this.vehicleForm = this.fb.group({
        brand: ['', Validators.required],
        model: ['', Validators.required],
        color: ['', Validators.required],
        plate: ['', Validators.required],
        type: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.findVehicles();
  }

  findVehicles() {
    this.service.getAll().subscribe({
      next: data => {
        if (data.body) {
          this.dataSource = data.body.vehicles;
        }
      },
      error: (err: any) => {
      }
    })
  }

  openCreate() {
    this.vehicleForm.reset();
    this.modalService.open(this.createVehicle, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  openConfirmDeleteModal(vehicle: Vehicle, modal: TemplateRef<any>) {
    this.vehicleDelete = vehicle;
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false
    });
  }

  deleteConfirmed() {
    if (this.vehicleDelete) {
      this.service.delete(this.vehicleDelete.id).subscribe({
        next: (response) => {
          this.onMessage('Deleted', '', 2000);
          this.closeModal();
          this.findVehicles();
        },
        error: (err) => {
          this.closeModal();
          this.onMessage(err.error.message, '', 2000);
        }
      });
    }
    this.vehicleDelete = null;
  }


  closeModal() {
    this.modalService.dismissAll();
    this.isEdit = false;
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      if (!this.isEdit) {
        this.create();
      } else {
        this.edit();
      }
    } else {
      this.onMessage('Invalid form. Please verify!', '', 2000);
      this.vehicleForm.markAllAsTouched();
    }
  }

  onEdit(vehicle: Vehicle) {
    this.vehicleEdit = vehicle;
    this.isEdit = true;
    this.vehicleForm.reset();
    this.vehicleForm.patchValue({
      brand: vehicle.brand,
      model: vehicle.color,
      color: vehicle.model,
      plate: vehicle.plate,
      type: vehicle.type
    });
    this.modalService.open(this.createVehicle, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  create() {
    const vehicle = Vehicle.fromForm(this.vehicleForm);
    this.service.create(vehicle).subscribe({
      next: data => {
        if (data) {
          this.onMessage('Success to create', '', 2000);
          this.closeModal();
          this.findVehicles();
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })
  }

  edit() {
    const vehicle = Vehicle.fromForm(this.vehicleForm);
    if (this.vehicleEdit) {
      this.service.update(this.vehicleEdit.id, vehicle).subscribe({
        next: data => {
          if (data) {
            this.onMessage('Success to edit', '', 2000);
            this.closeModal();
            this.findVehicles();
          }
        },
        error: (err: any) => {
          this.onMessage(err.error.message, '', 2000);
        }
      })
    }
  }

  private onMessage(message: string, action: string, duration: number) {
    this.snackBar.open(message, action, { duration: duration, verticalPosition: 'top', horizontalPosition: 'left' })
  }
}
