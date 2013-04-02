class CreateItems < ActiveRecord::Migration
  def change
    create_table :items do |t|
      t.string :name
      t.decimal :price
      t.text :desc
      t.integer :kind_id

      t.timestamps
    end
  end
end
