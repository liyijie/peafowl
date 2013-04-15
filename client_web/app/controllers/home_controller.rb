class HomeController < ApplicationController
  def index
    if current_user.is_admin?
      redirect_to admin_items_path
    end
  end
end
