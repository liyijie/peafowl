class Order < ActiveRecord::Base
  attr_accessible :total_price, :user_id

  has_many :order_items
  belongs_to :user_id
end
