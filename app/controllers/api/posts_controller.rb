# frozen_string_literal: true

require 'google/cloud/storage'

class Api::PostsController < ApplicationController
  before_action :logged_in?

  def index
    # get posts for Spotlight
    posts = Post.order('like_count DESC, created_at DESC').page(post_params[:page])
    posts.each do |post|
      post.is_liked = post.favorited_by?(current_user)
    end

    # get posts for curated section
    users_posts = Post.where(by: current_user.id, is_store?: false)
    recent_likes = current_user.all_favorited.last(20)
    tags = infer_tags(users_posts, recent_likes)
    curated_posts = Post.tagged_with(tags, any: true).first(20)

    render json: {
      spotlight: posts,
      curated: {
        posts: curated_posts,
        tags: tags
      }
    }, methods: :is_liked, status: :ok
  end

  def show
    post = Post.find(params[:id])
    render json: { data: post }, status: :ok
  end

  def create
    post = Post.new(post_params.except(:format, :image, :tag_list))
    post.by = current_user.id
    post.like_count = 0
    post.tag_list.add(post_params[:tag_list].split(','))

    storage = Google::Cloud::Storage.new(credentials: JSON.parse(ENV.fetch('GOOGLE_APPLICATION_CREDENTIALS')), project_id: ENV['GOOGLE_CLOUD_PROJECT_ID'])
    bucket  = storage.bucket ENV['GOOGLE_CLOUD_BUCKET_NAME']
    file_name = 'user_posts/' + Time.now.getutc.to_s + '.jpg'
    file = bucket.create_file post_params[:image].tempfile, file_name
    post.image = file.public_url

    if post.save
      render json: { post: post }, status: :ok
    elsif post.update_attribute(:is_store?, false)
      render json: { post: post }, status: :ok
    else
      file.delete
      render json: { errors: post.errors }, status: :unprocessable_entry
    end
  end

  def destroy
    post = Post.find(params[:id])
    post.destroy

    if post
      render json: { data: post }, status: :ok
    else
      render json: { errors: 'Could not delete' }, status: :unprocessable_entry
    end
  end

  def update
    post = Post.find(params[:id])
    if post.update_attributes(post_params)
      render json: { data: post }, status: :ok
    else
      render json: { errors: post.errors }, status: :unprocessable_entity
    end
  end

  def like
    post = Post.find(params[:id])
    begin
      if post.favorited_by?(current_user)
        current_user.unfavorite(post)
        post.update_attribute(:like_count, (post.like_count || 0) + 1)
      else
        current_user.favorite(post)
        post.update_attribute(:like_count, (post.like_count || 1) - 1)
      end
      render json: { post: post }, status: :ok
    rescue StandardError
      render json: { errors: post.errors }, status: :unprocessable_entity
    end
  end

  def tags
    tags = ActsAsTaggableOn::Tag.all
    render json: { tags: tags }, status: :ok
  end

  private

  def post_params
    params.permit(:title, :image, :type, :link, :like_count, :is_store?, :by, :tag_list, :format, :page)
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
