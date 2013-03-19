class AddUsernameAndAdminToUser < ActiveRecord::Migration
  def change
    add_column :users, :username, :string, :null => false, :default => "", :limit => 32
    add_column :users, :nickname, :string, :null => false, :default => "", :limit => 32
    add_column :users, :admin, :boolean, :default => false
  end
end
