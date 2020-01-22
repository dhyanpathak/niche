# frozen_string_literal: true

class Store < ApplicationRecord
  acts_as_favoritable

  validates :title, :link, presence: true
  validates :link, uniqueness: true
  has_many :posts

  def self.search(keyword)
    where(['LOWER(title) LIKE ?', "%#{keyword.downcase}%"]) if keyword
  end
end
