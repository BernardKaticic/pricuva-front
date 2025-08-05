import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { Table, TableModule } from 'primeng/table';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'app-building',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, ConfirmDialogModule, ToastModule, TagModule, SelectButtonModule],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="flex justify-between items-center mb-3">
            <div class="flex-row">
                <h3 class="text-xl font-semibold m-0">{{ cityName + ', ' + streetName + ' ' + streetNumber }}</h3>
                <p><p-tag value="OIB: 12345678911" /></p>
                <p><p-tag value="IBAN: HR258596545236541000256" /></p>
            </div>
            <div class="flex items-center gap-3 self-start">
                <button pButton icon="pi pi-plus" label="Dodaj vlasnika" (click)="openAddCity()"></button>

                <span class="p-input-icon-left">
                    <input pInputText type="text" placeholder="Pretraži..." (input)="onGlobalFilter(dt1, $event)" class="w-64" />
                </span>
            </div>
        </div>
        <div class="overflow-auto flex-1">
            <p-table
                #dt1
                [value]="owners"
                [scrollable]="true"
                scrollHeight="flex"
                [filters]="filters"
                class="p-datatable-sm flex-1"
                style="min-height: 0;"
                [responsiveLayout]="'scroll'"
                selectionMode="single"
                dataKey="id"
                (onRowSelect)="onOwnerSelect($event.data)"
                [rows]="5"
                [globalFilterFields]="['name']"
            >
                <ng-template pTemplate="header">
                    <tr>
                        <th>Vlasnik</th>
                        <th>Površina</th>
                        <th>Stan br.</th>
                        <th>Kat</th>
                        <th>OIB</th>
                        <th>Kontakt</th>
                        <th>Email</th>
                        <th>Uplatnice</th>
                        <th></th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-city>
                    <tr [pSelectableRow]="city" class="cursor-pointer hover:bg-gray-100">
                        <td class="font-medium" style="min-width: 150px;">{{ city.name }}</td>
                        <td>{{ city.areaOfApartment }}</td>
                        <td>{{ city.apartment }}</td>
                        <td>{{ city.floor }}</td>
                        <td>{{ city.oib }}</td>
                        <td>{{ city.phoneNumber }}</td>
                        <td>{{ city.email }}</td>
                        <td>{{ city.sendingInvoice }}</td>

                        <td style="white-space: nowrap; text-align: right;">
                            <button pButton icon="pi pi-pencil" class="p-button-text" (click)="openEditCity(city)"></button>
                            <button pButton icon="pi pi-trash" class="p-button-text p-button-danger" (click)="confirmDeleteCity(city)"></button>
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <p-dialog
  header="{{ dialogMode === 'add' ? 'Dodaj vlasnika' : 'Uredi vlasnika' }}"
  [(visible)]="displayDialog"
  modal
  [closable]="true"
  [style]="{ width: '600px' }"
  [breakpoints]="{ '960px': '90vw', '640px': '95vw' }"
>
  <form class="grid grid-cols-1 md:grid-cols-2 gap-4" (ngSubmit)="saveCity()">
    <!-- Lijeva kolona -->
    <div class="flex flex-col gap-3">
      <div>
        <label for="name" class="block text-sm font-medium">Ime</label>
        <input id="name" pInputText [(ngModel)]="cityForm.name" name="name" required />
      </div>

      <div>
        <label for="apartment" class="block text-sm font-medium">Broj stana</label>
        <input id="apartment" pInputText [(ngModel)]="cityForm.apartment" name="apartment" required />
      </div>

      <div>
        <label for="floor" class="block text-sm font-medium">Kat</label>
        <input id="floor" pInputText [(ngModel)]="cityForm.floor" name="floor" required />
      </div>

      <div>
        <label for="areaOfApartment" class="block text-sm font-medium">Površina stana (m²)</label>
        <input id="areaOfApartment" pInputText [(ngModel)]="cityForm.areaOfApartment" name="areaOfApartment" required />
      </div>
    </div>

    <!-- Desna kolona -->
    <div class="flex flex-col gap-3">
      <div>
        <label for="oib" class="block text-sm font-medium">OIB</label>
        <input id="oib" pInputText [(ngModel)]="cityForm.oib" name="oib" required />
      </div>

      <div>
        <label for="phoneNumber" class="block text-sm font-medium">Kontakt</label>
        <input id="phoneNumber" pInputText [(ngModel)]="cityForm.phoneNumber" name="phoneNumber" required />
      </div>

      <div>
        <label for="email" class="block text-sm font-medium">Email</label>
        <input id="email" pInputText [(ngModel)]="cityForm.email" name="email" required />
      </div>

      <div>
        <label for="sendingInvoice" class="block text-sm font-medium">Slanje uplatnice</label>
        <p-selectbutton [options]="stateOptions" [(ngModel)]="value" optionLabel="label" optionValue="value" aria-labelledby="basic" allowEmpty="false" />
      </div>
    </div>

    <!-- Dugmad -->
    <div class="col-span-1 md:col-span-2 flex justify-end gap-2 pt-4">
      <button
        pButton
        label="Odustani"
        class="p-button-text"
        (click)="displayDialog = false"
        type="button"
      ></button>
      <button
        pButton
        label="Spremi"
        type="submit"
        [disabled]="!cityForm.name"
      ></button>
    </div>
  </form>
