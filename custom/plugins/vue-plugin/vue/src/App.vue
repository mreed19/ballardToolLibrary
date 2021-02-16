<template>
  <div id="app">
    <header>
      <h1>
        Vue.js SPA
      </h1>
    </header>
    <main>
      <aside class="sidebar">
        <router-link to="/">
          Home
        </router-link>
        <router-link to="/volunteers">
          Volunteers
        </router-link>
      </aside>
      <div class="content">
        <router-view></router-view>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: 'App'
};
</script>
