class OrderItem < ActiveRecord::Base
  attr_accessible :ammount, :food_id, :order_id, :price

  belongs_to :order

  def total_price
    price * ammount
  end
end
