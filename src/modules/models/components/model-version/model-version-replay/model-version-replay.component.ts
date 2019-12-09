import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { TimemachineService } from '@core/services/timemachine.service';
import { HydroServingState } from '@core/store';
import {
  selectSiblingModelVersions,
  selectSelectedModelVersion,
} from '@models/store/selectors';
import { Store, select } from '@ngrx/store';
import { ModelVersion } from '@shared/_index';
import { Observable, fromEvent, Subscription } from 'rxjs';
import { withLatestFrom, exhaustMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'hs-model-version-replay',
  templateUrl: './model-version-replay.component.html',
  styleUrls: ['./model-version-replay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelVersionReplayComponent implements OnInit, OnDestroy {
  @ViewChild('replyButton', { read: ElementRef }) replyButton: ElementRef;
  siblingsModelVersions$: Observable<ModelVersion[]>;
  modelVersion$: Observable<ModelVersion>;
  replayableModelVersion: number;
  onReplayClick$: Observable<any>;
  replayClickSubscribe: Subscription;

  constructor(
    private store: Store<HydroServingState>,
    private timemachine: TimemachineService
  ) {
    this.modelVersion$ = this.store.pipe(select(selectSelectedModelVersion));
    this.siblingsModelVersions$ = this.modelVersion$.pipe(
      switchMap(({ model: { id: modelId }, id: modelVersionId }) =>
        selectSiblingModelVersions({
          modelId,
          modelVersionId,
        })
      )
    );
  }

  ngOnInit() {
    this.onReplayClick$ = fromEvent(
      this.replyButton.nativeElement,
      'click'
    ).pipe(
      withLatestFrom(this.modelVersion$),
      exhaustMap(([_, modelVersionTo]: [any, ModelVersion]) => {
        return this.timemachine.travel({
          modelNameTo: `${modelVersionTo.model.name}`,
          modelVersionFrom: `${this.replayableModelVersion}`,
          versionTo: `${modelVersionTo.modelVersion}`,
          from: '0',
          till: '8559030671000000000',
        });
      })
    );
    this.replayClickSubscribe = this.onReplayClick$.subscribe();
  }

  ngOnDestroy(): void {
    this.replayClickSubscribe.unsubscribe();
  }
}