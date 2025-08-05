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
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { PopoverModule } from 'primeng/popover';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-debtors',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, ToastModule, TagModule, SelectModule, CardModule, PopoverModule, SelectButtonModule, DatePickerModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <p-card>
            <div class="flex justify-between items-center mb-3">
                <div class="flex gap-5">
                    <h3 class="text-xl font-semibold m-0">Dužnici</h3>
                    <div>
                        <p-popover #popoverRef>
                            <div class="flex flex-col gap-3 w-[20rem] p-2">
                                <p-calendar [(ngModel)]="rangeDates" selectionMode="range" placeholder="Odaberite datume" dateFormat="dd.mm.yy" showIcon></p-calendar>

                                <p-selectButton [options]="tipovi" [(ngModel)]="odabraniTip" placeholder="Vrsta (Pravni/Fizički)" p></p-selectButton>

                                <input pInputText [(ngModel)]="iznos" placeholder="Iznos" />

                                <button pButton label="Primijeni" class="w-full mt-2" (click)="applyFilters()"></button>
                            </div>
                        </p-popover>
                    </div>
                </div>
            </div>

            <p-table [value]="debtorsData" 
            class="p-datatable-sm"
                selectionMode="single"
                dataKey="id"
             responsiveLayout="scroll" [paginator]="true" [rows]="10"  [rowsPerPageOptions]="[10, 15, 20]" [scrollable]="true" (onRowSelect)="onDebtorSelect($event.data) ">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Dužnik</th>
                        <th>Iznos</th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-item>
                    <tr  [pSelectableRow]="item">
                        <td>{{ item.name }}</td>
                        <td>{{ item.total }}</td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `
})
export class Debtors {
    globalFilter: string = '';
    filters: { [s: string]: { value: string; matchMode: string } } = {};

    debtorsData = [
        { id: 1, name: 'Alerić Mato', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 51.41 },
        { id: 2, name: 'Abigalić Ivan', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 110.44 },
        { id: 3, name: 'Babić Ana', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 65.41 },
        { id: 4, name: 'Cirki Jelena', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 141.44 },
        { id: 5, name: 'Došen Luka', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 1401.44 },
        { id: 6, name: 'Galić Mato', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 145.33 },
        { id: 7, name: 'Ivezić Sara', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 990.19 },
        { id: 8, name: 'Josić Mijo', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 130.00 },
        { id: 9, name: 'Kalenić Goran', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 4411.19 },
        { id: 10, name: 'Popadić Ante', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 1149.14 },
        { id: 11, name: 'Rotz Robert', dateFrom: '2025-01-01', dateTo: '2025-05-31', total: 194.00 }
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
    cityName: any;
    selectedStreetId: any;
    streetName: any;
    selectedStreetNumberId: any;
    streetNumber: any;
    selectedOwnerId: any;

    rangeDates: any;

    iznos: number | null = null;
    odabraniTip: string | null = null;

    tipovi = [
        { label: 'Fizička osoba', value: 'fizicka' },
        { label: 'Pravna osoba', value: 'pravna' }
    ];

    applyFilters() {
        // logika filtriranja
    }

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute
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
                this.debtorsData = this.debtorsData.filter((c) => c.id !== city.id);
                this.messageService.add({ severity: 'info', summary: 'Obrisano', detail: 'Grad je obrisan.' });
            }
        });
    }

    onStreetSelect(street: any) {
        this.router.navigate(['/pages/hierarchy-wizard/street-numbers', this.selectedCityId, street.id]);
    }

    onDebtorSelect(event: any) {
      console.log("123");
    }

    ngOnInit() {
        this.odabraniTip = this.tipovi[0].value;
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        this.rangeDates = [startDate, endDate];
    }
}
