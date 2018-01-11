class V1::SpotifyController < ApplicationController
  def authorize
    render json: {
      url: "https://accounts.spotify.com/authorize?client_id=#{ENV['SPOTIFY_CLIENT_ID']}&response_type=code&redirect_uri=http://localhost:3000/#/spotify-callback"
    }
  end

  def callback
    render json: {
      code: params[:code],
      error: params[:error],
      state: params[:state]
    }
  end

  def get_tokens
    response = Unirest.post(
      "https://accounts.spotify.com/api/token",
      parameters: {
        grant_type: "authorization_code",
        code: params[:code],
        redirect_uri: "http://localhost:3000/",
        client_id: ENV["SPOTIFY_CLIENT_ID"],
        client_secret: ENV["SPOTIFY_CLIENT_SECRET"]
      }
      )
    render json: response.body
  end

  def get_profile
    response = Unirest.get("http://api.spotify.com/v1/me",
      headers: {
        "Authorization" => "Bearer #{params[:access_token]}"
      }
    )
    render json: response.body
  end

  def run_search
    # search artist by name
    response = Unirest.get(
      "https://api.spotify.com/v1/search?q=#{params[:artist]}&type=artist",
      headers: {
        "Authorization" => "Bearer #{params[:access_token]}"
      }
    )
    # save artist id
    artists = response.body
    artist = artists["artists"]["items"].first
    artist_id = artist["id"]
    # render json: artist
    # search top tracks by artist_id
    response = Unirest.get(
      "https://api.spotify.com/v1/artists/#{artist_id}/top-tracks?country=US",
      headers: {
        "Authorization" => "Bearer #{params[:access_token]}"
      }
    )
    artist_tracks = response.body["tracks"]
    # Get an array of top 5 tracks
    top_tracks = artist_tracks.map { |track| track.values_at("name", "preview_url")}.first(5).to_h
    render json: top_tracks
  end

end
