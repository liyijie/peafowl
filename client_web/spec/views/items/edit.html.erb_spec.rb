require 'spec_helper'

describe "items/edit" do
  before(:each) do
    @item = assign(:item, stub_model(Item,
      :name => "MyString",
      :price => "9.99",
      :desc => "MyText",
      :kind_id => 1
    ))
  end

  it "renders the edit item form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", item_path(@item), "post" do
      assert_select "input#item_name[name=?]", "item[name]"
      assert_select "input#item_price[name=?]", "item[price]"
      assert_select "textarea#item_desc[name=?]", "item[desc]"
      assert_select "input#item_kind_id[name=?]", "item[kind_id]"
    end
  end
end
