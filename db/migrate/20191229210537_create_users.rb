class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :username
      t.string :email
      t.string :password_digest
      t.string :full_name
      t.integer :following_count
      t.integer :followers_count
      t.string :about
      t.string :avatar

      t.timestamps
    end
  end
end
