import { NgModule } from '@angular/core';
import { MatButtonModule, MatGridListModule, MatToolbarModule, MatFormFieldModule, 
  MatInputModule, MatRadioModule, MatSelectModule, MatDatepickerModule, MatCheckboxModule, 
  MatNativeDateModule, MatSortModule, MatPaginatorModule, MatIconModule, MatTableModule, 
  MatSnackBarModule, 
  MatDialogModule} from "@angular/material";

const MaterialComponents = [ 
  MatButtonModule, 
  MatToolbarModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatTableModule,
  MatIconModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
