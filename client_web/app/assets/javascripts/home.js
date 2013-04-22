$(function() {
  
  var OrderItem = Backbone.Model.extend({
    defaults: function() {
      return {
        ammount: 1,
        tag: "",
        active: true
      }
    },

    totalPrice: function() {
      return this.get("price") * this.get("ammount");
    },

    increaseAmmount: function() {
      this.save({"ammount": this.get("ammount") + 1, "active": true});
      return this.get("ammount");
    },

    descreaseAmmount: function() {
      this.save({"ammount": this.get("ammount") - 1, "active": true});
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
        this.create(order);
      }
    },

    descreaseOrder: function(order) {
      var existOrder = this.findOrder(order.foot_id);
      var ammount = existOrder.descreaseAmmount();

      if (ammount <= 0) {
        existOrder.destroy();
        this.first().set({active: true});
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
    },

    activeItem: function() {
      return this.where({active: true}).get(0);
    }
  });

  var orderItemList = new OrderItemList;

  var OrderItemView = Backbone.View.extend({
    tagName: "tr",
    className: "order",
    template: _.template($("#order-template").html()),

    events: function() {
    },

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.activeItem();
      this.showTotalPrice();
      return this;
    },

    activeItem: function() {
      $("#order-list tbody tr").removeClass("error");
      this.$el.toggleClass("error", this.model.get("active"));
    },

    showTotalPrice: function() {
      $('.total-price', this.$el).text(this.model.totalPrice());
    }
  });

  var AppView = Backbone.View.extend({

    events: {
      'click #checkout': 'checkout',
      "click tr.order": "activeOrderItem",
      // TODO magic
      "click button.foot": "orderFoot",
      "click #plus-item": "plusItem",
      "click #minus-item": "minusItem", 
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

    orderFoot: function() {
        $('.foot').removeClass("btn-info");
        $this = $(e.target);
        $this.addClass("btn-info");

        var orderItem = { foot_id: $this.attr("data-id"), title: $this.text(), price: $this.attr("data-price"), ammount: 1 };
        orderItemList.increaseOrder(orderItem);
    },

    plusItem: function() {
      orderItemList.activeItem().increaseOrder();
    },

    minusItem: function() {

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
    },
    
    activeOrderItem: function() {
      this.$el.addClass("error");
    }

  });

  var appView = new AppView;
});