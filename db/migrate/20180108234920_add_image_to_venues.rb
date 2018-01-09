class AddImageToVenues < ActiveRecord::Migration[5.1]
  def change
    add_column :venues, :avatar, :string
  end
end
