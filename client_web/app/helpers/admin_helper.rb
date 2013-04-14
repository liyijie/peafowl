module AdminHelper
  def active_class(name)
    if controller.controller_name == name
      return "btn-info"
    end
    return ""
  end

  def role_desc(user)
    if user
      return "管理员" if user.is_admin?

      "收银员"
    end
  end
end
