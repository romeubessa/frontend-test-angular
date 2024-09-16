import { FormGroup } from "@angular/forms";

export interface Vehicle {
    id: string;
    brand: string;
    model: string;
    color: string;
    plate: string;
    type: string;
}

export class Vehicle implements Vehicle {
    constructor(
      public id: string,
      public brand: string,
      public model: string,
      public color: string,
      public plate: string,
      public type: string
    ) { }

    static fromForm(form: FormGroup): Vehicle {
        const formValues = form.getRawValue();
        return new Vehicle(
          formValues.id,
          formValues.brand,
          formValues.model,
          formValues.color,
          formValues.plate,
          formValues.type
        );
      }
}
