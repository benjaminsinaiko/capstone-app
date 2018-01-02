class V1::ParseEventsController < ApplicationController
  def venues
    repsonse = Unirest.get('https://parseapi.back4app.com/classes/Venues?where={"testVenue":false}',
        headers:{ "X-Parse-Application-Id" => "#{ENV['APP_ID']}", "X-Parse-REST-API-Key" => "#{ENV['API_KEY']}"})
    venues = repsonse.body
    render json: venues.as_json
  end

end