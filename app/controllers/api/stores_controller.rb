# frozen_string_literal: true

require 'uri'
require 'net/http'

class Api::StoresController < ApplicationController
  before_action :logged_in?

  def index
    stores = Store.order('created_at DESC')
    render json: { data: stores }, status: :ok
  end

  def show
    store = Store.find(params[:id])
    posts = Post.where(by: params[:id])
    tags = posts[0].tag_list
    render json: { store: store, posts: posts, tags: tags }, status: :ok
  end

  def create
    resp = fetch_store
    if resp.key?('errors')
      render json: { errors: resp[:errors] }, status: :unprocessable_entry
    else
      begin
        store = Store.new(resp.except(:products))
        if store.save
          products = generate_posts(store.id, resp[:products])
          render json: { store: store, products: products }, status: :ok
        else
          render json: { errors: store.errors.full_messages }, status: :unprocessable_entry
        end
      rescue StandardError => e
        render json: { errors: e }, status: :unprocessable_entry
      end
    end
  end

  def destroy
    store = Store.find(params[:id])
    store.destroy

    if store
      render json: { data: store }, status: :ok
    else
      render json: { errors: 'Could not delete' }, status: :unprocessable_entry
    end
  end

  def update
    store = Store.find(params[:id])
    if store.update_attributes(store_params)
      render json: { data: store }, status: :ok
    else
      render json: { errors: store.errors }, status: :unprocessable_entity
    end
  end

  private

  def store_params
    params.permit(:title, :link, :avatar, :about, :format, :tag_list)
  end

  def generate_posts(store_id, products)
    posts = []

    products.each do |product|
      post = Post.new(
        title: product['title'],
        image: product['images'].first['src'],
        link: store_params[:link] + '/products/' + product['handle'],
        is_store?: true,
        by: store_id
      )
      post.tag_list.add(store_params[:tag_list].split(','))
      post.save
      posts << post
    end
    posts
  end

  def fetch_store
    link = store_params[:link] + '/products.json'
    uri_text = link
    uri = URI(uri_text)
    https = Net::HTTP.new(uri.host, 443)
    https.use_ssl = true
    req = Net::HTTP::Get.new(uri.path)
    req['Content-Type'] = 'application/json'
    req['User-Agent'] = 'test'
    req['Cache-Control'] = 'no-cache'

    resp = https.request(req)
    if resp.code != '200'
      { code: resp.code, error: "Couldn't create store. Try to run again." }
    elsif !JSON.parse(resp.read_body).key?('products')
      { code: resp.code, error: 'Insufficient data to create store.' }
    else
      json_resp = JSON.parse(resp.read_body)
      {
        title: json_resp.fetch('products').first.fetch('vendor'),
        link: store_params[:link],
        products: json_resp.fetch('products')
      }
    end
  end
end
