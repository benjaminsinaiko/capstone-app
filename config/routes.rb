Rails.application.routes.draw do
  namespace :v1 do
    post 'user_token' => 'user_token#create'
    post '/users' => 'users#create'

    get '/venues' => 'venues#index'

    get '/seatgeek/events' => 'sg_events#events'
    get '/seatgeek/events/:id' => 'sg_events#show'
    get '/seatgeek/performers' => 'sg_events#performers'
    get '/seatgeek/venues' => 'sg_events#venues'

    get '/parse/venues' => 'parse_events#venues'

  end
end
