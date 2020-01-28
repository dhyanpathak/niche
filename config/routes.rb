# frozen_string_literal: true

Rails.application.routes.draw do
  get '/api/search', to: 'api/search#index'

  root 'landing#index'

  get '/app', to: 'landing#index'

  # auth
  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'

  # get tags
  get '/api/posts/tags', to: 'api/posts#tags'

  namespace :api, defaults: { format: :json } do
    resources :posts, only: %i[index create show destroy update] do
      member do
        get 'like'
      end
    end
    resources :users, only: %i[create show index update] do
      member do
        get 'likes'
      end
    end
    resources :stores, only: %i[index show create update]
  end
end
