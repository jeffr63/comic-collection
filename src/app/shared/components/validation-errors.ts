import { Component, input } from '@angular/core';
import { MaxValidationError, MinValidationError, ValidationError } from '@angular/forms/signals';

@Component({
  selector: 'app-validation-errors',
  imports: [],
  template: `
    @if (errors()) {
      @for (error of errors(); track error.kind) {
        {{ getError(error) }}
      }
    }
  `,
  styles: ``,
})
export class ValidationErrors {
  errors = input<ValidationError[]>([]);

  getError(error: ValidationError) {
    if (error.message) {
      return error.message;
    }

    let message = '';

    switch (error.kind) {
      case 'required':
        message = 'Value is required';
        break;
      case 'min':
        const eMin = error as MinValidationError;
        message = `Minimum amount: ${eMin.min}`;
        break;
      case 'max':
        const eMax = error as MaxValidationError;
        message = `Maximum amount: ${eMax.max}`;
        break;
      default:
        message = error.kind ?? 'Validation Error';
    }
    return message;
  }
}
