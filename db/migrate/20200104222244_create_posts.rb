class CreatePosts < ActiveRecord::Migration[5.1]
  def change
    create_table :posts do |t|
      t.string :title
      t.string :image
      t.string :type
      t.string :link
      t.integer :like_count
      t.boolean :is_store?
      t.integer :by

      t.timestamps
    end
  end
end
