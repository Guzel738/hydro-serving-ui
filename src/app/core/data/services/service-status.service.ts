import { Injectable } from '@angular/core';
import { HttpService } from '@app/core/data/services/http.service';
import {
  createServiceSupportOnFailure,
  ModelVersion,
  ModelVersionServicesStatus,
  ServiceSupported,
} from '@app/core/data/types';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const enum ServicesEndpoints {
  stat = 'stat/support',
  visualization = 'visualization/supported',
}
@Injectable({
  providedIn: 'root'
})
export class ServiceStatusService {

  constructor(private http: HttpService) {}

  loadSupported(modelVersion: ModelVersion): Observable<ModelVersionServicesStatus> {
    const toRequest = endpoint =>
      this.http
        .get<ServiceSupported>(endpoint, { params: { model_version_id: `${modelVersion.id}` } })
        .pipe(
          catchError(err => {
            return of(createServiceSupportOnFailure(err))
          })
        )

    return forkJoin({
      stat: toRequest(ServicesEndpoints.stat),
      visualization: toRequest(ServicesEndpoints.visualization),
    })
  }
}
