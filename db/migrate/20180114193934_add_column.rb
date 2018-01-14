class AddColumn < ActiveRecord::Migration[5.1]
  def change
    add_column :saved_events, :event_name, :string
    add_column :saved_events, :venue_name, :string
  end
end
