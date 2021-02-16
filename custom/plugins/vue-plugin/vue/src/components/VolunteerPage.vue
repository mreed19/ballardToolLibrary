<template>
  <div id="volunteers">
    <h1>Testing</h1>
    <div class="center">
      <h2>Volunteers</h2>
      <ul>
        <li v-for="(volunteer, index) in volunteers" :key="index">
          <span>{{ `${volunteer['id']}: ${volunteer['first_name']} ${volunteer['last_name']}: ${volunteer['email_address']}` }}</span>
        </li>
      </ul>
    </div>
    <div class="center">
      <h2>Volunteer Hours</h2>
      <ul>
        <li v-for="(hours, index) in volunteerHours" :key="index">
          <span>{{ `ID: ${hours['volunteer_id']} Hours: ${hours['hours_recorded']} Date Recorded: ${hours['date_recorded']}` }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss">
#volunteers {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<script>
import axios from 'axios';

export default {
  name: 'VolunteerPage',
  data: () => ({
    volunteers: [],
    volunteerHours: [],
    baseURL: null,
    hasPrettyPermalinks: true
  }),
  async mounted() {
    this.baseURL = document.querySelector('link[rel="https://api.w.org/"]').href;
    this.hasPrettyPermalinks = !this.baseURL.includes('rest_route');
    try {
      let response = await axios.get(`${this.baseURL}btl_volunteers/v1/volunteers`);
      this.volunteers = response.data
      response = await axios.get(`${this.baseURL}btl_volunteers/v1/volunteer_hours${this.hasPrettyPermalinks ? '?' : '&' }start_date=${encodeURIComponent('2020-01-01 00:00:00')}&end_date=${encodeURIComponent('2021-12-31 00:00:00')}`);
      console.log(response.data);
      this.volunteerHours = response.data;
    } catch (err) {
      console.log(err);
    }
  }
};
</script>

