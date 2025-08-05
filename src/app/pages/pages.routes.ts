import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
//import { Cities } from './cities/cities'
import { HierarchyWizardComponent } from './hierarchy-wizard/hierarchy-wizard';
//import { Streets } from './streets/streets';
import { Debtors } from './debtors/debtors';
import { Warnings } from './warnings/warnings';
import { Representatives } from './representatives/representatives';
import { OtherIncome } from './other-income/other-income';
import { FinancialCard } from './fin-card/fin-card-expanded';

export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
  //  { path: 'cities', component: Cities },
    { path: 'empty', component: Empty },
    { path: 'debtors', component: Debtors },
    { path: 'warnings', component: Warnings },
    { path: 'representatives', component: Representatives },
    { path: 'other-income', component: OtherIncome },
    { path: 'financial-card', component: FinancialCard },
    { 
        path: 'hierarchy-wizard',
        children: [
            { path: 'cities', component: HierarchyWizardComponent },
            { path: 'streets/:cityId', component: HierarchyWizardComponent },
            { path: 'street-numbers/:cityId/:streetId', component: HierarchyWizardComponent },
            { path: 'building/:cityId/:streetId/:streetNumberId', component: HierarchyWizardComponent },
            { path: 'fin-card/:cityId/:streetId/:streetNumberId/:ownerId', component: HierarchyWizardComponent }
        ],
        routerLinkActiveOptions: { exact: false}
    },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
