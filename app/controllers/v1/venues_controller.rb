class V1::VenuesController < ApplicationController

  def index
    venues = Venue.all.order(:venue_name => :asc)
    render json: venues.as_json
  end
end
