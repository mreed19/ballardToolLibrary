<template>
  <div>
    <h1>Volunteer Hours</h1>
    <section name="volunteer-hours-form-section">
      <form
        class="volunteer-hours-form"
        novalidate
        @submit.prevent="createVolunteerHours"
      >
        <div class="form-fields">
          <div class="form-field">
            <label for="selectedVolunteer" class="label">
              Volunteer
              <div :class="`select ${validatedClass('selectedVolunteer')}`">
                <select
                  name="selectedVolunteer"
                  v-model="form.selectedVolunteerId"
                  v-on:change="handleVolunteerCreateRoute"
                >
                  <option disabled selected value="">
                    -- select an option --
                  </option>
                  <option
                    v-for="(volunteer, index) of volunteers"
                    :value="volunteer.id"
                    :key="index"
                  >
                    {{ `${volunteer.firstName} ${volunteer.lastName}` }}
                  </option>
                  <option value="routeToVolunteerCreate">
                    Create new volunteer...
                  </option>
                </select>
              </div>
            </label>
          </div>
          <div class="form-field">
            <label for="hoursRecorded" class="label">
              Hours Recorded
              <input
                type="number"
                :class="`input ${validatedClass('hoursRecorded')}`"
                name="hoursRecorded"
                v-model.number="form.hoursRecorded"
              />
            </label>
          </div>
          <div class="form-field datepicker-field">
            <md-datepicker
              :class="validatedClass('dateRecorded')"
              v-model="form.dateRecorded"
              :md-debounce="100"
              :md-model-type="String"
            >
              <label>Date Recorded</label>
            </md-datepicker>
          </div>
        </div>
        <button type="submit" :disabled="$v.form.$invalid">Log Hours</button>
      </form>
    </section>
    <section name="date-range-form-section">
      <form
        class="date-range-form"
        novalidate
        @submit.prevent="searchDateRange"
      >
        <div class="form-fields">
          <div class="datepicker-field">
            <md-datepicker
              :class="validatedDateFormClass('startDate')"
              v-model="dateForm.startDate"
              :md-disabled-dates="disabledStartDates"
              :md-debounce="100"
              :md-model-type="String"
            >
              <label>From Date</label>
            </md-datepicker>
          </div>
          <div class="datepicker-field">
            <md-datepicker
              :class="validatedDateFormClass('endDate')"
              v-model="dateForm.endDate"
              :md-disabled-dates="disabledEndDates"
              :md-debounce="100"
              :md-model-type="String"
            >
              <label>To Date</label>
            </md-datepicker>
          </div>
        </div>
        <button type="submit" :disabled="$v.dateForm.$invalid">
          Search Volunteer Hours
        </button>
      </form>
    </section>
    <section class="volunteer-hours-list">
      <div v-if="volunteerHoursTableData">
        <SortableTable
          :tableColumns="volunteerHoursTableData.tableColumns"
          :tableData="volunteerHoursTableData.tableData"
          :defaultSort="volunteerHoursTableData.defaultSort"
          :defaultSortDir="volunteerHoursTableData.defaultSortDir"
          :allowEmpty="volunteerHoursTableData.allowEmpty"
          :queryColumn="volunteerHoursTableData.queryColumn"
        />
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped></style>
<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Component, Vue } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { required, minValue } from 'vuelidate/lib/validators';
import SortableTable from '@/components/SortableTable.vue';
import { VolunteerHours, Volunteer } from '@/store/types';

@Component({
  components: {
    SortableTable
  },
  mixins: [validationMixin],
  validations: {
    form: {
      selectedVolunteerId: { required },
      hoursRecorded: { required, minValue: minValue(0) },
      dateRecorded: { required }
    },
    dateForm: {
      startDate: {
        required,
        isBefore(date, dateForm) {
          return !(this.$moment(date) as any).isAfter(
            this.$moment(dateForm.endDate)
          );
        }
      },
      endDate: {
        required,
        isAfter(date, dateForm) {
          return !(this.$moment(date) as any).isBefore(
            this.$moment(dateForm.startDate)
          );
        }
      }
    }
  }
})
export default class VolunteerHoursView extends Vue {
  form = {
    selectedVolunteerId: null,
    hoursRecorded: null,
    dateRecorded: null
  };

