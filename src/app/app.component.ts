import { Component, OnInit } from '@angular/core';
import { Http, ResponseContentType, Headers } from '@angular/http';
import { Subject, Observable, of } from 'rxjs';

import { parcelPropsSubject } from './parcel-props.service';

import {
  QuestionFactory, Form, FormFactory, ObsValueAdapter, OrderValueAdapter,
  EncounterAdapter, DataSources, FormErrorsService, EncounterPdfViewerService
} from 'ngx-openmrs-formentry/dist/ngx-formentry';

import adultForm from './adult.json';
import adultFormObs from './obs.json';


import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: any;
  schema: any;
  sections: {} = {};
  formGroup: FormGroup;
  activeTab = 0;
  form: Form;
  stack = [];
  encounterObject = adultFormObs;
  showingEncounterViewer = false;
  constructor(private questionFactory: QuestionFactory, private formFactory: FormFactory,
              private obsValueAdapater: ObsValueAdapter, private orderAdaptor: OrderValueAdapter,
              private encAdapter: EncounterAdapter, private dataSources: DataSources,
              private encounterPdfViewerService: EncounterPdfViewerService,
              private formErrorsService: FormErrorsService) {
    this.schema = adultForm;

  }
  patientUuid = 'hackathon';
  ngOnInit() {
    parcelPropsSubject.subscribe(
      props => {
        this.patientUuid = props.patientUuid;
      },
    );
    this.dataSources.registerDataSource('drug', { searchOptions: this.sampleSearch, resolveSelectedValue: this.sampleResolve });
    this.dataSources.registerDataSource('personAttribute',
      { searchOptions: this.sampleSearch, resolveSelectedValue: this.sampleResolve });
    this.dataSources.registerDataSource('problem', { searchOptions: this.sampleSearch, resolveSelectedValue: this.sampleResolve });
    this.dataSources.registerDataSource('location', { searchOptions: this.sampleSearch, resolveSelectedValue: this.sampleResolve });
    this.dataSources.registerDataSource('provider', { searchOptions: this.sampleSearch, resolveSelectedValue: this.sampleResolve });

    const ds = {
      dataSourceOptions: { concept: undefined },
      searchOptions: (text?: string) => {
        if (ds.dataSourceOptions && ds.dataSourceOptions.concept) {
          const items: Array<any> = [{ id: 1, text: 'Stage 1 Symptom' }, { id: 2, text: 'Stage 2 Symptom' }];
          return Observable.create((observer: Subject<any>) => {
            setTimeout(() => {
              observer.next(items);
            }, 1000);
          });
        }
      },

      resolveSelectedValue: (key: string) => {
        if (ds.dataSourceOptions && ds.dataSourceOptions.concept) {
          const item = { id: 1, text: 'Stage 1 Symptom' };
          return Observable.create((observer: Subject<any>) => {
            setTimeout(() => {
              observer.next(item);
            }, 1000);
          });
        }
      }
    };

    this.dataSources.registerDataSource('conceptAnswers', ds);


    // Create form
    this.createForm();

    this.encAdapter.populateForm(this.form, adultFormObs);

  }


  public getSectionData(sectionId) {
    let data = {};
    data = this.sections[sectionId];
    return data;
  }

  public clickTab(tabNumber) {
    this.activeTab = tabNumber;
  }

  public createForm() {
    this.form = this.formFactory.createForm(this.schema, this.dataSources.dataSources);
  }

  public sampleResolve(): Observable<any> {
    const item = { value: '1', label: 'Art3mis' };
    return Observable.create((observer: Subject<any>) => {
      setTimeout(() => {
        observer.next(item);
      }, 1000);
    });
  }

  public sampleSearch(): Observable<any> {
    const items: Array<any> = [{ value: '0', label: 'Aech' },
    { value: '5b6e58ea-1359-11df-a1f1-0026b9348838', label: 'Art3mis' },
    { value: '2', label: 'Daito' },
    { value: '3', label: 'Parzival' },
    { value: '4', label: 'Shoto' }];

    return Observable.create((observer: Subject<any>) => {
      setTimeout(() => {
        observer.next(items);
      }, 1000);
    });
  }

  public onSubmit($event) {
    $event.preventDefault();

    // Set valueProcessingInfo
    this.form.valueProcessingInfo = {
      patientUuid: 'patientUuid',
      visitUuid: 'visitUuid',
      encounterTypeUuid: 'encounterTypeUuid',
      formUuid: 'formUuid',
      encounterUuid: 'encounterUuid',
      providerUuid: 'providerUuid',
      utcOffset: '+0300'
    };

    if (this.form.valid) {
      this.form.showErrors = false;
      const payload = this.encAdapter.generateFormPayload(this.form);
    } else {
      this.form.showErrors = true;
      this.form.markInvalidControls(this.form.rootNode);
    }
  }

  public toggleEncounterViewer() {
    this.showingEncounterViewer === true ?
      this.showingEncounterViewer = false : this.showingEncounterViewer = true;
  }
}
