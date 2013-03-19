module Admin::UsersHelper
  def role_desc(user)
    if user
      return "管理员" if user.is_admin?

      "收银员"
    end
  end
end
