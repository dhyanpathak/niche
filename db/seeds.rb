User.delete_all
Store.delete_all
Post.delete_all

users = [
    {email: 'user1@test.com', password: 'supersafepassword', password_confirmation: 'supersafepassword', username: 'RudyVintage', about: 'sucker for 70s style' }
    {email: 'user2@test.com', password: 'supersafepassword2', password_confirmation: 'supersafepassword2', username: 'KingKrule', about: 'Hey World!' }
]
users.each { |user| User.create user }