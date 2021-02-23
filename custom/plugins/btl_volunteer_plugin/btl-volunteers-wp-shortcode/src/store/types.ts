export interface Volunteer {
  id?: number;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  dateCreated?: string;
}

export interface VolunteerHours {
  id?: number;
  volunteerId?: number;
  hoursRecorded?: number;
  dateRecorded?: string;
  dateCreated?: string;
}

export interface RootState {
  volunteers: Volunteer[];
  volunteerHours: VolunteerHours[];
}
