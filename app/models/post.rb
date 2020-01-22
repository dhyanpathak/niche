# frozen_string_literal: true

class Post < ApplicationRecord
  attr_accessor :is_liked

  acts_as_taggable_on :tags
  acts_as_favoritable

  validates :title, :image, :is_store?,
            :by, presence: true

  def self.search(keyword)
    where(['LOWER(title) LIKE ?', "%#{keyword.downcase}%"]) if keyword
  end
end
