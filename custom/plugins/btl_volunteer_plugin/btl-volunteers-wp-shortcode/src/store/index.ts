/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue from 'vue';
import Vuex, { ActionTree, MutationTree } from 'vuex';
import axios from 'axios';

import { RootState, Volunteer, VolunteerHours } from './types';

Vue.use(Vuex);

const wordpressRestURL = (document.querySelector(
  'link[rel="https://api.w.org/"]'
) as HTMLLinkElement)?.href;
const baseURL = wordpressRestURL
  ? `${wordpressRestURL}btl_volunteers/v1`
  : 'http://localhost:8080';
const hasPrettyPermalinks = !baseURL.includes('rest_route');

axios.defaults.headers.common['Cache-Control'] =
  'no-cache, must-revalidate, max-age=0';

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
    const { data } = await axios.get(`${baseURL}/volunteers`);
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
    await axios.post(`${baseURL}/volunteers`, {
      first_name: volunteer.firstName,
      last_name: volunteer.lastName,
      email_address: volunteer.emailAddress
    });
  },
  async getVolunteerHoursByDateRange({ commit }, { startDate, endDate }) {
    const { data } = await axios.get(
      `${baseURL}/volunteer_hours${
        hasPrettyPermalinks ? '?' : '&'
      }start_date=${encodeURIComponent(
        startDate
      )}&end_date=${encodeURIComponent(endDate)}`
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
    await axios.post(`${baseURL}/volunteer_hours`, {
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
