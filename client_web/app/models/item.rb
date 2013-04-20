class Item < ActiveRecord::Base
  attr_accessible :name, :desc, :kind_id, :price

  has_many :attachments, :as => :attachmentable, :dependent => :destroy
  accepts_nested_attributes_for :attachments, :allow_destroy => true

  validates :name, :desc, :kind_id, :presence => true
  validates :price, :presence => true, :numericality => { :greater_than => 0 }

  belongs_to :kind
end
