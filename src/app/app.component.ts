import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteSelectedEvent, MatAutocompleteModule } from '@angular/material/autocomplete';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatChipsModule,
    FormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  specialityCtrl = new FormControl('');
  filteredSpecialities: Observable<string[]>;
  allSpecialities: string[] = [
    'Fullstack',
    'Backend',
    'API',
    'Consultancy',
    'Architecture Design',
    'AI',
    'Integration',
    'Problem Solving',
    'DevOps',
    'SecOps',
    'Cloud',
    'Automation',
    'XR/VR/AR/MR',
  ];
  specialities: string[] = this.allSpecialities;


  @ViewChild('specialityInput') specialityInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor() {
    this.filteredSpecialities = this.specialityCtrl.valueChanges.pipe(
      startWith(null),
      map((speciality: string | null) => (speciality ? this._filter(speciality) : this.allSpecialities.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    const filterValue = value.toLowerCase();
    if (this.specialities.filter(speciality => speciality.toLowerCase().includes(filterValue)).length === 0) {
      this.specialities.push(value);
    }

    event.chipInput!.clear();

    this.specialityCtrl.setValue(null);
  }

  remove(speciality: string): void {
    const index = this.specialities.indexOf(speciality);

    if (index >= 0) {
      this.specialities.splice(index, 1);

      this.announcer.announce(`Removed ${speciality}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const filterValue = event.option.viewValue.toLowerCase();
    if (this.specialities.filter(speciality => speciality.toLowerCase().includes(filterValue)).length === 0) {
      this.specialities.push(event.option.viewValue);
    }
    this.specialityInput && (this.specialityInput.nativeElement.value = '');
    this.specialityCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSpecialities.filter(speciality => speciality.toLowerCase().includes(filterValue));
  }
}
