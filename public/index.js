/* global Vue, VueRouter, axios, google, moment */

// HOME PAGE....................................................
var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Venue List/Home Page",
      venues: [],
      venueFilter: "",
      position: {}
    };
  },
  created: function() {
    // SPOTIFY TOKENS
    var spotifyCode = window.location.href.split("?")[1]
      ? window.location.href.split("?")[1].split("code=")[1]
      : null;
    if (spotifyCode) {
      spotifyCode = spotifyCode.split("#")[0];
      console.log("spotifyCode", spotifyCode);
      let url = "http://localhost:3000/v1/spotify/tokens?code=" + spotifyCode;

      axios.get(url).then(response => {
        let token = response.data;
        let accessToken = response.data.access_token;
        let refreshToken = response.data.refresh_token;
        localStorage.setItem("spotifyToken", response.data.access_token);
        localStorage.setItem("spotifyRefresh", response.data.refresh_token);
        console.log("access token: ", accessToken);
        console.log("refresh token: ", refreshToken);
        router.push("/#/");
      });
    }
  },
  mounted: function() {
    // GET VENUE DATA
    axios.get("/v1/venues").then(response => {
      this.venues = response.data;

      /////// MAP ///////
      var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 41.892376, lng: -87.634808 },
        zoom: 13,
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

      // GOOGLE MAP MARKERS
      // MARKER COLOR
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
      // CREATE MARKERS
      for (var i = 0; i < this.venues.length; i++) {
        var coords = this.venues[i];
        var latLng = new google.maps.LatLng(coords.venue_lat, coords.venue_lng);
        let venueName = this.venues[i].venue_name;
        let avatar = this.venues[i].avatar;
        let venueUrl =
          "/#/venues/" +
          this.venues[i].venue_sg_id +
          "?cap=" +
          this.venues[i].capacity +
          "&ages=" +
          this.venues[i].ages;

        var infowindow = new google.maps.InfoWindow({
          maxWidth: 225
        });
        var marker = new google.maps.Marker({
          position: latLng,
          map: map,
          info: venueName,
          icon: pinSymbol("orange")
        });
        this.venues[i].marker = marker;

        // GOOGLE MAPS LISTENERS
        google.maps.event.addListener(marker, "click", function() {
          // map.panTo(marker.getPosition());
          infowindow.setContent(
            '<img class="map-avatar" style="width: 40%; height: 40%; float: left; margin-right: 5px;" src="' +
              avatar +
              '" />' +
              '<div id="content"><h5 style="text-align: center;">' +
              venueName +
              "</h5></div><br>" +
              '<p style="text-align: center;"><a href=' +
              venueUrl +
              ">See Shows</a></p>"
          );
          infowindow.open(map, this);
        });
      }
      var markerLocation = new google.maps.Marker({
        position: { lat: 41.892376, lng: -87.634808 },
        map: map,
        // animation: google.maps.Animation.BOUNCE,
        icon: pinSymbol("red")
      });
    });
  },
  methods: {
    isValidVenue: function(inputVenue) {
      return inputVenue.venue_name
        .toLowerCase()
        .includes(this.venueFilter.toLowerCase());
    }
  },
  computed: {}
};

