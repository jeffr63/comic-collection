import { MaxValidationError, MinValidationError, ValidationError } from '@angular/forms/signals';

export function toErrorMessages(errors: ValidationError[]): string[] {
  return errors.map((error) => {
    const message = error.message ?? this.getMessage(error);
    return message;
  });
}

function getMessage(error: ValidationError): string {
  switch (error.kind) {
    case 'required':
      return 'Value is required';
    case 'min':
      const eMin = error as MinValidationError;
      return `Minimum amount: ${eMin.min}`;
    case 'max':
      const eMax = error as MaxValidationError;
      return `Maximum amount: ${eMax.max}`;
    case 'publisher':
      return `Select publisher name from the list`;
    default:
      return error.kind ?? 'Validation Error';
  }
}
