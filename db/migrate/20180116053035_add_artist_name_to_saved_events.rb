class AddArtistNameToSavedEvents < ActiveRecord::Migration[5.1]
  def change
    add_column :saved_events, :artist_name, :string
  end
end