// VENUES PAGE....................................................
var VenuesPage = {
  template: "#venues-page",
  data: function() {
    return {
      message: "Venue List/Home Page",
      venues: [],
      venueFilter: ""
    };
  },
  created: function() {
    //SCROLLS TO TOP WHEN VIEW IS DISPLAYED
    window.scrollTo(0, 0);
  },
  mounted: function() {
    axios.get("/v1/venues").then(response => {
      this.venues = response.data;
      console.log("venues: ", this.venues);
    });
  },
  methods: {
    isValidVenue: function(inputVenue) {
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
      events: {},
      capacity: "",
      ages: "",
      savedEventTitles: []
    };
  },
  created: function() {
    //SCROLLS TO TOP WHEN VIEW IS DISPLAYED
    window.scrollTo(0, 0);

    this.capacity = this.$route.query.cap;
    this.ages = this.$route.query.ages;

    axios.get("v1/seatgeek/events/" + this.$route.params.id).then(
      function(response) {
        let eventsData = response.data.events;
        eventsData.forEach(function(eventData) {
          eventData.favorited = false;
        });
        this.events = eventsData;
        this.venueName = eventsData[0].venue.name;
        this.venueAddress = eventsData[0].venue.address;
        console.log("Events: ", this.events);

        axios.get("v1//saved-events").then(function(response) {
          let savedEvents = response.data;
          this.savedEventTitles = savedEvents.map(event => event.event_name);

          eventsData.forEach(
            function(eventData) {
              if (this.savedEventTitles.indexOf(eventData.title) > -1) {
                eventData.favorited = true;
              }
            }.bind(this)
          );
        });

        // SET MAP
        let coords = this.events[0].venue.location;
        let myLatLng = { lat: coords.lat, lng: coords.lon };
        let latLng = new google.maps.LatLng(coords.lat, coords.lon);

        var map = new google.maps.Map(document.getElementById("map-venue"), {
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
    },
    refresh: function() {
      location.reload();
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
      artistInfo: {},
      upcomingEvent: {},
      similarArtists: [],
      artistImage: {},
      artistPlaylist: ""
    };
  },
  created: function() {
    //SCROLLS TO TOP WHEN VIEW IS DISPLAYED
    window.scrollTo(0, 0);
  },
  mounted: function() {
    let upcomingArtist = this.$route.params.id;
    // GET SETLIST
    axios.get("/v1/setlists/artist/" + upcomingArtist).then(response => {
      this.setlists = response.data.setlist.slice(0, 10);

      this.artistName = this.setlists[0].artist.name;
      // FORMAT DATE
      for (let i = 0; i < this.setlists.length; i++) {
        this.setlists[i].dateFormat = moment(
          this.setlists[i].eventDate,
          "DD-MM-YYYY"
        ).format("MMM Do, YYYY");
      }
      console.log("setlists: ", this.setlists);
    });

    // GET SPOTIFY TOKEN FROM LOCALSTORAGE
    let token = localStorage.getItem("spotifyToken");
    let searchUrl =
      "/v1/spotify/search?artist=" +
      this.$route.params.id +
      "&access_token=" +
      token;

    // GET UPCOMING SHOW
    axios
      .get("/v1/seatgeek/upcoming?artist=" + upcomingArtist)
      .then(response => {
        this.upcomingEvent = response.data;
        console.log("upcoming", this.upcomingEvent);
        let dateDay = this.upcomingEvent[0].datetime_local;
        this.upcomingEvent.day = moment(dateDay).format("D");
        let dateMonth = this.upcomingEvent[0].datetime_local;
        this.upcomingEvent.month = moment(dateMonth).format("MMM");
      });

    // SEARCH ARTIST ON SPOTIFY
    axios.get(searchUrl).then(response => {
      let searchResults = response.data;
      // ARTIST INFO
      this.artistInfo = response.data[0];
      this.artistImage = this.artistInfo.images[0].url;
      let artistURI = this.artistInfo.uri;
      this.artistPlaylist =
        "https://open.spotify.com/embed?theme=white&uri=" + artistURI;

      // GET RELATED ARTISTS
      let relatedUrl =
        "/v1/spotify/related?artistId=" +
        this.artistInfo.id +
        "&access_token=" +
        token;
      axios.get(relatedUrl).then(response => {
        this.similarArtists = response.data;
        for (let i = 0; i < this.similarArtists.length; i++) {
          Vue.set(
            this.similarArtists[i],
            "artistSlug",
            this.similarArtists[i].name
              .split(" ")
              .join("-")
              .toLowerCase()
          );
        }
      });
    });

    // LAST FM INFO
    let artistSlug = this.$route.params.id.replace(/\-/g, " ");
    axios.get("/v1/lastfm/" + artistSlug).then(response => {
      let lastFm = response.data;
      Vue.set(this.artistInfo, "bio", lastFm.artist.bio.summary.split("<")[0]);
      Vue.set(this.artistInfo, "lastImage", lastFm.artist.image[2]["#text"]);
    });
  },

  methods: {
    setCurrentSetlist: function(inputSetlist) {
      this.currentSetlist = inputSetlist;
      let setlistId = this.currentSetlist.id;
      this.currentURL =
        "https://www.setlist.fm/widgets/setlist-image-v1?font=1&size=large&fg=ffffff&border=ffa500&bg=878787&id=" +
        setlistId;
    },
    refresh: function() {
      location.reload();
      //SCROLLS TO TOP WHEN VIEW IS DISPLAYED
      window.scrollTo(0, 0);
    }
  },
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
      show: false,
      currentPastEvent: [],
      currentSetlist: [],
      futureDate: ""
    };
  },
  created: function() {
    //SCROLLS TO TOP WHEN VIEW IS DISPLAYED
    window.scrollTo(0, 0);
  },
  mounted: function() {
    axios.get("/v1/saved-events").then(response => {
      this.savedEvents = response.data.sort(function(a, b) {
        return new Date(a.event_date) - new Date(b.event_date);
      });
      console.log("Saved Events: ", this.savedEvents);

      // CREATE TODAYS DATE
      var a = new Date();
      var m = a.getMonth();
      var d = a.getDate();
      var y = a.getFullYear();
      var date = new Date(y, m, d);
      // SORT EVENTS BY PAST / PRESENT
      for (let j = 0; j < this.savedEvents.length; j++) {
        var dateString = this.savedEvents[j].event_date.replace(/\-/g, "");
        var year = dateString.substring(0, 4);
        var month = dateString.substring(4, 6);
        var day = dateString.substring(6, 8);
        var eventDate = new Date(year, month - 1, day);

        if (eventDate < date) {
          this.pastEvents.unshift(this.savedEvents[j]);
        } else {
          this.futureEvents.push(this.savedEvents[j]);
        }

        // LAST FM IMAGES / SET DATE FORMAT
        for (let i = 0; i < this.futureEvents.length; i++) {
          let artistSearch = this.futureEvents[i].artist_name.toLowerCase();
          axios.get("/v1/lastfm/" + artistSearch).then(response => {
            let artistInfo = response.data;
            Vue.set(
              this.futureEvents[i],
              "image",
              artistInfo.artist.image[2]["#text"]
            );
            Vue.set(
              this.futureEvents[i],
              "artistSlug",
              artistInfo.artist.name
                .split(" ")
                .join("-")
                .toLowerCase()
            );
          });
          this.futureEvents[i].dateFormat = moment(
            this.futureEvents[i].event_date
          ).format("MMM Do, YYYY");
        }
      }
      // UNIQUE VENUE VISITS
      let venues = this.pastEvents.map(event => event.venue_name);
      this.visits = [...new Set(venues)];

      // SET CURRENT PAST EVENT
      this.currentPastEvent = this.pastEvents[0];

      // GET SETILIST FOR PAST SHOW
      this.getSetlist();
    });
  },
  methods: {
    getSetlist: function() {
      // GET SETILIST FOR PAST SHOW
      let setDate = moment(this.currentPastEvent.event_date).format(
        "DD-MM-YYYY"
      );
      let setArtist = this.currentPastEvent.artist_name
        .split(" ")
        .join("-")
        .toLowerCase();
      let setVenue = this.currentPastEvent.venue_name
        .split(" ")
        .join("-")
        .toLowerCase();
      let params = { setDate, setArtist, setVenue };

      axios.get("/v1/setlists/event/", { params }).then(response => {
        let setId = response.data.id;
        this.currentSetlist =
          "https://www.setlist.fm/widgets/setlist-image-v1?font=1&size=large&fg=ffffff&border=ffa500&bg=878787&id=" +
          setId;
      });
    },
    setCurrentPastEvent: function(pastEvent) {
      this.currentPastEvent = pastEvent;
      this.getSetlist();
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
    });
  },
  methods: {},
  computed: {}
};

// ROUTER...............................................
var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/venues/", component: VenuesPage },
    { path: "/venues/:id", component: VenuesEventPage },
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
    // ARTIST SEARCH IN NAVBAR
    submit: function() {
      let artistSlug = this.artistInput.replace(/\s+/g, "-").toLowerCase();
      router.push("/artists/" + artistSlug);
      location.reload();
    }
  }
});
