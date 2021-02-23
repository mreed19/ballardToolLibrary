/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import Vuex, { ActionTree, MutationTree } from 'vuex';
import axios from 'axios';

import { RootState, Volunteer, VolunteerHours } from './types';

Vue.use(Vuex);

const state: RootState = {
  volunteers: [],
  volunteerHours: []
};

const mutations: MutationTree<RootState> = {
  setVolunteers(state: RootState, volunteers: Volunteer[]) {
    state.volunteers = volunteers;
  },
  setVolunteerHours(state: RootState, volunteerHours: VolunteerHours[]) {
    state.volunteerHours = volunteerHours;
  }
};

const actions: ActionTree<RootState, RootState> = {
  async getVolunteers({ commit }): Promise<void> {
    const { data } = await axios.get('http://localhost:8080/volunteers');
    commit(
      'setVolunteers',
      data.map((volunteer: any) => {
        return {
          id: volunteer.id,
          firstName: volunteer.first_name,
          lastName: volunteer.last_name,
          emailAddress: volunteer.email_address,
          dateCreated: volunteer.date_created
        } as Volunteer;
      })
    );
  },
  async createVolunteer(context, volunteer: Volunteer): Promise<void> {
    await axios.post('http://localhost:8080/volunteers/create', {
      first_name: volunteer.firstName,
      last_name: volunteer.lastName,
      email_address: volunteer.emailAddress
    });
  },
  async getVolunteerHoursByDateRange({ commit }, { startDate, endDate }) {
    const { data } = await axios.get(
      `http://localhost:8080/volunteer_hours?start_date=${startDate}&end_date=${endDate}`
    );
    commit(
      'setVolunteerHours',
      data.map((volunteerHours: any) => {
        return {
          id: volunteerHours.id,
          volunteerId: volunteerHours.volunteer_id,
          hoursRecorded: volunteerHours.hours_recorded,
          dateRecorded: volunteerHours.date_recorded,
          dateCreated: volunteerHours.date_created
        } as VolunteerHours;
      })
    );
  },
  async createVolunteerHours(context, volunteerHours: VolunteerHours) {
    console.log(volunteerHours);
    await axios.post('http://localhost:8080/volunteer_hours/create', {
      volunteer_id: volunteerHours.volunteerId,
      hours_recorded: volunteerHours.hoursRecorded,
      date_recorded: volunteerHours.dateRecorded
    });
  }
};

export default new Vuex.Store<RootState>({
  state,
  mutations,
  actions
});
