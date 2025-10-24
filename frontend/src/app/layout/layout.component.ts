import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { saveAs } from 'file-saver';
import { LoaderComponent } from "../loader/loader.component";
import { BehaviorSubject } from 'rxjs';
import { NgIf } from '@angular/common';
import { DataService } from '../services/data.service';
import { environment } from '../../environments/environment.';


@Component({
  selector: 'app-layout',
  imports: [NgIf, MatSlideToggleModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatRadioModule, MatButtonModule, MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule, LoaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  message: string = '';
  loader: any;
  fileName: any;

  form = new FormGroup({
    angularVersion: new FormControl('', Validators.required),
    projectName: new FormControl('', Validators.required),
    ssr: new FormControl('', Validators.required),
    stylesheet: new FormControl('', Validators.required)
  })

  constructor(private httpClient: HttpClient, private dataService: DataService) {

    this.dataService.loader.subscribe(value => {
      this.loader = value;
    });

  }

  onSubmit() {
    if (this.form.valid) {
      this.fileName = this.form.value.projectName + '.zip';
      this.httpClient.post(environment.apiUrl, this.form.value, { responseType: "blob" })
        .subscribe((r) => {
          saveAs(r, this.fileName);
        }
        );
    }

  }
}