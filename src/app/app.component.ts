import { Component, OnInit } from '@angular/core';
import { parcelPropsSubject } from './parcel-props.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    parcelPropsSubject.subscribe(
      props => {
        this.patientUuid = props.patientUuid
      },
    )
  }
  patientUuid = 'hackathon';
}