  dateForm = {
    startDate: this.$moment()
      .startOf('month')
      .format('YYYY-MM-DD'),
    endDate: this.$moment()
      .endOf('month')
      .format('YYYY-MM-DD')
  };

  get volunteers(): Volunteer[] {
    return this.$store.state.volunteers;
  }

  get volunteerHours(): VolunteerHours[] {
    return this.$store.state.volunteerHours;
  }

  get volunteerHoursData() {
    return this.volunteerHours.map(volunteerHoursRecord => {
      const volunteer = this.volunteers.find(
        volunteer => volunteer.id === volunteerHoursRecord.volunteerId
      );
      return {
        volunteerName: `${volunteer?.firstName} ${volunteer?.lastName}`,
        hoursRecorded: volunteerHoursRecord.hoursRecorded,
        dateRecorded: volunteerHoursRecord.dateRecorded
      };
    });
  }
  get volunteerHoursTableData() {
    return {
      tableData: this.volunteerHoursData,
      tableColumns: [
        {
          header: 'Volunteer Name',
          itemProperty: 'volunteerName',
          sortable: true,
          width: '33%'
        },
        {
          header: 'Hours Recorded',
          itemProperty: 'hoursRecorded',
          sortable: true,
          width: '33%'
        },
        {
          header: 'Date Recorded',
          itemProperty: 'dateRecorded',
          sortable: true,
          width: '33%'
        }
      ],
      defaultSort: 'dateRecorded',
      defaultSortDir: 'desc',
      allowEmpty: true,
      queryColumn: 'volunteerName'
    };
  }

  mounted() {
    this.$store.dispatch('getVolunteers');
    this.$store.dispatch('getVolunteerHoursByDateRange', {
      ...this.dateForm
    });
  }

  validatedClass(fieldName: string): string {
    const field = this.$v.form[fieldName];
    if (field) {
      return field.$invalid && field.$dirty ? 'is-danger' : '';
    }
    return '';
  }

  validatedDateFormClass(fieldName: string): string {
    const field = this.$v.dateForm[fieldName];
    if (field) {
      return field.$invalid && field.$dirty ? 'is-danger' : '';
    }
    return '';
  }

  createVolunteerHours() {
    this.$v.form.$touch();
    if (!this.$v.form.$invalid) {
      this.$store.dispatch('createVolunteerHours', {
        volunteerId: this.form.selectedVolunteerId,
        hoursRecorded: this.form.hoursRecorded,
        dateRecorded: this.form.dateRecorded
      });
      this.$store.dispatch('getVolunteerHoursByDateRange', {
        ...this.dateForm
      });
      this.form.selectedVolunteerId = null;
      this.form.hoursRecorded = null;
      this.form.dateRecorded = null;
      this.$v.form.$reset();
    }
  }

  handleVolunteerCreateRoute(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    if (selectedOption.value === 'routeToVolunteerCreate') {
      this.$router.push('/volunteers/create');
    }
  }

  disabledStartDates(date: any) {
    return (this.$moment(date) as any).isAfter(
      this.$moment(this.dateForm.endDate)
    );
    // return false;
  }

  disabledEndDates(date: any) {
    return (this.$moment(date) as any).isBefore(
      this.$moment(this.dateForm.startDate)
    );
    // return false;
  }

  searchDateRange() {
    this.$v.dateForm.$touch();
    if (!this.$v.dateForm.$invalid) {
      this.$store.dispatch('getVolunteerHoursByDateRange', {
        ...this.dateForm
      });
    }
  }
}
</script>
