class V1::SpotifyController < ApplicationController
  def authorize
    render json: {
      url: "https://accounts.spotify.com/authorize?client_id=#{ENV['SPOTIFY_CLIENT_ID']}&response_type=code&redirect_uri=http://localhost:3000/v1/callback"
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
        redirect_uri: "http://localhost:3000/v1/callback",
        client_id: ENV["SPOTIFY_CLIENT_ID"],
        client_secret: ENV["SPOTIFY_CLIENT_SECRET"]
      }
      )
    render json: response.body
  end

end
