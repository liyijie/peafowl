class Item < ActiveRecord::Base
  attr_accessible :desc, :kind_id, :name, :price

  has_many :attachments, :as => :attachmentable, :dependent => :destroy

  belongs_to :kind
end
