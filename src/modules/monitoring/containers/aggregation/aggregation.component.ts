import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChecksAggregation } from '@monitoring/interfaces';
import { interpolateRdYlGn } from 'd3';

@Component({
  selector: 'hs-aggregation',
  templateUrl: './aggregation.component.html',
  styleUrls: ['./aggregation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AggregationComponent implements OnChanges {
  @ViewChild('svgContainer', { read: ElementRef })
  svgContainer: ElementRef;

  @Input() aggregation: ChecksAggregation[] = [];
  @Input() latency: number[] = [];
  @Input() errors: boolean[] = [];
  @Output() changedSelectedColumn = new EventEmitter<string>();

  labelsWidth: number = 100;
  canvasWidth: number = 620;
  selectedColumnId: string;

  readonly CELL_SIZE = 12;
  private COLUMN_MARGIN_RIGHT = 2;
  private CELL_MARGIN_TOP = 2;

  ngOnChanges(changes: SimpleChanges): void {
    const aggregation: ChecksAggregation[] = changes.aggregation.currentValue;
    if (aggregation && aggregation.length) {
      const selectedColumn = aggregation.find(
        agg => agg.additionalInfo._id === this.selectedColumnId
      );

      if (selectedColumn === undefined) {
        this.changeActiveColumn(aggregation[aggregation.length - 1]);
      }
    }
  }

  get canvasHeight() {
    return this.featureNames.length * 14;
  }

  get metricsCanvasHeight() {
    return this.metricNames.length * 14;
  }

  columnTranslate(index): string {
    return `translate(${index * this.CELL_SIZE +
      this.COLUMN_MARGIN_RIGHT * index}, 0)`;
  }

  rowTranslate(index): string {
    return `translate(0, ${index * this.CELL_SIZE +
      index * this.CELL_MARGIN_TOP})`;
  }

  get countRequests(): number {
    if (this.aggregation) {
      return this.aggregation.reduce(
        (res, { additionalInfo: { _hs_requests } }) => res + _hs_requests,
        0
      );
    }
    return 0;
  }

  get firstId(): string {
    if (this.aggregation.length) {
      return this.aggregation[0].additionalInfo._hs_first_id;
    }
  }
  get lastId(): string {
    if (this.aggregation.length) {
      return this.aggregation[this.aggregation.length - 1].additionalInfo
        ._hs_last_id;
    }
  }

  get featureNames(): string[] {
    return Object.keys(this.aggregation[0].features);
  }

  get metricNames(): string[] {
    return Object.keys(this.aggregation[0].metrics);
  }

  changeActiveColumn(aggregation: ChecksAggregation) {
    const id = aggregation.additionalInfo._id;
    this.selectedColumnId = id;
    this.changedSelectedColumn.next(id);
  }

  cellColor(column: ChecksAggregation, featureName: string) {
    if (column.features[featureName] === undefined) {
      return this.greyColor;
    }

    const { passed, checked } = column.features[featureName];

    const ratio = checked / passed;

    if (ratio) {
      return interpolateRdYlGn(1 / ratio);
    } else {
      return this.greyColor;
    }
  }

  metricCellColor(column: ChecksAggregation, metricName: string) {
    if (column.metrics[metricName] === undefined) {
      return this.greyColor;
    }

    const { passed, checked } = column.metrics[metricName];

    const ratio = checked / passed;

    if (ratio) {
      return interpolateRdYlGn(1 / ratio);
    } else {
      return this.greyColor;
    }
  }

  isSelected(column: ChecksAggregation): boolean {
    return this.selectedColumnId === column.additionalInfo._id;
  }

  get dataAvailable(): boolean {
    return this.aggregation && this.aggregation.length > 0;
  }

  private get greyColor(): string {
    return '#70757a';
  }
}
