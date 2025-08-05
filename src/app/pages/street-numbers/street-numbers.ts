import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-street-numbers',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-semibold m-0">{{cityName+ ', ' + streetName}}</h3>

            <div class="flex items-center gap-3 self-start">
                <button pButton icon="pi pi-plus" label="Dodaj broj" (click)="openAddCity()"></button>

                <span class="p-input-icon-left">
                    <input pInputText type="text" placeholder="Pretraži..." (input)="onGlobalFilter(dt1, $event)" class="w-64" />
                </span>
            </div>
        </div>
    <div class="overflow-auto flex-1">
        <p-table #dt1 [value]="cities" [scrollable]="true" scrollHeight="flex" [filters]="filters" class="p-datatable-sm flex-1" style="min-height: 0;" [responsiveLayout]="'scroll'" selectionMode="single" dataKey="id" (onRowSelect)="onStreetNumberSelect($event.data)" [rows]="5" [globalFilterFields]="['name']">
            <ng-template pTemplate="body" let-city>
                <tr [pSelectableRow]="city" class="cursor-pointer hover:bg-gray-100">
                    <td class="font-medium" style="min-width: 150px;">{{ city.name }}</td>
                    <td style="white-space: nowrap; text-align: right;">
                        <button pButton icon="pi pi-pencil" class="p-button-text" (click)="openEditCity(city)"></button>
                        <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmDeleteCity(city)"></button>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [style]="{width: '300px'}" header="{{ dialogMode === 'add' ? 'Dodaj broj' : 'Uredi broj' }}" [(visible)]="displayDialog" modal [closable]="true">
            <form class="flex flex-col gap-3" (ngSubmit)="saveCity()">
                <div>
                    <label for="name" class="block text-sm font-medium">Broj zgrade</label>
                    <input class="w-full" id="name" pInputText [(ngModel)]="cityForm.name" name="name" required />
                </div>
                <div class="flex justify-end gap-2">
                    <button pButton label="Odustani" class="p-button-text" (click)="displayDialog = false" type="button"></button>
                    <button pButton label="Spremi" type="submit" [disabled]="!cityForm.name"></button>
                </div>
            </form>
        </p-dialog>

        <p-confirmDialog></p-confirmDialog>
    </div>
    `
})
export class StreetNumbers {
    globalFilter: string = '';
    filters: { [s: string]: { value: string; matchMode: string } } = {};

    cities = [
        { id: 1, name: '15' },
        { id: 2, name: '22' },
        { id: 3, name: '82' },
        { id: 4, name: '46' },
        { id: 5, name: '31' }
    ];

    displayDialog = false;
    dialogMode: 'add' | 'edit' = 'add';
    cityForm = { id: 0, name: '' };

    selectedCityId: any;
    selectedStreetId: any;
    selectedStreetNumberId: any;
    cityName: any;
    streetName: any;

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

        this.route.queryParamMap.subscribe((params) => {
            this.cityName = params.get('cityName') ?? '';
            this.streetName = params.get('streetName') ?? '';
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
        if (this.dialogMode === 'add') {
            const newId = Math.max(...this.cities.map((c) => c.id), 0) + 1;
            this.cities.push({ id: newId, name: this.cityForm.name });
            this.messageService.add({ severity: 'success', summary: 'Dodano', detail: 'Grad je dodan.' });
        } else {
            const index = this.cities.findIndex((c) => c.id === this.cityForm.id);
            if (index > -1) this.cities[index].name = this.cityForm.name;
            this.messageService.add({ severity: 'success', summary: 'Ažurirano', detail: 'Grad je ažuriran.' });
        }

        this.displayDialog = false;
    }

    confirmDeleteCity(city: any) {
        this.confirmationService.confirm({
            message: `Jeste li sigurni da želite obrisati grad "${city.name}"?`,
            accept: () => {
                this.cities = this.cities.filter((c) => c.id !== city.id);
                this.messageService.add({ severity: 'info', summary: 'Obrisano', detail: 'Grad je obrisan.' });
            }
        });
    }

    onStreetNumberSelect(streetNumber: any) {
        this.router.navigate(['/pages/hierarchy-wizard/building', this.selectedCityId, this.selectedStreetId, streetNumber.id], {
            queryParams: { cityName: this.cityName, streetName: this.streetName, streetNumber: streetNumber.name}
        });
    }
}
