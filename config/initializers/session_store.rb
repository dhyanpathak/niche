# frozen_string_literal: true

if Rails.env === 'production'
  Rails.application.config.session_store :cookie_store, key: ENV['SECRET_KEY_BASE'], domain: 'niche-staging.herokuapp.com'
else
  Rails.application.config.session_store :cookie_store, key: ENV['SECRET_KEY_BASE']
end