</p-dialog>


            <p-confirmDialog></p-confirmDialog>
        </div>
    `
})
export class Building {
    globalFilter: string = '';
    filters: { [s: string]: { value: string; matchMode: string } } = {};

    owners = [
        { id: 1, name: 'Marko Marković - predstavnik', areaOfApartment: 68.39, apartment: 19, floor: 2, oib: '12312312312', phoneNumber: '099099099', email: 'markomarkovic@gmail.com', sendingInvoice: 'mail' },
        { id: 2, name: 'Petar Petrović', areaOfApartment: 68.39, apartment: 19, floor: 2, oib: '12312312312', phoneNumber: '099099099', email: 'markomarkovic@gmail.com', sendingInvoice: 'mail' },
        { id: 3, name: 'Josip Josipović', areaOfApartment: 68.39, apartment: 19, floor: 2, oib: '12312312312', phoneNumber: '099099099', email: 'markomarkovic@gmail.com', sendingInvoice: 'mail' },
        { id: 4, name: 'Ivan Ivanović', areaOfApartment: 68.39, apartment: 19, floor: 2, oib: '12312312312', phoneNumber: '099099099', email: 'markomarkovic@gmail.com', sendingInvoice: 'mail' }
    ];
    value: string = 'posta';

    displayDialog = false;
    dialogMode: 'add' | 'edit' = 'add';
    cityForm = { id: 0, name: '', areaOfApartment: 0, apartment: 0, floor: 0, oib: '', phoneNumber: '', email: '', sendingInvoice: this.value };

    selectedCityId: any;
    cityName: any;
    selectedStreetId: any;
    streetName: any;
    selectedStreetNumberId: any;
    streetNumber: any;

    stateOptions: any[] = [
        { label: 'Email', value: 'email' },
        { label: 'Pošta', value: 'posta' }
    ];


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
        this.cityForm = { id: 0, name: '', areaOfApartment: 0, apartment: 0, floor: 0, oib: '', phoneNumber: '', email: '', sendingInvoice: this.value };
        this.value = 'posta';
        this.displayDialog = true;
    }

    openEditCity(city: any) {
        this.dialogMode = 'edit';
        this.cityForm = { ...city };
        this.displayDialog = true;
    }

    saveCity() {
      /*  if (this.dialogMode === 'add') {
            const newId = Math.max(...this.owners.map((c) => c.id), 0) + 1;
            this.owners.push({ id: newId, name: this.cityForm.name });
            this.messageService.add({ severity: 'success', summary: 'Dodano', detail: 'Grad je dodan.' });
        } else {
            const index = this.owners.findIndex((c) => c.id === this.cityForm.id);
            if (index > -1) this.owners[index].name = this.cityForm.name;
            this.messageService.add({ severity: 'success', summary: 'Ažurirano', detail: 'Grad je ažuriran.' });
        }
*/
        this.displayDialog = false;
    }

    confirmDeleteCity(city: any) {
        this.confirmationService.confirm({
            message: `Jeste li sigurni da želite obrisati grad "${city.name}"?`,
            accept: () => {
                this.owners = this.owners.filter((c) => c.id !== city.id);
                this.messageService.add({ severity: 'info', summary: 'Obrisano', detail: 'Grad je obrisan.' });
            }
        });
    }

    onOwnerSelect(owner: any) {
        this.router.navigate(['/pages/hierarchy-wizard/fin-card', this.selectedCityId, this.selectedStreetId, this.selectedStreetNumberId, owner.id], {
            queryParams: { cityName: this.cityName, streetName: this.streetName, streetNumber: this.streetNumber, owner: owner.name }
        });
    }
}
