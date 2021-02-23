<template>
  <div v-if="tableData.length || allowEmpty">
    <div class="actions">
      <div v-if="queryColumn" class="search-form">
        <label for="search-query">
          Search:
          <input
            type="text"
            name="search-query"
            :placeholder="`Search by ${queryColumn}...`"
            v-model="searchQuery"
          />
        </label>
      </div>
      <slot
        name="additionalActions"
        v-bind:filteredTableDate="filteredTableData"
      ></slot>
    </div>
    <table>
      <thead>
        <tr>
          <th
            v-for="(tableColumn, index) in tableColumns"
            :width="tableColumn.width"
            :key="index"
          >
            <span
              v-if="tableColumn.sortable"
              :name="tableColumn.itemProperty"
              class="clickable"
              :class="getArrowClass(tableColumn.itemProperty)"
              @click="sort(tableColumn.itemProperty)"
            >
              {{ tableColumn.header }}
            </span>
            <span v-else>{{ tableColumn.header }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <slot name="tableBody" v-bind:filteredTableData="filteredTableData">
          <!-- default if no tableBody template provided -->
          <tr v-for="(row, index) in filteredTableData" :key="index">
            <td v-for="(value, index) in row" :key="index">{{ value }}</td>
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
  <div v-else class="empty-status">
    <h2>There is no data to display.</h2>
    <p>Refresh the page to check again.</p>
  </div>
</template>
<style lang="scss" scoped>
.actions {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.empty-status {
  width: 500px;
  margin: 0 auto;
  border-radius: 5px;
  padding: 0.5rem;
  border: 1px solid lightblue;
}

.empty-status h2 {
  text-align: center;
}

.empty-status p {
  line-height: 1;
  padding: 0.5rem 0;
}

.search-form > label {
  display: flex;
  flex-direction: column;
  padding-bottom: 5px;
}

@media (min-width: 765px) {
  .search-form {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}

th .clickable:hover {
  user-select: none;
  cursor: pointer;
  color: navy;
  text-decoration: underline;
}

table {
  overflow-y: scroll;
  max-height: 600px;
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
}

thead th {
  text-align: center;
  position: sticky;
  top: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 7px;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
}

.headerSortDown,
.headerSortUp {
  font-weight: bold;
  text-decoration: underline;
  padding-right: 10px;
}

.headerSortDown:after,
.headerSortUp:after {
  content: ' ';
  position: relative;
  left: 5px;
  border: 8px solid transparent;
}

.headerSortDown:after {
  top: 15px;
  border-top-color: white;
}

.headerSortUp:after {
  bottom: 15px;
  border-bottom-color: white;
}

tr:nth-child(even) td {
  background-color: #f9f9f9;
}

thead {
  background: gray;
  color: white;
  border: none;
}
</style>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class SortableTable extends Vue {
  @Prop({ type: Array, required: true }) readonly tableColumns!: Array<
    Record<string, {}>
  >;
  @Prop({ type: Array, required: true }) readonly tableData!: Array<
    Record<string, {}>
  >;
  @Prop({ type: String }) readonly queryColumn: string;
  @Prop({ type: String }) readonly defaultSort: string;
  @Prop({ type: String }) readonly defaultSortDir: string;
  @Prop({ type: Boolean }) readonly allowEmpty: boolean;

  sortColumn: string = this.defaultSort;
  sortDir: string = this.defaultSortDir;
  searchQuery = '';

  get filteredTableData() {
    let filteredTableData = [...this.tableData].sort((a, b) => {
      const modifier = this.sortDir == 'asc' ? 1 : -1;

      if (typeof a[this.sortColumn] === 'string') {
        return (
          modifier *
          String(a[this.sortColumn]).localeCompare(String(b[this.sortColumn]))
        );
      }

      if (a[this.sortColumn] < b[this.sortColumn]) return -1 * modifier;
      if (a[this.sortColumn] > b[this.sortColumn]) return 1 * modifier;
      return 0;
    });

    if (this.queryColumn) {
      filteredTableData = filteredTableData.filter(tableData => {
        return String(tableData[this.queryColumn])
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
      });
    }
    return filteredTableData;
  }

  sort(columnName: string) {
    if (columnName === this.sortColumn) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDir = 'asc';
    }
    this.sortColumn = columnName;
  }

  getArrowClass(columnName: string) {
    if (columnName === this.sortColumn) {
      return this.sortDir === 'asc' ? 'headerSortUp' : 'headerSortDown';
    }
    return '';
  }
}
</script>
