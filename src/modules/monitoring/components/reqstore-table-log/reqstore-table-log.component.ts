import { KeyValue } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { IMetricData } from '@core/services/metrics/monitoring.service';
import { IModelVersion } from '@shared/models/_index';
import { isEmptyObj } from '@shared/utils/is-empty-object';

@Component({
  selector: 'hs-reqstore-table-log',
  templateUrl: './reqstore-table-log.component.html',
  styleUrls: ['./reqstore-table-log.component.scss'],
})
export class ReqstoreTableLogComponent implements OnInit, OnChanges {
  @Input()
  modelVersion: IModelVersion;

  @Input()
  logData: any;

  @Input()
  loading: any;

  selectedLogItem: any;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.logData && changes.logData.currentValue) {
      const values = Object.values(changes.logData.currentValue);

      if (values.length > 0) {
        this.selectedLogItem = values[0];
      } else {
        this.selectedLogItem = undefined;
      }
    }
  }

  ngOnInit(): void {}

  selectLogItem(item) {
    this.selectedLogItem = item;
  }

  logNotEmpty(): boolean {
    return !isEmptyObj(this.logData);
  }

  valueAscOrder = (
    a: KeyValue<number, string>,
    b: KeyValue<number, string>
  ): number => {
    return a.key - b.key;
  }

  metricHasManyFeatures(metric) {
    const features = Object.values(metric);
    return features.length > 1;
  }

  featuresCount(metric) {
    const features = Object.values(metric);
    return features.length;
  }

  failedCount(metric) {
    const features = Object.values(metric).filter(metrics => {
      const firstMetric = Object.values(metrics)[0];
      return firstMetric.health === false;
    });
    return features.length;
  }

  isFailedFeature(feature: { [columnIndex: string]: IMetricData }) {
    const metrics: IMetricData[] = Object.values(feature);
    return metrics.some(metricData => metricData.health === false);
  }
}