class CreateSavedEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :saved_events do |t|
      t.integer :user_id
      t.integer :aritst_id
      t.integer :venue_id
      t.integer :event_id
      t.date :event_date

      t.timestamps
    end
  end
end
