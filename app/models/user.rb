class User < ApplicationRecord
  has_secure_password

  # has_many :saved_events
  # has_many :favorite_artists
end
