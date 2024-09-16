import { FormGroup } from "@angular/forms";
import { Establishment } from "./establishment.model";
import { Vehicle } from "./vehicle.model";

export interface Transaction {
    id: string;
    establishment: Establishment;
    vehicle: Vehicle;
    entryDate: Date;
    exitDate: Date;
}

export class Transaction implements Transaction {
    constructor(
        public id: string,
        public establishment: Establishment,
        public vehicle: Vehicle,
        public entryDate: Date,
        public exitDate: Date
    ) { }

    static fromForm(form: FormGroup): Transaction {
        const formValues = form.getRawValue();
        return new Transaction(
          formValues.id,
          formValues.establishment,
          formValues.vehicle,
          formValues.entryDate,
          formValues.exitDate
        );
      }
}
