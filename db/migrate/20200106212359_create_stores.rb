class CreateStores < ActiveRecord::Migration[5.1]
  def change
    create_table :stores do |t|
      t.string :title
      t.string :link
      t.integer :following_count
      t.string :avatar
      t.string :about

      t.timestamps
    end
  end
end
