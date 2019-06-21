
import {take} from 'rxjs/operators';

import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ReplaySubject, Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import locationIds from './location_data.json';
import * as _ from 'lodash';
@Injectable()
export class OpenmrsResourcesService {
  private locations = new ReplaySubject(1);
  private v = 'full';

  constructor(protected http: HttpClient) {
  }

  public getLocations(forceRefresh?: boolean) {
    // If the Subject was NOT subscribed before OR if forceRefresh is requested

    const params = new HttpParams().set('v', 'full');

    if (!this.locations.observers.length || forceRefresh) {
      this.http.get<any>(
        `/openmrs/ws/rest/v1/location`,
        {
          params
        }
      ).pipe(take(1)).subscribe(
        (data) => this.locations.next(data.results),
        (error) => this.locations.error(error)
        );
    }

    return this.locations;
  }

  public getLocationByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {

    let url = `/openmrs/ws/rest/v1/location`;
    url += '/' + uuid;

    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    const request = this.http.get(url, { params });
    return request;
  }

  public getLocationIdByUuid(uuid: string): any {
    const _location = locationIds.locations.filter((location) => {
      return location.uuid === uuid;
    });
    if (_location.length > 0) {
      return _location[0].id;
    }
    return null;
  }

  public searchLocation(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {

    const url = `/openmrs/ws/rest/v1/location`;
    const params: HttpParams = new HttpParams()
    .set('q', searchText)
    .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get<any>(url, {
      params
    }).pipe(
      map((response) => {
        return response.results;
      }));
  }

  public getUrl(): string {

    return '/openmrs/ws/rest/v1/provider';
  }

  public searchProvider(searchText: string, cached: boolean = false, v: string = null):
    Observable<any> {
    if (this.isEmpty(searchText)) {
      return of([]);
    }
    const url = this.getUrl();
    const params: HttpParams = new HttpParams()
      .set('q', searchText)
      .set('v', (v && v.length > 0) ? v : this.v);


    return this.http.get<any>(url, {
      params
    }).pipe(
      map((response) => {
        return response.results;
      }));
  }

  public getProviderByUuid(uuid: string, cached: boolean = false, v: string = null):
    Observable<any> {

    if (this.isEmpty(uuid)) {
      return of(undefined);
    }

    let url = this.getUrl();
    url += '/' + uuid;

    const params: HttpParams = new HttpParams()
      .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params
    });
  }
  public getProviderByPersonUuid(uuid: string, v?: string): ReplaySubject<any> {
    const providerResults = new ReplaySubject(1);

    if (this.isEmpty(uuid)) {
       providerResults.next(null);
    } else {
      this.getPersonByUuid(uuid, false).pipe(take(1)).subscribe(
        (result) => {
          if (result) {
            const response = this.searchProvider(result.display, false, v);

            response.pipe(take(1)).subscribe(
              (providers) => {
                let foundProvider;
                _.each(providers, (provider: any) => {
                  if (provider.person && provider.person.uuid === uuid) {
                    foundProvider = provider;
                  }
                });
                if (foundProvider) {
                  if (foundProvider.display === '') {
                    foundProvider.display = foundProvider.person.display;
                  }
                  providerResults.next(foundProvider);
                } else {
                  const msg = 'Error processing request: No provider with given person uuid found';
                  providerResults.error(msg);
                }

              },
              (error) => {
                const msg = 'Error processing request: No person with given uuid found';
                providerResults.error(msg);
              }
            );

          }

        },
        (error) => {
          providerResults.error(error);
        }
      );
    }
    return providerResults;
  }

  public getPersonByUuid(uuid: string, cached: boolean = false, v: string = null): Observable<any> {

    let url = '/openmrs/ws/rest/v1/person';
    url += '/' + uuid;

    const params: HttpParams = new HttpParams()
    .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params
    });
  }
  private isEmpty(str: string) {
    return (_.isUndefined(str) || _.isNull(str) || str.trim().length === 0 || str === 'null' || str === 'undefined');
  }

}
