class V1::SgEventsController < ApplicationController
  def events # Events By Venue
    response = Unirest.get("https://api.seatgeek.com/2/events?client_id=#{ENV['SG_CLIENT_ID']}&per_page=100&venue.id=#{params}")
    venue_events = response.body
    render json: venue_events.as_json
  end

  def show
    event_id = params['id']
    response = Unirest.get("https://api.seatgeek.com/2/events?client_id=#{ENV['SG_CLIENT_ID']}&per_page=100&venue.id=#{event_id}&type=concert")
    venue_events = response.body
    render json: venue_events.as_json
  end

  def performers
    response = Unirest.get("https://api.seatgeek.com/2/performers?client_id=#{ENV['SG_CLIENT_ID']}&id=#{params[:performer_id]}")
    performer_info = response.body
    render json: performer_info.as_json
  end

  def venues
    params = "999,3320,981,9520,7801,54901,11700,1365,74432,515,403,1520,557,1029,622,3660,2088,60271,5501,372,136"
    response = Unirest.get("https://api.seatgeek.com/2/venues?client_id=#{ENV['SG_CLIENT_ID']}&per_page=200&id=#{params}")
    venue_events = response.body
    render json: venue_events.as_json
  end
end
