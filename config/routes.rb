Rails.application.routes.draw do
  post '/user_token' => 'user_token#create' 

  namespace :v1 do
    post '/users' => 'users#create'

    get '/saved-events' => 'saved_events#index'
    post '/saved-events' => 'saved_events#create'

    get '/venues' => 'venues#index'

    get '/seatgeek/events' => 'sg_events#events'
    get '/seatgeek/events/:id' => 'sg_events#show'
    get '/seatgeek/performers' => 'sg_events#performers'
    get '/seatgeek/venues' => 'sg_events#venues'

    get '/parse/venues' => 'parse_events#venues'

    get "/spotify/authorize" => "spotify#authorize"
    get "/callback" => "spotify#callback"
    get "/spotify/tokens" => "spotify#get_tokens"
    get "/spotify/profile" => "spotify#get_profile"
    get "/spotify/search" => "spotify#run_search"

    get '/setlists/:id' => 'setlists#artists'
    get '/setlists/event/:id' => 'setlists#event'

    get '/lastfm/:id' => 'last_fm#artist'
  end
end
