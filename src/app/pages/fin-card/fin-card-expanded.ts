import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import { Table, TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutoFocusModule } from 'primeng/autofocus';
import { FilterService, SelectItemGroup } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-fin-card-expanded',
    standalone: true,
    imports: [CommonModule, FormsModule, TableModule, AutoFocusModule, InputTextModule, TagModule, CardModule, SelectButtonModule, AutoCompleteModule, ButtonModule, DividerModule, DatePickerModule],
    template: `
        <p-card>
            <div class="flex flex-col">
                <div class="flex flex-row items-start w-full mb-10">
                    <div class="pr-6">
                        <h3 class="text-xl font-semibold m-0">Financijska kartica</h3>
                        <p class="mb-4">Za početak, odaberite adresu iz liste kako biste nastavili s pregledom financijske kartice.</p>

                        <div class="flex justify-baseline gap-3 mt-3">
                            <p-autocomplete
                                id="address"
                                [(ngModel)]="selectedCity"
                                optionLabel="label"
                                [autofocus]="true"
                                field="label"
                                [group]="true"
                                showClear="true"
                                [suggestions]="filteredGroups"
                                (completeMethod)="filterGroupedCity($event)"
                                placeholder="Unesite adresu..."
                                (onSelect)="onAddressSelected($event)"
                                class="w-80"
                                [dropdown]="true"
                            >
                                <ng-template let-group pTemplate="group">
                                    <div class="flex items-center">
                                        <span class="font-bold text-primary">{{ group.label }}</span>
                                    </div>
                                </ng-template>
                            </p-autocomplete>

                            <p-datepicker class="self-start w-60" placeholder="Odaberite datume" [showIcon]="true" [(ngModel)]="rangeDates" selectionMode="range" [readonlyInput]="true" dateFormat="dd.mm.yy" />

                            <p-button icon="pi pi-search" label="Pretraži" [loading]="loading" class="w-full sm:w-auto" (onClick)="load()"> </p-button>
                        </div>
                    </div>

                    <p-divider *ngIf="tempvar" layout="vertical" class="mx-4 h-auto self-stretch"></p-divider>

                    <div *ngIf="tempvar">
                        <div class="flex flex-row justify-between gap-20">
                            <div class="flex flex-col">
                                <ul class="list-none p-0 m-0">
                                    <li class="mb-3">
                                        <span class="font-medium block">Adresa:</span>
                                        <span>Ante Starčevića 22, Osijek</span>
                                    </li>
                                    <li class="mb-3">
                                        <span class="font-medium block">IBAN:</span>
                                        <span>HR924824529</span>
                                    </li>
                                    <li class="mb-3">
                                        <span class="font-medium block">OIB:</span>
                                        <span>149951891</span>
                                    </li>
                                    <li>
                                        <span class="font-medium block">Predstavnik:</span>
                                        <span>Josip Josipović</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="flex flex-col">
                                <ul class="list-none p-0 m-0">
                                    <li class="mb-3">
                                        <span class="font-medium block">Pričuva + kredit:</span>
                                        <span>0.56 €/m²</span>
                                    </li>
                                    <li class="mb-3">
                                        <span class="font-medium block">Dodatna zaduženja:</span>
                                        <span>Čišćenje: 5€</span>
                                        <span class="block">Struja: 0.10€</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <p-selectbutton *ngIf="tempvar" [options]="stateOptions" [(ngModel)]="value" optionLabel="label" optionValue="value" aria-labelledby="basic" allowEmpty="false" />

                <div *ngIf="value === 'dobavljaci' && tempvar" class="col-12 md:col-6 p-4 surface-card border-round">
                    <!-- Table -->
                    <p-table [value]="dobavljaci" [responsiveLayout]="'scroll'" styleClass="p-datatable-sm">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Dobavljač</th>
                                <th class="text-right">Iznos</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-dobavljaci>
                            <tr>
                                <td>{{ dobavljaci.naziv }}</td>
                                <td class="text-right">{{ dobavljaci.iznos | currency: 'EUR' }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>

                <div *ngIf="value === 'stanje' && tempvar" class="col-12 md:col-6 p-4 surface-card border-round">
                    <!-- Table -->
                    <p-table [value]="stanje" [responsiveLayout]="'scroll'" styleClass="p-datatable-sm">
                        <ng-template pTemplate="header">
                            <tr>
                                <th>Trošak</th>
                                <th class="text-right">Iznos</th>
                            </tr>
                        </ng-template>
                        <ng-template pTemplate="body" let-stanje>
                            <tr>
                                <td>{{ stanje.naziv }}</td>
                                <td class="text-right">{{ stanje.iznos | currency: 'EUR' }}</td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            </div>
        </p-card>
    `
})
export class FinancialCard {
    stateOptions: any[] = [
        { label: 'Stanje', value: 'stanje' },
        { label: 'Dobavljači', value: 'dobavljaci' }
    ];

