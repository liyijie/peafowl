class CreateOrderItems < ActiveRecord::Migration
  def change
    create_table :order_items do |t|
      t.integer :order_id
      t.decimal :price
      t.integer :ammount
      t.integer :food_id

      t.timestamps
    end
  end
end
