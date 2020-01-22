# frozen_string_literal: true

class Api::UsersController < ApplicationController
  def index
    @users = User.all
    if @users
      render json: {
        users: @users
      }
    else
      render json: {
        status: 500,
        errors: ['no users found']
      }
    end
  end

  def show
    @user = User.find(params[:id])
    posts = Post.where(by: params[:id], is_store?: false)
    recent_likes = @user.all_favorited.last(20)
    tags = infer_tags(posts, recent_likes)

    if @user
      render json: {
        user: @user,
        posts: posts,
        tags: tags
      }
    else
      render json: {
        status: 500,
        errors: ['user not found']
      }
    end
  end

  def create
    @user = User.new(user_params)
    if @user.save
      login!
      render json: {
        status: 'created',
        user: @user
      }
    else
      render json: {
        status: 500,
        errors: @user.errors.full_messages
      }
    end
  end

  def likes
    favs = current_user.all_favorited
    render json: { likes: favs }, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end

  def infer_tags(user_posts, liked_posts)
    freq_hash = {}
    freq_tags = []
    posts = user_posts + liked_posts
    posts.each do |post|
      post.tag_list.each do |tag|
        freq_hash[tag] = 0 if freq_hash[tag].nil?
        freq_hash[tag] = freq_hash[tag] + 1
      end
    end
    # sort hash by ascending values
    # take last (highest) 5 and add its key to freq_tags
    freq_hash.sort { |a, b| a[1] <=> b[1] }.last(5).each { |t| freq_tags << t[0] }
    freq_tags
  end
end
