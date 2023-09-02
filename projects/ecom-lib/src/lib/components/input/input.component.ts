import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  @Input() class!: string;
  @Input() type!: string;
  @Input() placeholder!: string;
  @Input() controlName!: string;
  @Input() formGroup!: FormGroup;
}
