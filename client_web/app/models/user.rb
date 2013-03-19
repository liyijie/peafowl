class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :trackable, :validatable, :authentication_keys => [:username]

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :username, :admin, :nickname
  # attr_accessible :title, :body

  validate :username, :uniqueness => true, :length => { :maximum => 32 }
  validate :nickname, :presence => true, :length => { :maximum => 32 }

  def is_admin?
    admin
  end

  def delete
    update_attribute(:enbale => false)
  end

  def email_required?
    false
  end

end
