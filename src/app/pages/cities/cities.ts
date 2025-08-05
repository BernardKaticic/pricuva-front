import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Table, TableModule } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
    selector: 'app-cities',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, ToastModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="flex justify-between items-center mb-3">
            <h3 class="text-xl font-semibold m-0">Gradovi</h3>

            <div class="flex items-center gap-3 self-start">
                <button pButton icon="pi pi-plus" label="Dodaj grad" (click)="openAddCity()"></button>

                <span class="p-input-icon-left">
                    <input pInputText type="text" placeholder="Pretraži..." (input)="onGlobalFilter(dt1, $event)" class="w-64" />
                </span>
            </div>
        </div>
    <div class="overflow-auto flex-1">
        <p-table #dt1 [value]="cities" [filters]="filters" class="p-datatable-sm flex-1" style="min-height: 0;" [responsiveLayout]="'scroll'" selectionMode="single" dataKey="id" (onRowSelect)="onCitySelect($event.data)" [rows]="10" [globalFilterFields]="['name']" [paginator]="true" [rowsPerPageOptions]="[10, 15, 20]">
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

        <p-dialog [style]="{width: '300px'}" header="{{ dialogMode === 'add' ? 'Dodaj grad' : 'Uredi grad' }}" [(visible)]="displayDialog" modal [closable]="true">
            <form class="flex flex-col gap-3" (ngSubmit)="saveCity()">
                <div>
                    <label for="name" class="block text-sm font-medium">Naziv grada</label>
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
export class Cities {
    globalFilter: string = '';
    filters: { [s: string]: { value: string; matchMode: string } } = {};

    cities = [
        { id: 1, name: 'Zagreb' },
        { id: 2, name: 'Split' },
        { id: 3, name: 'Rijeka' },
        { id: 4, name: 'Osijek' },
        { id: 5, name: 'Sisak' },
        { id: 6, name: 'Otok' },
        { id: 7, name: 'Vinkovci' },
        { id: 8, name: 'Pula' },
        { id: 9, name: 'Karlovac' },
        { id: 10, name: 'Varaždin' },
        { id: 11, name: 'Zadar' }
    ];

    displayDialog = false;
    dialogMode: 'add' | 'edit' = 'add';
    cityForm = { id: 0, name: '' };

    selectedCity: any;

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private router: Router
    ) {}

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

    onCitySelect(city: any) {
        this.router.navigate(['/pages/hierarchy-wizard/streets', city.id], {
            queryParams: { cityName: city.name}
        });
    }
}
