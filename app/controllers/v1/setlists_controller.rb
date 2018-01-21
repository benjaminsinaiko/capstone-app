class V1::SetlistsController < ApplicationController
  def artists
    artist = params['id']
    repsonse = Unirest.get("https://api.setlist.fm/rest/1.0/search/setlists?artistName=#{artist}",
        headers:{ "Accept" => "application/json", "x-api-key" => "#{ENV['SETLIST_FM_API_KEY']}"})
    setlists = repsonse.body
    render json: setlists.as_json
  end

  def event
    artist = "big thief"
    date = "2017-01-11"
    venue = "schubas tavern"

    # repsonse = Unirest.get("https://api.setlist.fm/rest/1.0/search/setlists?date=#{date}&artistName=#{artist}",
    #     headers:{ "Accept" => "application/json", "x-api-key" => "#{ENV['SETLIST_FM_API_KEY']}"})
    repsonse = Unirest.get("https://api.setlist.fm/rest/1.0/search/setlists?date=01-11-2017&artistName=big-thief",
        headers:{ "Accept" => "application/json", "x-api-key" => "#{ENV['SETLIST_FM_API_KEY']}"})
    setlist = repsonse.body["setlist"][0]["id"]
    render json: setlist.as_json
  end

end


# "v1/seatgeek/events/" + this.$route.params.id