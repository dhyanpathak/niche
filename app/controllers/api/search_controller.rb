# frozen_string_literal: true

class Api::SearchController < ApplicationController
  before_action :logged_in?

  # very crappy search to which I'll replace it with ElasticSearch once I figure it out
  def index
    @posts = Post.search(search_params[:search]) || []
    @users = User.search(search_params[:search]) || []
    @stores = Store.search(search_params[:search]) || []

    render json: { posts: @posts, users: @users, stores: @stores }, status: :ok
  end

  private

  def search_params
    params.permit(:search)
  end
end
