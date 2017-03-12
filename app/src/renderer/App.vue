<template>
  <div id="#app">
    <landing-page></landing-page>
  </div>
</template>

<script>
  import LandingPage from 'components/LandingPageView'
  export default {
    components: {
      LandingPage
    }
  }
</script>

<style>
body {
  margin: 0;
  min-height: 100vh;
  background: #222;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>
