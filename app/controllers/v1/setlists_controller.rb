class V1::SetlistsController < ApplicationController
  def artists
    artist = params['id']
    repsonse = Unirest.get("https://api.setlist.fm/rest/1.0/search/setlists?bon-iver",
        headers:{ "Accept" => "application/json", "x-api-key" => "#{ENV['SETLIST_FM_API_KEY']}"})
  end

end
