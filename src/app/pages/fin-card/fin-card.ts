import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { Table, TableModule } from 'primeng/table';
import { DatePicker } from 'primeng/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-fin-card',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, ToastModule, TagModule, SelectModule, DatePicker],
    providers: [ConfirmationService, MessageService],
    template: `
            <div class="flex justify-between items-center mb-3">
            <div class="flex gap-5">
            <h3 class="text-xl font-semibold m-0">Financijska kartica</h3>
            <p-datepicker class="self-start" placeholder="Odaberite datume" [showIcon]="true" [(ngModel)]="rangeDates" selectionMode="range" [readonlyInput]="true" dateFormat="dd.mm.yy"/>
            </div>
            <div class="flex items-center gap-3 self-start">
                <button pButton icon="pi pi-plus" label="Dodaj uplatu/zaduženje" (click)="openAddCity()"></button>
            </div>
        </div>

        <p-table [value]="financialData" class="p-datatable-sm" responsiveLayout="scroll">
  <ng-template pTemplate="header">
    <tr>
      <th>Vrsta</th>
      <th>Datum</th>
      <th>Iznos</th>
      <th>Opis</th>
      <th>Saldo</th>
      <th></th>
    </tr>
  </ng-template>

  <ng-template pTemplate="body" let-item>
    <tr>
      <td>{{ item.vrsta }}</td>
      <td>{{ item.datum | date: 'dd.MM.yyyy' }}</td>
      <td style="white-space: nowrap; text-align: center;">{{ item.iznos }}</td>
      <td>{{ item.opis }}</td>
      <td style="white-space: nowrap; text-align: center;">{{ item.saldo }}</td>
      <td style="white-space: nowrap; text-align: right;">
                              <button pButton icon="pi pi-pencil" class="p-button-text" (click)="openEditCity(item)"></button>
                              <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmDeleteCity(item)"></button>
                          </td>
    </tr>
  </ng-template>
</p-table>
    `
})
export class FinCard {
    globalFilter: string = '';
    filters: { [s: string]: { value: string; matchMode: string } } = {};

    financialData = [
        { id: 1, vrsta: 'Zaduženje 3/2025', datum: "2025-03-14", iznos: 225.33, opis:  "Zaduženje za 3/2025", saldo: -255.33},
        { id: 2, vrsta: 'Plaćanje 2/2025', datum: "2025-03-14", iznos: 54.11, opis:  "Zaduženje za 3/2025", saldo: 0 },
        { id: 3, vrsta: 'Zaduženje 2/2025', datum: "2025-03-14", iznos: 54.11, opis:  "Zaduženje za 3/2025", saldo: -54.11 },
        { id: 4, vrsta: 'Plaćanje 1/2025', datum: "2025-03-14", iznos: 118.52, opis:  "Zaduženje za 3/2025", saldo: 0 },
        { id: 5, vrsta: 'Zaduženje 1/2025', datum: "2025-03-14", iznos: 118.52, opis:  "Zaduženje za 3/2025", saldo: -118.52 }
    ];

    dropdownItems = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];

    dropdownItem = null;

    displayDialog = false;
    dialogMode: 'add' | 'edit' = 'add';
    cityForm = { id: 0, name: '' };

    selectedCityId: any;
    cityName: any
    selectedStreetId: any;
    streetName: any;
    selectedStreetNumberId: any;
    streetNumber: any;
    selectedOwnerId: any;

    rangeDates: any;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,

    ) {
        const cityId = this.route.snapshot.paramMap.get('cityId');
        this.selectedCityId = cityId ? Number(cityId) : undefined;

        const streetId = this.route.snapshot.paramMap.get('streetId');
        this.selectedStreetId = streetId ? Number(streetId) : undefined;

        const streetNumberId = this.route.snapshot.paramMap.get('streetNumberId');
        this.selectedStreetNumberId = streetNumberId ? Number(streetNumberId) : undefined;

        const ownerId = this.route.snapshot.paramMap.get('ownerId');
        this.selectedOwnerId = ownerId ? Number(ownerId) : undefined;

        this.route.queryParamMap.subscribe((params) => {
            this.cityName = params.get('cityName') ?? '';
            this.streetName = params.get('streetName') ?? '';
            this.streetNumber = params.get('streetNumber') ?? '';
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openAddCity() {
        this.dialogMode = 'add';
        this.cityForm = { id: 0, name: '' };
        this.displayDialog = true;
    }

    openEditCity(city: any) {
        this.dialogMode = 'edit';
        this.cityForm = { ...city };
        this.displayDialog = true;
    }

    saveCity() {
        //if (this.dialogMode === 'add') {
          //  const newId = Math.max(...this.financialData.map((c) => c.id), 0) + 1;
            //this.financialData.push({ id: newId, vrsta: this.cityForm.name });
           // this.messageService.add({ severity: 'success', summary: 'Dodano', detail: 'Grad je dodan.' });
        //} else {
          //  const index = this.financialData.findIndex((c) => c.id === this.cityForm.id);
           // if (index > -1) this.financialData[index].name = this.cityForm.name;
            //this.messageService.add({ severity: 'success', summary: 'Ažurirano', detail: 'Grad je ažuriran.' });
       // }

        this.displayDialog = false;
    }

    confirmDeleteCity(city: any) {
        this.confirmationService.confirm({
            message: `Jeste li sigurni da želite obrisati grad "${city.name}"?`,
            accept: () => {
                this.financialData = this.financialData.filter((c) => c.id !== city.id);
                this.messageService.add({ severity: 'info', summary: 'Obrisano', detail: 'Grad je obrisan.' });
            }
        });
    }

    onStreetSelect(street: any) {
        this.router.navigate(['/pages/hierarchy-wizard/street-numbers', this.selectedCityId, street.id]);
    }

    ngOnInit() {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        this.rangeDates = [startDate, endDate];
    }
}
