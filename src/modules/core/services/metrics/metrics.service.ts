
import { Injectable } from '@angular/core';
import { NewHttpService } from '@core/services/new_http/new_http.service';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';

@Injectable()
export class MetricsService {

  private baseMetricsUrl: string;

  constructor(
    private newHttp: NewHttpService
  ) {
    this.baseMetricsUrl = `${environment.monitoringUrl}`;
  }

  public getMetrics(
    application: string,
    stage: string,
    interval: string,
    metrics: string[],
    columnIndex?: string
    ) {
      return this.newHttp.get(
          `${this.baseMetricsUrl}/metrics`,
          { params: {
              application,
              stage,
              interval,
              metrics,
              columnIndex,
            },
          },
          false
        ).pipe(
          map((res: Response): any => res)
        ).toPromise();
  }

  public getHealth() {
    return this.newHttp.get(`${this.baseMetricsUrl}/health`, null, false).pipe(
      map((res: Response): any => res)
    ).toPromise();
  }
}
