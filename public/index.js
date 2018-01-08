/* global Vue, VueRouter, axios, google, moment */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Venue List/Home Page",
      venues: [],
      venueFilter: ""
    };
  },
  created: function() {},
  mounted: function() {
    axios.get("/v1/venues").then(response => {
      this.venues = response.data;
      console.log("venues1: ", this.venues);

      /////// MAP ///////
      var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.896634, lng: -87.647681 },
        zoom: 12,
        styles: [
          {
            featureType: "administrative",
            elementType: "all",
            stylers: [{ saturation: "-100" }]
          },
          {
            featureType: "administrative.province",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "landscape",
            elementType: "all",
            stylers: [
              { saturation: -100 },
              { lightness: 65 },
              { visibility: "on" }
            ]
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [
              { saturation: -100 },
              { lightness: "50" },
              { visibility: "simplified" }
            ]
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ saturation: "-100" }]
          },
          {
            featureType: "road.highway",
            elementType: "all",
            stylers: [{ visibility: "simplified" }]
          },
          {
            featureType: "road.arterial",
            elementType: "all",
            stylers: [{ lightness: "30" }]
          },
          {
            featureType: "road.local",
            elementType: "all",
            stylers: [{ lightness: "40" }]
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ saturation: -100 }, { visibility: "simplified" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [
              { hue: "#ffff00" },
              { lightness: -25 },
              { saturation: -97 }
            ]
          },
          {
            featureType: "water",
            elementType: "labels",
            stylers: [{ lightness: -25 }, { saturation: -100 }]
          }
        ]
      });
      console.log("venues2: ", this.venues);

      // Google Map Marker Color
      function pinSymbol(color) {
        return {
          path:
            "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0",
          fillColor: color,
          fillOpacity: 1,
          strokeColor: "#000",
          strokeWeight: 2,
          scale: 1
        };
      }

      for (var i = 0; i < this.venues.length; i++) {
        var coords = this.venues[i];
        var latLng = new google.maps.LatLng(coords.venue_lat, coords.venue_lng);
        // let venueName = this.venues[i].venue_name;
        let description = this.venues[i].venue_name;
        // console.log(description);
        var infowindow = new google.maps.InfoWindow({
          content: description
        });

        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          info: description,
          icon: pinSymbol("orange")
        });
        this.venues[i].marker = marker;

        google.maps.event.addListener(marker, "click", function() {
          infowindow.setContent(description);
          infowindow.open(map, this);
        });
      }
    });
  },
  methods: {
    isValidVenue: inputVenue => {
      return inputVenue.venue_name
        .toLowerCase()
        .includes(this.venueFilter.toLowerCase());
    }
  },
  computed: {}
};

// VENUES EVENT PAGE
var VenuesEventPage = {
  template: "#venues-event-page",
  data: function() {
    return {
      message: "Venues Event Page",
      venueName: "",
      venueAddress: "",
      events: []
    };
  },
  created: function() {
    axios.get("v1/seatgeek/events/" + this.$route.params.id).then(
      function(response) {
        var eventsData = response.data.events;
        this.events = eventsData;
        this.venueName = eventsData[0].venue.name;
        this.venueAddress = eventsData[0].venue.address;
        console.log(this.events);

        let coords = this.events[0].venue.location;
        let myLatLng = { lat: coords.lat, lng: coords.lon };
        let latLng = new google.maps.LatLng(coords.lat, coords.lon);

        var map = new google.maps.Map(document.getElementById("map"), {
          center: myLatLng,
          zoom: 15,
          styles: [
            {
              featureType: "administrative",
              elementType: "all",
              stylers: [{ saturation: "-100" }]
            },
            {
              featureType: "administrative.province",
              elementType: "all",
              stylers: [{ visibility: "off" }]
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [
                { saturation: -100 },
                { lightness: 65 },
                { visibility: "on" }
              ]
            },
            {
              featureType: "poi",
              elementType: "all",
              stylers: [
                { saturation: -100 },
                { lightness: "50" },
                { visibility: "simplified" }
              ]
            },
            {
              featureType: "road",
              elementType: "all",
              stylers: [{ saturation: "-100" }]
            },
            {
              featureType: "road.highway",
              elementType: "all",
              stylers: [{ visibility: "simplified" }]
            },
            {
              featureType: "road.arterial",
              elementType: "all",
              stylers: [{ lightness: "30" }]
            },
            {
              featureType: "road.local",
              elementType: "all",
              stylers: [{ lightness: "40" }]
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ saturation: -100 }, { visibility: "simplified" }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [
                { hue: "#ffff00" },
                { lightness: -25 },
                { saturation: -97 }
              ]
            },
            {
              featureType: "water",
              elementType: "labels",
              stylers: [{ lightness: -25 }, { saturation: -100 }]
            }
          ]
        });

        function pinSymbol(color) {
          return {
            path:
              "M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0",
            fillColor: color,
            fillOpacity: 1,
            strokeColor: "#000",
            strokeWeight: 2,
            scale: 1
          };
        }
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          icon: pinSymbol("orange")
        });
      }.bind(this)
    );
  },
  fitlers: {
    // dateDay: function(datetime_local) {
    //   return moment(datetime_local).format("D");
    // }
  },
  methods: {},
  computed: {
    eventsCount: function() {
      return this.events.length;
    },
    // Datetime Example 2018-03-24T03:30:00
    dateDay: function() {
      let datetime = this.events[0].datetime_local;
      let day = moment(datetime).format("D");
      return day;
    },
    dateMonth: function() {
      let datetime = this.events[0].datetime_local;
      let month = moment(datetime).format("MMM");
      return month;
    },
    dateTime: function() {
      let datetime = this.events[0].datetime_local;
      let time = moment(datetime).format("LT");
      return time;
    }
  }
};

// Signup Page
var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/v1/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

// Login Page
var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var SpotifyAuthPage = {
  template: "#spotify-auth-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      code: ""
    };
  },
  mounted: function() {},
  methods: {
    spotifyConnect: function() {
      axios.get("v1/spotify/authorize").then(function(response) {
        let authUrl = response.data;
        console.log(authUrl);
        window.open(
          authUrl.url,
          "popUpWindow",
          "height=650,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes"
        );
      });
    }
  },
  computed: {}
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/venues/:id", component: VenuesEventPage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/spotify-auth", component: SpotifyAuthPage }
  ]
});

var app = new Vue({
  el: "#app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});
