class Attachment < ActiveRecord::Base
  attr_accessible :attachment, :attachmentable_id, :attachmentable_type, :content_type, :file_name, :file_size
  attr_accessible :attachmentable
  
  mount_uploader :attachment, AttachmentUploader
  
  belongs_to :attachmentable, :polymorphic => true
  
  validates :attachment, :presence => true
  
  before_save :save_attachment_attributes
  
  protected
  def save_attachment_attributes
    self.content_type = attachment.file.content_type
    self.file_name = attachment.file.original_filename
    self.file_size = attachment.file.size
  end 
  
end
