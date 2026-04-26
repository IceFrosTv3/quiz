/* eslint-disable @angular-eslint/directive-selector */
import {Directive, inject} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: 'input[formControlName]',
  standalone: true,
  host: {
    '[class.invalid]': 'showError'
  }
})
export class InputErrorDirective {
  private readonly ngControl = inject(NgControl);

  get showError() {
    const control = this.ngControl.control;
    if (!control) return;
    return control.invalid && control.touched
  }

}
