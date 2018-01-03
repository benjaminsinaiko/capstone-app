/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Venue List/Home Page",
      venues: []
    };
  },
  mounted: function() {
    axios.get("/v1/parse/venues").then(function(response) {
      this.venues = response.data.results;
      console.log("venues: ", this.venues);
    });
  },
  methods: {},
  computed: {}
};

var router = new VueRouter({
  routes: [{ path: "/", component: HomePage }]
});

var app = new Vue({
  el: "#app",
  router: router
});
