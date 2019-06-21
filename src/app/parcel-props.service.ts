import { ReplaySubject } from 'rxjs';

export const parcelPropsSubject = new ReplaySubject<ParcelProps>(1)

type ParcelProps = {
  patientUuid: string,
  formUuid: string,
  encounterTypeUuid: string
}