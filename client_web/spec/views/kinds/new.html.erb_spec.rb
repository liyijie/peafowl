require 'spec_helper'

describe "kinds/new" do
  before(:each) do
    assign(:kind, stub_model(Kind,
      :name => "MyString"
    ).as_new_record)
  end

  it "renders new kind form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", kinds_path, "post" do
      assert_select "input#kind_name[name=?]", "kind[name]"
    end
  end
end
