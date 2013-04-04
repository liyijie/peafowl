require 'spec_helper'

describe "orders/edit" do
  before(:each) do
    @order = assign(:order, stub_model(Order,
      :user_id => 1,
      :total_price => "9.99"
    ))
  end

  it "renders the edit order form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", order_path(@order), "post" do
      assert_select "input#order_user_id[name=?]", "order[user_id]"
      assert_select "input#order_total_price[name=?]", "order[total_price]"
    end
  end
end
