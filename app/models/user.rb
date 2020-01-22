# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  validates :username, :email, presence: true, uniqueness: true
  validates_format_of :username, with: /\A[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){1,18}[a-zA-Z0-9]\z/
  validates_format_of :email, with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i

  acts_as_favoritable
  acts_as_favoritor

  def self.search(keyword)
    where(['LOWER(username) LIKE ?', "%#{keyword.downcase}%"]) if keyword
  end
end
