import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HydroServingState, getAllMetrics } from '@core/reducers';
import { MonitoringService } from '@core/services/metrics/monitoring.service';
import { DialogService } from '@dialog/dialog.service';
import { getSelectedModelVersion } from '@models/reducers';
import { Store } from '@ngrx/store';
import { ModelVersion } from '@shared/_index';
import { MetricSpecification, IMetricSpecificationProviders } from '@shared/models/metric-specification.model';
import { Observable, of, combineLatest } from 'rxjs';
import { filter, switchMap, take} from 'rxjs/operators';

@Component({
    selector: 'hs-model-version-monitoring',
    templateUrl: './model-version-monitoring.component.html',
    styleUrls: ['model-version-monitoring.component.scss'],
})
export class ModelVersionMonitoringComponent {
    isMonitoringAvailable$: Observable<boolean> = of(false);
    modelVersion$: Observable<ModelVersion>;
    metricSpecifications$: Observable<MetricSpecification[]>;
    metricSpecificationProviders$: Observable<IMetricSpecificationProviders>;
    chartTimeWidth: number = 1800000;
    chartTimeWidthParams: Array<{ ms: number, text: string }> = [
        { ms: 900000, text: '15 minutes' },
        { ms: 1800000, text: '30 minutes' },
        { ms: 3600000, text: '1 hour' },
        { ms: 7200000, text: '2 hours' },
        { ms: 14400000, text: '4 hours' },
    ];

    constructor(
        private dialog: DialogService,
        private store: Store<HydroServingState>,
        private router: Router,
        private ac: ActivatedRoute,
        private monitoringService: MonitoringService
    ) {
        this.modelVersion$ = this.store.select(getSelectedModelVersion).pipe(
            filter(modelVersion => !!modelVersion)
        );

        this.metricSpecifications$ = this.store.select(getAllMetrics);

        this.metricSpecificationProviders$ = this.metricSpecifications$.pipe(
            switchMap((mericSpecifications: MetricSpecification[]) => {
                return of(this.createMetricProviders(mericSpecifications));
            })
        );

        this.isMonitoringAvailable$ = combineLatest(this.modelVersion$).pipe(
            switchMap(([modelVersion]) => of(!!modelVersion))
        );
    }

    public goToLog(metricSpecificationProvider): void {
        this.modelVersion$.pipe(take(1)).subscribe(_ => {
            const {id} = metricSpecificationProvider.byModelVersionId[_.id];
            this.router.navigate([id], { relativeTo: this.ac});
        });
    }

    private createMetricProviders(
        metricSpecifications: MetricSpecification[]
    ): IMetricSpecificationProviders  {

        const tmp: IMetricSpecificationProviders = {};
        metricSpecifications.forEach(metricSpec => {
            if (tmp[metricSpec.kind] === undefined) {
                tmp[metricSpec.kind] = {
                    kind: metricSpec.kind,
                    byModelVersionId: {},
                    metrics: this.monitoringService.getMetricsBySpecKind(metricSpec.kind),
                };
            }

            tmp[metricSpec.kind].byModelVersionId[metricSpec.modelVersionId] = metricSpec;
        });

        return tmp;
    }
}
