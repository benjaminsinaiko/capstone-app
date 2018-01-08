/* global Vue, VueRouter, axios, moment, google, Elevator */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Venue List",
      venues: [],
      venueFilter: "",
      sortAttribute: "venueName"
    };
  },
  created: function() {},
  mounted: function() {
    axios.get("/v1/parse/venues").then(
      function(response) {
        this.venues = response.data.results;
        // console.log(this.venues);

        ////// MAP ////////
        var map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: 41.892229, lng: -87.634799 },
          zoom: 12
        });

        console.log("venues: ", this.venues);

        for (var i = 0; i < this.venues.length; i++) {
          var coords = this.venues[i].Coordinates;
          var latLng = new google.maps.LatLng(
            coords.longitude,
            coords.latitude
          );
          let venueName = this.venues[i].venueName;
          let description = this.venues[i].venueDescription;
          // console.log(description);
          var infowindow = new google.maps.InfoWindow({
            title: venueName,
            content: description
          });
          var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            info: description
          });
          this.venues[i].marker = marker;

          google.maps.event.addListener(marker, "click", function() {
            infowindow.setContent(description);
            infowindow.open(map, this);
          });
        }
      }.bind(this)
    );
  },
  ///// Methods //////
  methods: {
    isValidVenue: function(inputVenue) {
      return inputVenue.venueName
        .toLowerCase()
        .includes(this.venueFilter.toLowerCase());
    },
    changeSortAttribute: function(inputAttribute) {
      this.sortAttribute = inputAttribute;
    }
  },
  computed: {
    sortedVenues: function() {
      return this.venues.slice().sort(
        function(venue1, venue2) {
          return venue1[this.sortAttribute] - venue2[this.sortAttribute];
        }.bind(this)
      );
    }
  }
};

///////// Venues Event Page //////////

var VenuesEventPage = {
  template: "#venues-event-page",
  data: function() {
    return {
      message: "Venues Event Page",
      venueName: "",
      events: []
    };
  },
  created: function() {
    axios.get("v1/seatgeek/events/" + this.$route.params.id).then(
      function(response) {
        var eventsData = response.data.events;
        this.events = eventsData;
        this.venueName = eventsData[0].venue.name;
        console.log(this.events);
      }.bind(this)
    );
  },
  methods: {},
  computed: {
    formattedDate: function() {
      var datetime = this.events.datetime_local;
      var dateFormatted = moment(datetime).format("dddd, MMM Do YYYY");
      return dateFormatted;
    }
  }
};

// var EventsPage = {
//   template: "#events-page",
//   data: function() {
//     return {
//       message: "Events Page",
//       events: [],
//       performers: [],
//       venueName: ""
//     };
//   },
//   created: function() {
//     axios.get("http://localhost:3000/v1/seatgeek/events").then(
//       function(response) {
//         this.events = response.data.events;
//         this.venueName = response.data.events[0].venue.name;
//         console.log(this.events);
//       }.bind(this)
//     );
//   },
//   methods: {},
//   computed: {}
// };

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/venues/:id", component: VenuesEventPage }
    // { path: "/events", component: EventsPage }
  ]
});

var app = new Vue({
  el: "#app",
  router: router
});
// Vue.config.devtools = true;
