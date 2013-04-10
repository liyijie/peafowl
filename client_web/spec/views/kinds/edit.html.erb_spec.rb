require 'spec_helper'

describe "kinds/edit" do
  before(:each) do
    @kind = assign(:kind, stub_model(Kind,
      :name => "MyString"
    ))
  end

  it "renders the edit kind form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", kind_path(@kind), "post" do
      assert_select "input#kind_name[name=?]", "kind[name]"
    end
  end
end
