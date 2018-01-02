class CreateVenues < ActiveRecord::Migration[5.1]
  def change
    create_table :venues do |t|
      t.string :venue_name
      t.decimal :venue_lat, :precision => 7, :scale => 5
      t.decimal :venue_lng, :precision => 7, :scale => 5
      t.text :venue_description

      t.timestamps
    end
  end
end
