<template>
  <div>
    <h1>Create Volunteer</h1>
    <section class="volunteer-form">
      <form class="form" novalidate @submit.prevent="createVolunteer">
        <div class="form-fields">
          <div class="form-field">
            <label for="firstName" class="label">
              First Name
              <input
                type="text"
                :class="`input ${validatedClass('firstName')}`"
                name="firstName"
                v-model="form.firstName"
              />
            </label>
          </div>
          <div class="form-field">
            <label for="lastName" class="label">
              Last Name
              <input
                type="text"
                :class="`input ${validatedClass('lastName')}`"
                name="lastName"
                v-model="form.lastName"
              />
            </label>
          </div>
          <div class="form-field">
            <label for="emailAddress" class="label">
              Email Address
              <input
                type="email"
                :class="`input ${validatedClass('emailAddress')}`"
                name="emailAddress"
                v-model="form.emailAddress"
              />
            </label>
          </div>
        </div>
        <button type="submit" :disabled="$v.$invalid">Create Volunteer</button>
      </form>
    </section>
  </div>
</template>
<style lang="scss" scoped></style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { validationMixin } from 'vuelidate';
import { required, email } from 'vuelidate/lib/validators';
import { Volunteer } from '@/store/types';

@Component({
  mixins: [validationMixin],
  validations: {
    form: {
      firstName: { required },
      lastName: { required },
      emailAddress: {
        required,
        email,
        uniqueEmail: function(emailAddress: string) {
          if ((this as CreateVolunteer).volunteers) {
            const matches = ((this as CreateVolunteer)
              .volunteers as Volunteer[]).filter(
              volunteer =>
                volunteer.emailAddress?.toLowerCase() ===
                emailAddress.toLowerCase()
            );
            return matches.length === 0;
          }
          return true;
        }
      }
    }
  }
})
export default class CreateVolunteer extends Vue {
  form = {
    firstName: null,
    lastName: null,
    emailAddress: null
  };

  get volunteers(): Volunteer[] {
    return this.$store.state.volunteers;
  }

  mounted() {
    this.$store.dispatch('getVolunteers');
  }

  validatedClass(fieldName: string) {
    const field = this.$v.form[fieldName];

    return field?.$invalid && field.$dirty ? 'is-danger' : '';
  }

  createVolunteer() {
    this.$v.$touch();
    if (!this.$v.$invalid) {
      this.$store.dispatch('createVolunteer', this.form);
      this.$router.push('/volunteers');
    }
  }
}
</script>
