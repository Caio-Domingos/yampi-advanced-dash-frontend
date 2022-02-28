import { MatDialogRef } from '@angular/material/dialog';
import { YampiService } from './../../../../services/yampi.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'yad-store-credentials-form',
  templateUrl: './store-credentials-form.component.html',
  styleUrls: ['./store-credentials-form.component.scss'],
})
export class StoreCredentialsFormComponent implements OnInit {
  yAlias: string = '';
  yToken: string = '';
  yKey: string = '';

  constructor(
    private yampiService: YampiService,
    public dialogRef: MatDialogRef<StoreCredentialsFormComponent>
  ) {}

  ngOnInit(): void {
    this.yampiService.getCredentialKeys().subscribe((ev) => {
      this.yAlias = ev.alias;
      this.yToken = ev.token;
      this.yKey = ev.key;
    });
  }

  save() {
    this.yampiService.updateYampiCredentialKeys({
      alias: this.yAlias,
      token: this.yToken,
      key: this.yKey,
    });

    this.dialogRef.close();
  }
}