    selectedCity: any;
    filteredGroups: any[] = [];
    groupedCities: SelectItemGroup[] = [];

    loading: boolean = false;
    rangeDates: any;
    tempvar: boolean = false;

    filterGroupedCity(event: any) {
        let query = event.query;
        let filteredGroups = [];

        for (let optgroup of this.groupedCities) {
            let filteredSubOptions = this.filterService.filter(optgroup.items, ['label'], query, 'contains');
            if (filteredSubOptions && filteredSubOptions.length) {
                filteredGroups.push({
                    label: optgroup.label,
                    value: optgroup.value,
                    items: filteredSubOptions
                });
            }
        }

        this.filteredGroups = filteredGroups;
    }

    dobavljaci = [
        { id: 1, naziv: 'Vinkoprom', iznos: 12000 },
        { id: 2, naziv: 'Vela d.o.o.', iznos: 124 },
        { id: 3, naziv: 'Incolor d.o.o.', iznos: 1314 },
        { id: 4, naziv: 'HEP d.o.o.', iznos: 21010 },
        { id: 5, naziv: 'STANAR', iznos: 2140 },
        { id: 6, naziv: 'Dimovod d.o.o.', iznos: 1030 }
    ];

    stanje = [
        { id: 1, naziv: 'Zajednička struja', iznos: 31.11 },
        { id: 2, naziv: 'Zajednička voda', iznos: 11.21 },
        { id: 3, naziv: 'Servis dizala', iznos: 111.39 },
        { id: 4, naziv: 'Osiguranje zgrade', iznos: 20.0 },
        { id: 5, naziv: 'Servis vatrogasnih aparata', iznos: 30.0 },
        { id: 6, naziv: 'Čišćenje zgrade', iznos: 250.0 },
        { id: 7, naziv: 'Pregled dimnjaka', iznos: 60.0 },
        { id: 8, naziv: 'Naknada predstavniku', iznos: 120.0 },
        { id: 9, naziv: 'Naknada upravitelju', iznos: 200.0 },
        { id: 10, naziv: 'Isplata šštete', iznos: 3990.0 },
        { id: 11, naziv: 'Kamata banke', iznos: 0.46 },
        { id: 12, naziv: 'Kredit', iznos: 2400.0 }
    ];

    value: string = 'stanje';

    constructor(private filterService: FilterService) {}

    onAddressSelected(event: any) {
        const fullAddress = event.value.value.street + ' ' + event.value.value.number + ', ' + event.value.value.city;
        this.selectedCity = fullAddress;
    }

    load() {
        this.loading = true;
        setTimeout(() => {
            this.loading = false;
            this.tempvar = true;
        }, 2000);
    }

    ngOnInit() {
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        this.rangeDates = [startDate, endDate];

        this.groupedCities = [
            {
                label: 'Zagreb',
                value: 'ZG',
                items: [
                    { label: 'Ilica 23', value: { city: 'Zagreb', street: 'Ilica', number: '23' } },
                    { label: 'Vlaška 10A', value: { city: 'Zagreb', street: 'Vlaška', number: '10A' } },
                    { label: 'Kralja Tomislava 25', value: { city: 'Zagreb', street: 'Kralja Tomislava', number: '25' } },
                    { label: 'Ante Starčevića 22', value: { city: 'Zagreb', street: 'Ante Starčevića', number: '22' } }
                ]
            },
            {
                label: 'Osijek',
                value: 'OS',
                items: [
                    { label: 'Kralja Petra Svačića 1A', value: { city: 'Osijek', street: 'Kralja Petra Svačića', number: '1A' } },
                    { label: 'Vijenac Slavka Kolara 6', value: { city: 'Osijek', street: 'Vijenac Slavka Kolara', number: '6' } },
                    { label: 'Divaltova', value: { city: 'Osijek', street: 'Divaltova', number: '667' } }
                ]
            },
            {
                label: 'Pula',
                value: 'PU',
                items: [
                    { label: 'Luke Modrića 18', value: { city: 'Pula', street: 'Luke Modrića', number: '18' } },
                    { label: 'Ivana Perišića 2', value: { city: 'Pula', street: 'Ivana Perišića 2', number: '2' } },
                    { label: 'Dominika Livakovića 22', value: { city: 'Pula', street: 'Dominika Livakovića 22', number: '22' } }
                ]
            }
        ];
    }
}
