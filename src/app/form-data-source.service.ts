import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, flatMap, catchError } from 'rxjs/operators';
import { OpenmrsResourcesService } from './openmrs-resources.service';
import * as _ from 'lodash';

@Injectable()
export class FormDataSourceService {
    constructor(private openmrsResourcesService: OpenmrsResourcesService) {

    }
    public getLocationDataSource() {
        const resolve = (uuid: string) => {
            return this.getLocationByUuid(uuid);
        };

        const find = (text: string) => {
            return this.findLocation(text);
        };

        return {
            resolveSelectedValue: resolve,
            searchOptions: find
        };
    }

    public getDataSources() {
        const formData: any = {
            location: this.getLocationDataSource(),
            provider: this.getProviderDataSource()
        };
        return formData;
    }
    public findLocation(searchText): Observable<Location[]> {
        const locationSearchResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        const findLocation = this.openmrsResourcesService.searchLocation(searchText, false);
        findLocation.subscribe(
            (locations) => {
                const mappedLocations = locations.map((l: any) => {
                    return {
                        value: l.uuid,
                        label: l.display
                    };
                });
                locationSearchResults.next(mappedLocations.slice(0, 10));
            },
            (error) => {
                locationSearchResults.error(error); // test case that returns error
            }
        );
        return locationSearchResults.asObservable();
    }
    public getProviderDataSource() {
        const resolve = (uuid: string) => {
            return this.getProviderByUuid(uuid);
        };
        const find = (text: string) => {
            return this.findProvider(text);
        };

        return {
            resolveSelectedValue: resolve,
            searchOptions: find
        };
    }

    public findProvider(searchText): Observable<any[]> {
        const providerSearchResults: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
        const findProvider = this.openmrsResourcesService.searchProvider(searchText, false);
        findProvider.subscribe(
            (provider) => {
                const selectedOptions = [];
                const filtered = _.filter(provider, (p: any) => {
                    if (p.person) {
                        return true;
                    } else {
                        return false;
                    }
                });
                const mappedProviders = filtered.map((p: any) => {
                    return {
                        value: p.uuid,
                        label: p.display,
                        providerUuid: p.uuid
                    };
                });
                // this.setCachedProviderSearchResults(mappedProviders);
                providerSearchResults.next(mappedProviders.slice(0, 10));
            },
            (error) => {
                providerSearchResults.error(error); // test case that returns error
            }
        );
        return providerSearchResults.asObservable();
    }

    public getProviderByUuid(uuid): Observable<any> {
        const providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        return this.openmrsResourcesService.getProviderByUuid(uuid, false).pipe(
            map(
                (provider) => {
                    return {
                        label: provider.display,
                        value: provider.uuid,
                        providerUuid: (provider as any).uuid
                    };
                })).pipe(
                    flatMap((mappedProvider) => {
                        providerSearchResults.next(mappedProvider);
                        return providerSearchResults.asObservable();
                    }),
                    catchError((error) => {
                        providerSearchResults.error(error); // test case that returns error
                        return providerSearchResults.asObservable();
                    }));
    }
    public getProviderByPersonUuid(uuid) {
        const providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        this.openmrsResourcesService.getProviderByPersonUuid(uuid)
            .subscribe(
                (provider) => {
                    const mappedProvider = {
                        label: (provider as any).display,
                        value: (provider as any).person.uuid,
                        providerUuid: (provider as any).uuid
                    };
                    providerSearchResults.next(mappedProvider);
                },
                (error) => {
                    providerSearchResults.error(error); // test case that returns error
                }

            );
        return providerSearchResults.asObservable();
    }

    public getLocationByUuid(uuid): Observable<any> {
        const locationSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
        return this.openmrsResourcesService.getLocationByUuid(uuid, false).pipe(
            map(
                (location) => {
                    return {
                        label: location.display,
                        value: location.uuid
                    };
                })).pipe(
                    flatMap((mappedLocation) => {
                        locationSearchResults.next(mappedLocation);
                        return locationSearchResults.asObservable();
                    }),
                    catchError((error) => {
                        locationSearchResults.error(error);
                        return locationSearchResults.asObservable();
                    })
                );
    }
}
