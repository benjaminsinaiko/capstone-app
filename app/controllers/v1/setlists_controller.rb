class V1::SetlistsController < ApplicationController
  def artists
    artist = params['id']
    repsonse = Unirest.get("https://api.setlist.fm/rest/1.0/search/setlists?artistName=#{artist}",
        headers:{ "Accept" => "application/json", "x-api-key" => "#{ENV['SETLIST_FM_API_KEY']}"})
    setlists = repsonse.body
    render json: setlists.as_json
  end

  def event
    date = params['setDate']
    artist = params['setArtist']
    venue = params['setVenue']

    repsonse = Unirest.get("https://api.setlist.fm/rest/1.0/search/setlists?date=#{date}&artistName=#{artist}&venue=#{venue}",
        headers:{ "Accept" => "application/json", "x-api-key" => "#{ENV['SETLIST_FM_API_KEY']}"})

    setlist = repsonse.body["setlist"][0]
    # setlist = repsonse.body
    render json: setlist.as_json
  end

end
