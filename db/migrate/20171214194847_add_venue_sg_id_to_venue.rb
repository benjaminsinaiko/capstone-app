class AddVenueSgIdToVenue < ActiveRecord::Migration[5.1]
  def change
    add_column :venues, :venue_sg_id, :integer
  end
end
