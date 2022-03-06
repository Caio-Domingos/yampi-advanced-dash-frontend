import { MatDialog } from '@angular/material/dialog';
import { StoreCredentialsFormComponent } from './../../core/components/store-credentials-form/store-credentials-form.component';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YampiService } from 'src/services/yampi.service';

@Component({
  selector: 'yad-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private matDialog: MatDialog) {}

  ngOnInit(): void {}

  goTo(route: string) {
    this.router.navigateByUrl(route);
  }

  openStoreCredentialsModal() {
    const dialogRef = this.matDialog.open(StoreCredentialsFormComponent, {
      width: '50vw',
    });

    return dialogRef;
  }
}
