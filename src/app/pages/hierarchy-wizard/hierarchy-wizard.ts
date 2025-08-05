import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { StepsModule } from 'primeng/steps';
import { Cities } from '../cities/cities';
import { Streets } from '../streets/streets';
import { StreetNumbers } from '../street-numbers/street-numbers';
import { Building } from '../building/building';
import { FinCard } from '../fin-card/fin-card';
import { CardModule } from 'primeng/card';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
    selector: 'app-hierarchy-wizard',
    standalone: true,
    imports: [CommonModule, StepsModule, Cities, Streets, StreetNumbers, Building, FinCard, CardModule, ButtonModule],
    template: `
        <div class="gap-4 flex flex-col">
            <p-card>
                <p-steps [model]="steps" [(activeIndex)]="activeIndex" [readonly]="true" class="mb-4 basis-[50rem]"></p-steps>
            </p-card>
            <button *ngIf="activeIndex > 0" pButton type="button" label="Natrag" severity="secondary" icon="pi pi-arrow-left" class="w-30" (click)="goBack()" [disabled]="!canGoBack()"></button>

            <p-card *ngIf="activeIndex === 0">
                <app-cities></app-cities>
            </p-card>
            <p-card *ngIf="activeIndex === 1">
                <app-streets></app-streets>
            </p-card>
            <p-card *ngIf="activeIndex === 2">
                <app-street-numbers></app-street-numbers>
            </p-card>
            <p-card *ngIf="activeIndex === 3">
                <app-building></app-building>
            </p-card>
            <p-card *ngIf="activeIndex === 4">
                <app-fin-card></app-fin-card>
            </p-card>
        </div>
    `
})
export class HierarchyWizardComponent {
    activeIndex = 0;
    selectedCityId?: number;
    selectedCityName?: any;
    selectedStreetId?: number;
    selectedStreetName?: any;
    selectedStreetNumberId?: number;
    selectedStreetNumber?: any;
    selectedOwnerId: any;

    steps = [{ label: 'Grad' }, { label: 'Ulica' }, { label: 'Kućni broj' }, { label: 'Zgrada' }, { label: 'Financijska kartica' }];

    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                this.syncStateWithUrl();
            });

        this.syncStateWithUrl();
    }

    private syncStateWithUrl() {
        const url = this.router.url;

        if (url.includes('/cities')) {
            this.activeIndex = 0;
            this.selectedCityId = undefined;
            this.selectedStreetId = undefined;
        } else if (url.includes('/streets')) {
            this.activeIndex = 1;
            const cityId = this.route.snapshot.paramMap.get('cityId');
            this.selectedCityId = cityId ? Number(cityId) : undefined;
            this.selectedStreetId = undefined;

            this.route.queryParamMap.subscribe((params) => {
            this.selectedCityName = params.get('cityName') ?? '';
            this.selectedStreetName = params.get('streetName') ?? '';
            });
        } else if (url.includes('/street-numbers')) {
            this.activeIndex = 2;
            const cityId = this.route.snapshot.paramMap.get('cityId');
            const streetId = this.route.snapshot.paramMap.get('streetId');
            this.selectedCityId = cityId ? Number(cityId) : undefined;
            this.selectedStreetId = streetId ? Number(streetId) : undefined;

            this.route.queryParamMap.subscribe((params) => {
            this.selectedCityName = params.get('cityName') ?? '';
            this.selectedStreetName = params.get('streetName') ?? '';
            });
        } else if (url.includes('/building')) {
            this.activeIndex = 3;
            const cityId = this.route.snapshot.paramMap.get('cityId');
            const streetId = this.route.snapshot.paramMap.get('streetId');
            const streetNumberId = this.route.snapshot.paramMap.get('streetNumberId');
            this.selectedCityId = cityId ? Number(cityId) : undefined;
            this.selectedStreetId = streetId ? Number(streetId) : undefined;
            this.selectedStreetNumberId = streetNumberId ? Number(streetNumberId) : undefined;

            this.route.queryParamMap.subscribe((params) => {
            this.selectedCityName = params.get('cityName') ?? '';
            this.selectedStreetName = params.get('streetName') ?? '';
            this.selectedStreetNumber = params.get('streetNumber') ?? '';
            });
        } else if (url.includes('/fin-card')) {
            this.activeIndex = 4;
            const cityId = this.route.snapshot.paramMap.get('cityId');
            const streetId = this.route.snapshot.paramMap.get('streetId');
            const streetNumberId = this.route.snapshot.paramMap.get('streetNumberId');
            this.selectedCityId = cityId ? Number(cityId) : undefined;
            this.selectedStreetId = streetId ? Number(streetId) : undefined;
            this.selectedStreetNumberId = streetNumberId ? Number(streetNumberId) : undefined;
            const ownerId = this.route.snapshot.paramMap.get('ownerId');
            this.selectedOwnerId = ownerId ? Number(ownerId) : undefined;

            this.route.queryParamMap.subscribe((params) => {
            this.selectedCityName = params.get('cityName') ?? '';
            this.selectedStreetName = params.get('streetName') ?? '';
            this.selectedStreetNumber = params.get('streetNumber') ?? '';
            });
        } else {
            // default fallback
            this.activeIndex = 0;
            this.selectedCityId = undefined;
            this.selectedStreetId = undefined;
        }
    }

    goBack() {
        if (this.activeIndex === 4 && this.selectedCityId && this.selectedStreetId && this.selectedStreetNumberId && this.selectedCityName && this.selectedStreetName && this.selectedStreetNumber && this.selectedOwnerId) {
            this.router.navigate(['/pages/hierarchy-wizard/building', this.selectedCityId ,this.selectedStreetId, this.selectedStreetNumberId], {
                queryParams: 
                    { cityName: this.selectedCityName, streetName: this.selectedStreetName, streetNumber: this.selectedStreetNumber },
            });
        } else if (this.activeIndex === 3 && this.selectedCityId && this.selectedStreetId && this.selectedStreetNumberId && this.selectedCityName && this.selectedStreetName && this.selectedStreetNumber) {
            this.router.navigate(['/pages/hierarchy-wizard/street-numbers', this.selectedCityId ,this.selectedStreetId], {
                queryParams: 
                    { cityName: this.selectedCityName, streetName: this.selectedStreetName },
            });
        } else if (this.activeIndex === 2 && this.selectedCityId && this.selectedStreetId && this.selectedCityName && this.selectedStreetName ) {
            this.router.navigate(['/pages/hierarchy-wizard/streets', this.selectedCityId], {
                queryParams: 
                    { cityName: this.selectedCityName, streetName: this.selectedStreetName }
            });
        } else if (this.activeIndex === 1) {
            this.router.navigate(['/pages/hierarchy-wizard/cities']);
        }
    }

    canGoBack(): boolean {
        return this.activeIndex > 0;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
