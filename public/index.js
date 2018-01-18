/* global Vue, VueRouter, axios, google, moment */

// HOME PAGE....................................................
var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Venue List/Home Page",
      venues: [],
      venueFilter: ""
    };
  },
  created: function() {
    // Spotify Tokens
    var spotifyCode = window.location.href.split("?")[1]
      ? window.location.href.split("?")[1].split("code=")[1]
      : null;
    if (spotifyCode) {
      spotifyCode = spotifyCode.split("#")[0];
      console.log("spotifyCode", spotifyCode);
      let url = "http://localhost:3000/v1/spotify/tokens?code=" + spotifyCode;
      console.log("url: ", url);

      axios.get(url).then(response => {
        let token = response.data;
        let accessToken = response.data.access_token;
        let refreshToken = response.data.refresh_token;
        localStorage.setItem("spotifyToken", response.data.access_token);
        localStorage.setItem("spotifyRefresh", response.data.refresh_token);
        console.log("return token: ", token);
        console.log("access token: ", accessToken);
        console.log("refresh token: ", refreshToken);
        router.push("/profile");
      });
    }
  },
  mounted: function() {
    axios.get("/v1/venues").then(response => {
      this.venues = response.data;
      // console.log("venues1: ", this.venues);

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
      console.log("venues: ", this.venues);

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
    isValidVenue: function(inputVenue) {
      // return inputVenue.venue_name.includes(this.venueFilter);
      return inputVenue.venue_name
        .toLowerCase()
        .includes(this.venueFilter.toLowerCase());
    }
  },
  computed: {}
};

// VENUES EVENT PAGE.....................................................
var VenuesEventPage = {
  template: "#venues-event-page",
  data: function() {
    return {
      message: "Venues Event Page",
      venueName: "",
      venueAddress: "",
      events: [],
      capacity: "",
      ages: ""
    };
  },
  created: function() {
    this.capacity = this.$route.query.cap;
    this.ages = this.$route.query.ages;

    axios.get("v1/seatgeek/events/" + this.$route.params.id).then(
      function(response) {
        var eventsData = response.data.events;
        this.events = eventsData;
        this.venueName = eventsData[0].venue.name;
        this.venueAddress = eventsData[0].venue.address;
        console.log("Events: ", this.events);
        console.log("capacity: ", this.capacity);
        console.log("ages: ", this.ages);

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
          icon: pinSymbol("orange"),
          animation: google.maps.Animation.BOUNCE
        });
      }.bind(this)
    );
  },
  fitlers: {},
  methods: {
    dateDay: function(event) {
      let datetime = event.datetime_local;
      let day = moment(datetime).format("D");
      return day;
    },
    dateMonth: function(event) {
      let datetime = event.datetime_local;
      let month = moment(datetime).format("MMM");
      return month;
    },
    dateTime: function(event) {
      let datetime = event.datetime_local;
      let time = moment(datetime).format("LT");
      return time;
    },
    saveEvent: function(event) {
      let params = {
        event_name: event.title,
        artist_name: event.performers[0].name,
        venue_name: event.venue.name,
        venue_id: event.venue.id,
        event_date: event.datetime_local,
        user_id: 1
      };
      axios.post("v1/saved-events", params).then(function(response) {
        // Do something after saving
        console.log(params);
      });
    }
  },
  computed: {
    eventsCount: function() {
      return this.events.length;
    }
  }
};

// ARTIST INFO PAGE................................................
var ArtistInfoPage = {
  template: "#artist-info-page",
  data: function() {
    return {
      message: "Artist Info Page",
      setlists: [],
      artistName: "",
      currentSetlist: {},
      currentURL: [],
      artistInfo: [],
      artistImage: {},
      artistPlaylist: ""
    };
  },
  mounted: function() {
    // Get setlist
    axios.get("/v1/setlists/" + this.$route.params.id).then(response => {
      this.setlists = response.data.setlist;
      this.artistName = this.setlists[0].artist.name;
      // console.log("setlists: ", this.setlists);
      // console.log("Artist: ", this.artistName);
    });

    // Get Spotify token from localStorage
    let token = localStorage.getItem("spotifyToken");
    console.log("spotifyToken is:", token);
    let searchUrl =
      "/v1/spotify/search?artist=" +
      this.$route.params.id +
      "&access_token=" +
      token;
    // console.log("searchURL: ", searchUrl);

    // Search Artist on Spotify
    axios.get(searchUrl).then(response => {
      let searchResults = response.data;
      // Artist Info
      this.artistInfo = response.data[0];
      this.artistImage = this.artistInfo.images[0].url;
      console.log("Artist Info: ", this.artistInfo);
      let artistURI = this.artistInfo.uri;
      console.log("Artist URI: ", artistURI);
      this.artistPlaylist =
        "https://open.spotify.com/embed?theme=white&uri=" + artistURI;
      console.log("Artist playlist: ", this.artistPlaylist);
    });
  },

  methods: {
    setCurrentSetlist: function(inputSetlist) {
      this.currentSetlist = inputSetlist;
      // console.log("current: ", this.currentSetlist);
      let setlistId = this.currentSetlist.id;
      // console.log("id: ", setlistId);
      this.currentURL =
        "https://www.setlist.fm/widgets/setlist-image-v1?font=1&size=large&fg=ffffff&border=ffa500&bg=878787&id=" +
        setlistId;
      // console.log("url:", this.currentURL);
    }
  },
  computed: {}
};

