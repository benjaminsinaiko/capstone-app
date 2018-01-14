class V1::SavedEventsController < ApplicationController

  def index
    saved_events = SavedEvent.all
    render json: saved_events.as_json
  end

  def create
    saved_event = SavedEvent.new(
      event_name: params["event_name"],
      venue_name: params["venue_name"],
      venue_id: params["venue_id"],
      event_date: params["event_date"],
      user_id: params["user_id"]
    )
    saved_event.save
    render json: saved_event.as_json
  end

end
