import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertsService } from '@services/alerts.service';

import * as html2pdf from 'html2pdf.js';
import { pdfDefaultOptions, } from 'ngx-extended-pdf-viewer';
import { noop, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ReportColumn {
  class?: string;
  prop: string;
  header: { class?: string; name: string };
}

export interface ReportDataset {
  [key: string]: any;
}

export interface ReportConfig {
  title: { value: string; class?: string }[];
  info: { value: string; title: string; class?: string }[];
  dataset: ReportDataset[];
  columns: ReportColumn[];
  filename: string;
}

@Component({
  selector: 'app-reporte-usuarios',
  templateUrl: './reporte-usuarios.component.html',
  styleUrls: ['./reporte-usuarios.component.scss'],
})
export class ReporteUsuariosComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private _alerts: AlertsService,
    private _dialogRef: MatDialogRef<ReporteUsuariosComponent>,
    @Inject(MAT_DIALOG_DATA) public config: ReportConfig
  ) {}
  private onDestroy$ = new Subject<any>();
  public dataFormat = [[]];
  private itemsXPage = 30;
  @ViewChild('reporte') private reporte: ElementRef<HTMLElement>;
  public loaded = false;
  public pdf: Blob = null;
  public options = {
    height: '94%'
  }
  ngOnInit(): void {

    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
    this.setConfig();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.genPdf();
    }, 50);
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
  setConfig() {
    let loops = Array(
      Math.ceil(this.config.dataset.length / this.itemsXPage)
    ).fill('');
    let tempDatasets = [...this.config.dataset];
    this.dataFormat = [];
    loops.forEach((loop, index) => {
      this.dataFormat.push(tempDatasets.splice(0, this.itemsXPage));
    });
  }
  async genPdf() {
    try {
      this.loaded = true;
      const options = {
        margin: 4,
        filename: this.config.filename,
        image: { type: 'jpeg', quality: 1 },
        jsPDF: { format: 'a3', orientation: 'landscape' },
        html2canvas: {
          scale: 3,
          letterRendering: true,
        },
      };
      this.pdf = await html2pdf()
        .set(options)
        .from(this.reporte.nativeElement)
        .outputPdf('blob');
    } catch (error) {
      this._alerts.error('No se pudo generar el reporte');
      return false;
    }
  }

  viewPdf() {}
  onNoClick() {
    this._dialogRef.close();
  }
}
