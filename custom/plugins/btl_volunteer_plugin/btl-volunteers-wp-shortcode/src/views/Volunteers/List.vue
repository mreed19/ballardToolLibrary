<template>
  <div>
    <h1>Volunteers</h1>
    <section class="volunteers-list">
      <div v-if="volunteersTableData">
        <SortableTable
          :tableColumns="volunteersTableData.tableColumns"
          :tableData="volunteersTableData.tableData"
          :defaultSort="volunteersTableData.defaultSort"
          :defaultSortDir="volunteersTableData.defaultSortDir"
          :allowEmpty="volunteersTableData.allowEmpty"
          :queryColumn="volunteersTableData.queryColumn"
        >
          <template #additionalActions>
            <router-link to="/volunteers/create" tag="button">
              Create a new Volunteer
            </router-link>
          </template>
        </SortableTable>
      </div>
    </section>
  </div>
</template>
<style lang="scss" scoped></style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SortableTable from '@/components/SortableTable.vue';
import { Volunteer } from '@/store/types';

@Component({
  components: { SortableTable }
})
export default class VolunteerList extends Vue {
  get volunteersTableData() {
    return {
      tableData: (this.$store.state.volunteers as Volunteer[]).map(
        ({ firstName, lastName, emailAddress }) => ({
          firstName,
          lastName,
          emailAddress
        })
      ),
      tableColumns: [
        {
          header: 'First Name',
          itemProperty: 'firstName',
          sortable: true,
          width: '33%'
        },
        {
          header: 'Last Name',
          itemProperty: 'lastName',
          sortable: true,
          width: '33%'
        },
        {
          header: 'Email Address',
          itemProperty: 'emailAddress',
          sortable: true,
          width: '33%'
        }
      ],
      defaultSort: 'firstName',
      defaultSortDir: 'asc',
      allowEmpty: true,
      queryColumn: 'firstName'
    };
  }

  mounted() {
    this.$store.dispatch('getVolunteers');
  }
}
</script>
