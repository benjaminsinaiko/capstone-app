require 'unirest'
require 'pp'

system "clear"
puts "Choose an option:"
# puts "[1] Search SG events"
puts "[2] Search SG performers"
puts "[3] Search SG venues"
puts
# puts "[q] Quit"
puts
print "Choose a search: "
input_option = gets.chomp

if input_option == "1" # search events
  print "Enter a SG id: "
  event_id = gets.chomp
  response = Unirest.get("http://localhost:3000/v1/seatgeek/events?event_id=#{event_id}")
elsif input_option == "2" # artist search, ex: Walk The Moom 14998
  print "Enter SG artist id: "
  performer_id = gets.chomp
  response = Unirest.get("http://localhost:3000/v1/seatgeek/performers?performer_id=#{performer_id}")
  pp response.body
elsif input_option == "3" # venue search, ex: Aragon 999
  print "Enter a SG venue id: "
  venue_id = gets.chomp
  response = Unirest.get("http://localhost:3000/v1/seatgeek/venues?venue_id=#{venue_id}")
  pp response.body
end