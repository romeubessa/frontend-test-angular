import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { EstablishmentService } from '../../services/establishments/establishment.service';
import { Establishment } from '../../models/establishment.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-establishments',
  standalone: true,
  imports: [MatTableModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './establishments.component.html',
  styleUrl: './establishments.component.scss'
})
export class EstablishmentsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'address', 'phone', 'motorcycleSpots', 'carSpots', 'options'];
  dataSource: Establishment[] = [];
  @ViewChild('createEstablishment') createEstablishment!: TemplateRef<any>;
  isEdit: boolean = false;
  establishmentEdit: Establishment | undefined;
  establishmentDelete: Establishment | null = null;
  establishmentForm: FormGroup;

  constructor(
    private service: EstablishmentService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private snackBar: MatSnackBar
    ) {
      this.establishmentForm = this.fb.group({
        name: ['', Validators.required],
        cnpj: ['', Validators.required],
        address: ['', Validators.required],
        phone: ['', Validators.required],
        motorcycleSpots: ['', Validators.required],
        carSpots: ['', Validators.required]
      });
    }

  ngOnInit(): void {
    this.findEstablishments();
  }

  findEstablishments() {
    this.service.getAll().subscribe({
      next: data => {
        if (data.body) {
          this.dataSource = data.body.establishments;
        }
      },
      error: (err: any) => {
      }
    })
  }

  openCreate() {
    this.establishmentForm.reset();
    this.modalService.open(this.createEstablishment, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  openConfirmDeleteModal(establishment: Establishment, modal: TemplateRef<any>) {
    this.establishmentDelete = establishment;
    this.modalService.open(modal, {
      backdrop: 'static',
      keyboard: false
    });
  }

  deleteConfirmed() {
    if (this.establishmentDelete) {
      this.service.delete(this.establishmentDelete.id).subscribe({
        next: (response) => {
          this.onMessage('Deleted', '', 2000);
          this.closeModal();
          this.findEstablishments();
        },
        error: (err) => {
          this.closeModal();
          this.onMessage(err.error.message, '', 2000);
        }
      });
    }
    this.establishmentDelete = null;
  }


  closeModal() {
    this.modalService.dismissAll();
    this.isEdit = false;
  }

  onSubmit() {
    if (this.establishmentForm.valid) {
      if (!this.isEdit) {
        this.create();
      } else {
        this.edit();
      }
    } else {
      this.onMessage('Invalid form. Please verify!', '', 2000);
      this.establishmentForm.markAllAsTouched();
    }
  }

  onEdit(establishment: Establishment) {
    this.establishmentEdit = establishment;
    this.isEdit = true;
    this.establishmentForm.reset();
    this.establishmentForm.patchValue({
      name: establishment.name,
      cnpj: establishment.cnpj,
      address: establishment.address,
      phone: establishment.phone,
      motorcycleSpots: establishment.motorcycleSpots,
      carSpots: establishment.carSpots
    });
    this.modalService.open(this.createEstablishment, { ariaLabelledBy: 'modal-basic-title', backdrop: 'static' });
  }

  create() {
    const establishment = Establishment.fromForm(this.establishmentForm);
    this.service.create(establishment).subscribe({
      next: data => {
        if (data) {
          this.onMessage('Success to create', '', 2000);
          this.closeModal();
          this.findEstablishments();
        }
      },
      error: (err: any) => {
        this.onMessage(err.error.message, '', 2000);
      }
    })
  }

  edit() {
    const establishment = Establishment.fromForm(this.establishmentForm);
    if (this.establishmentEdit) {
      this.service.update(this.establishmentEdit.id, establishment).subscribe({
        next: data => {
          if (data) {
            this.onMessage('Success to create', '', 2000);
            this.closeModal();
            this.findEstablishments();
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