// ARTIST SEARCH PAGE................................................
var ArtistSearchPage = {
  template: "#artist-search-page",
  data: function() {
    return {
      message: "Artist Search Page",
      artistInfo: [],
      artistName: ""
    };
  },
  mounted: function() {},
  methods: {},
  computed: {}
};

// PROFILE PAGE................................................
var ProfilePage = {
  template: "#profile-page",
  data: function() {
    return {
      message: "Profile Page",
      savedEvents: [],
      pastEvents: [],
      futureEvents: [],
      visits: [],
      display: "none"
    };
  },
  mounted: function() {
    axios.get("/v1/saved-events").then(response => {
      this.savedEvents = response.data;
      console.log("Saved Events: ", this.savedEvents);
      // CREATE TODAYS DATE
      var a = new Date();
      var m = a.getMonth();
      var d = a.getDate();
      var y = a.getFullYear();
      var date = new Date(y, m, d);
      // SORTY EVENTS BY PAST / PRESENT
      for (var i = 0; i < this.savedEvents.length; i++) {
        var dateString = this.savedEvents[i].event_date.replace(/\-/g, "");
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var eventDate = new Date(year, month - 1, day);

        if (eventDate < date) {
          this.pastEvents.push(this.savedEvents[i]);
        } else {
          this.futureEvents.push(this.savedEvents[i]);
        }
      }
      // UNIQUE VENUE VISITS
      let venues = this.pastEvents.map(event => event.venue_name);
      this.visits = [...new Set(venues)];
      // console.log("Visits: ", this.visits);

      console.log("Past Events: ", this.pastEvents);
      console.log("Future Events: ", this.futureEvents);
    });
  },
  methods: {
    changeDisplay: function() {
      if (this.display === "none") {
        this.display = "inline";
      } else {
        this.display = "none";
      }
    }
  },
  computed: {
    attendedCount: function() {
      return this.pastEvents.length;
    },
    visitedCount: function() {
      return this.visits.length;
    }
  }
};

// SIGNUP PAGE..................................................................
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

// LOGIN PAGE..........................................................
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

// SPOTIFY AUTH PAGE......................................................
var SpotifyAuthPage = {
  template: "#spotify-auth-page",
  data: function() {
    return {
      message: "Connect to Spotify!"
    };
  },
  mounted: function() {},
  methods: {
    spotifyConnect: function() {
      axios.get("v1/spotify/authorize").then(function(response) {
        let authUrl = response.data;
        console.log(authUrl);
        window.location = authUrl.url;
      });
    }
  },
  computed: {}
};

var SpotifyCallbackPage = {
  template: "#spotify-callback-page",
  data: function() {
    return {
      message: "",
      profileData: {},
      displayName: ""
    };
  },
  mounted: function() {
    let token = localStorage.getItem("spotifyToken");
    console.log("spotifyToken is:", token);
    let url = "http://localhost:3000/v1/spotify/profile?access_token=" + token;
    axios.get(url).then(function(response) {
      this.profileData = response.data;
      this.displayName = response.data.display_name;
      console.log("profileData: ", this.profileData);
    });
  },
  methods: {},
  computed: {}
};

// ROUTER...............................................
var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/venues/:id", component: VenuesEventPage },
    { path: "/artists", component: ArtistSearchPage },
    { path: "/artists/:id", component: ArtistInfoPage },
    { path: "/profile", component: ProfilePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/spotify-auth", component: SpotifyAuthPage },
    { path: "/spotify-callback", component: SpotifyCallbackPage }
  ]
});

// VUE..................................................
var app = new Vue({
  el: "#app",
  router: router,
  data: function() {
    return {
      artistInput: ""
    };
  },
  created: function() {
    var spotifyToken = localStorage.getItem("spotifyToken");
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  },
  methods: {
    submit: function() {
      // code
      // let artistSlug = inputArtist.toLowerCase();
      // console.log(this.artistInput);
      let artistSlug = this.artistInput.replace(/\s+/g, "-").toLowerCase();
      console.log(artistSlug);
      router.push("/artists/" + artistSlug);
    }
  }
});
