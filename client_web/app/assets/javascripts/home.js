$(function() {
  
  var OrderItem = Backbone.Model.extend({
    defaults: function() {
      return {
        ammount: 1,
        tag: ""
      }
    },

    totalPrice: function() {
      return this.get("price") * this.get("ammount");
    },

    increaseAmmount: function() {
      this.save({"ammount": this.get("ammount") + 1});
      return this.get("ammount");
    },

    descreaseAmmount: function() {
      this.save({"ammount": this.get("ammount") - 1});
      return this.get("ammount");
    }
  });

  var OrderItemList = Backbone.Collection.extend({
    model: OrderItem,
    //url: "/orders",
    localStorage: new Backbone.LocalStorage("order-items"),

    totalPrice: function() {
      var totalPrice = 0;
      this.each(function(order) {
        totalPrice += order.totalPrice();
      });
      return totalPrice;
    },

    increaseOrder: function(order) {
      var existOrder = this.findOrder(order.foot_id);
      if (existOrder) {
        existOrder.increaseAmmount();
      } else {
        this.add(order);
      }
    },

    descreaseOrder: function(order) {
      var existOrder = this.findOrder(order.foot_id);
      var ammount = existOrder.descreaseAmmount();

      if (ammount <= 0) {
        existOrder.destroy();
      }
    },

    findOrder: function(foot_id) {
      return this.find(function(order) {
        return order.get("foot_id") == foot_id;
      });
    },

    checkout: function() {
      $.postJSON("/orders", this.toJSON(), function(response) {
        alert(response);
      }, 'json');
    }
  });

  var orderItemList = new OrderItemList;

  var OrderItemView = Backbone.View.extend({
    tagName: "tr",
    template: _.template($("#order-template").html()),

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);
    },

    render: function() {
      $("#order-list tbody tr").removeClass("error");
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.addClass("order error");
      $('.total-price', this.$el).text(this.model.totalPrice());
      return this;
    }
  });

  var AppView = Backbone.View.extend({

    events: {
      'click #checkout': 'checkout'
    },

    initialize: function() {
      this.listenTo(orderItemList, "add", this.addOrder);
      this.listenTo(orderItemList, "all", this.orderTotalPrice);

      this.orderTotalPriceText = $('#orderTotalPrice');

      $('.foot').click(function() {
        $('.foot').removeClass("btn-info");
        $this = $(this);
        $this.addClass("btn-info");

        var orderItem = { foot_id: $this.attr("data-id"), title: $this.text(), price: $this.attr("data-price"), ammount: 1 };
        orderItemList.increaseOrder(orderItem);
      });


    },

    render: function() {
      this.orderTotalPrice();
    },

    addOrder: function(orderItem) {
      var orderItemView = new OrderItemView({model: orderItem});
      $("#order-list tbody").prepend(orderItemView.render().el);
    },

    orderTotalPrice: function() {
      this.orderTotalPriceText.text(orderItemList.totalPrice());
    },

    checkout: function() {
      orderItemList.checkout();
    }

  });

  var appView = new AppView;
});