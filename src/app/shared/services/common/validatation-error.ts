import { MaxValidationError, MinValidationError, ValidationError } from '@angular/forms/signals';

export const getError = (error: ValidationError) => {
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
};
