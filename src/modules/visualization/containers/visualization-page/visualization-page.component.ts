import { Component } from '@angular/core';
import {
  ScatterPlotPoint,
  ScatterPlotData,
} from '@charts/models/scatter-plot-data.model';
import { Metric } from '@core/models';
import { Observable } from 'rxjs';
import { VisualizationPageService, ColorBy } from '../../services';

@Component({
  selector: 'hs-visualization',
  templateUrl: './visualization-page.component.html',
  styleUrls: ['./visualization-page.component.scss'],
})
export class VisualizationPageComponent {
  selectedLabel: { [name: string]: string };
  selectedMetric: string;

  selectedIndex: number;
  selectedPoint$: Observable<ScatterPlotPoint>;

  selectedMetric$: Observable<Metric>;
  selectedMetricName$: Observable<string>;

  labels$: Observable<string[]>;
  metrics$: Observable<string[]>;
  colors$: Observable<string[]>;
  top100$: Observable<number[]>;
  scatterPlotData$: Observable<ScatterPlotData>;
  showTop100: boolean = false;
  loading$: Observable<boolean>;
  colorBy$: Observable<ColorBy>;

  constructor(private service: VisualizationPageService) {
    this.loading$ = this.service.loading$;
    this.scatterPlotData$ = this.service.scatterPlotData$;
    this.labels$ = this.service.labelsNames$;
    this.metrics$ = this.service.metricNames$;
    this.colors$ = this.service.colors$;
    this.selectedPoint$ = this.service.selectedPoint$;
    this.top100$ = this.service.top100$;
    this.colorBy$ = this.service.colorBy$;
    this.selectedMetric$ = this.service.selectedMetric$;
    this.selectedMetricName$ = this.service.selectedMetricName$;
  }

  handleSelectPoint(index: number) {
    this.selectedIndex = index;
    this.service.selectIndex(index);
  }

  handleSelectLabel(label: any): void {
    this.selectedLabel = label;
    this.service.selectLabel(label);
  }
  handleSelectMetric(metric: string): void {
    this.service.selectMetricName(metric);
  }

  onColorByChange(colorBy: ColorBy): void {
    this.service.changeColorBy(colorBy);
  }
}
