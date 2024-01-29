<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

button {
  padding: 8px 12px;
  margin: 10px;
  font-size: 16px;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}
</style>
