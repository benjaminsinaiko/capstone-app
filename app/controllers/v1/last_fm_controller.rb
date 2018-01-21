class V1::LastFmController < ApplicationController
  def artist
    artist = params['id']
    response = Unirest.get("http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=#{ENV['LAST_FM_API_KEY']}&format=json&artist=#{artist}")
    artist_info = response.body
    render json: artist_info.as_json
  end

end
