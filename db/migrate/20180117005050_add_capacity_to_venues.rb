class AddCapacityToVenues < ActiveRecord::Migration[5.1]
  def change
    add_column :venues, :capacity, :integer
    add_column :venues, :ages, :string
  end
end
