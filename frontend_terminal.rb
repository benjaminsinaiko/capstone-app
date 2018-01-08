# require 'unirest'
# require 'pp'

# system "clear"
# puts "Choose an option:"
# # puts "[1] Search SG events"
# puts "[2] Search SG performers"
# puts "[3] Search SG venues"
# puts
# # puts "[q] Quit"
# puts
# print "Choose a search: "
# input_option = gets.chomp

# if input_option == "1" # search events
#   print "Enter a SG id: "
#   event_id = gets.chomp
#   response = Unirest.get("http://localhost:3000/v1/seatgeek/events?event_id=#{event_id}")
# elsif input_option == "2" # artist search, ex: Walk The Moom 14998
#   print "Enter SG artist id: "
#   performer_id = gets.chomp
#   response = Unirest.get("http://localhost:3000/v1/seatgeek/performers?performer_id=#{performer_id}")
#   pp response.body
# elsif input_option == "3" # venue search, ex: Aragon 999
#   print "Enter a SG venue id: "
#   venue_id = gets.chomp
#   response = Unirest.get("http://localhost:3000/v1/seatgeek/venues?venue_id=#{venue_id}")
#   pp response.body
# end

require 'unirest'
require 'pp'

spotify_access_token = ""

while true
  system "clear"
  puts "Welcome! Choose an option:"
  puts "[1] Connect to Spotify"
  puts "[2] Show my Spotify info"
  puts "[3] Search artist songs"
  puts
  puts "[q] Quit"
  input_option = gets.chomp

  if input_option == "1"
    response = Unirest.get("http://localhost:3000/v1/spotify/authorize")
    pp response.body["url"]
    system "open '#{response.body["url"]}'"
    puts "In your browser, click accept, then enter the code: "
    code = gets.chomp
    response = Unirest.get("http://localhost:3000/v1/spotify/tokens?code=#{code}")
    pp response.body
    spotify_access_token = response.body["access_token"]
  elsif input_option == "2"
    response = Unirest.get("http://localhost:3000/v1/spotify/profile?access_token=#{spotify_access_token}")
    pp response.body
  elsif input_option == "3"
    print "Enter an Artist Name: "
    input_artist = gets.chomp.gsub(" ", "%20")
    response = Unirest.get("http://localhost:3000/v1/spotify/search?artist=#{input_artist}&access_token=#{spotify_access_token}")
    pp response.body
  elsif input_option == "q"
    break
  end
  puts "Press enter to continue"
  gets.chomp
end