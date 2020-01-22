# frozen_string_literal: true

class SessionsController < ApplicationController
  def create
    @user = User
            .find_by(username: session_params[:username])
            .try(:authenticate, session_params[:password])
    if @user
      login!
      render json: {
        logged_in: true,
        user: @user
      }
    else
      render json: {
        status: 401,
        errors: 'Invalid credentials. Try again.'
      }
    end
  end

  def is_logged_in?
    if logged_in? && current_user
      posts = Post.where(by: current_user.id, is_store?: false)
      render json: {
        logged_in: true,
        user: current_user,
        user_posts: posts
      }
    else
      render json: {
        logged_in: false,
        message: 'User does not exist'
      }
    end
  end

  def destroy
    logout!
    render json: {
      status: 200,
      logged_out: true
    }
  end

  private

  def session_params
    params.require(:user).permit(:username, :email, :password)
  end
end
