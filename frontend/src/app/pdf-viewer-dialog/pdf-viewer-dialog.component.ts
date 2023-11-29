import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-viewer-dialog',
  templateUrl: './pdf-viewer-dialog.component.html',
  styleUrls: ['./pdf-viewer-dialog.component.scss']
})
export class PdfViewerDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public projectPDFreport : any,
    public dialogRef: MatDialogRef<PdfViewerDialogComponent>,
  ) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
