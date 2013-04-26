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
      this.active();
      this.save({"ammount": this.get("ammount") + 1});
      return this.get("ammount");
    },

    descreaseAmmount: function() {
      this.active();
      this.save({"ammount": this.get("ammount") - 1});
      return this.get("ammount");
    },

    active: function() {
      this.save({active: true});
    }
  });

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
      this.$el.toggleClass("error", this.model.get("active"));
      this.$el.attr("data-id", this.model.get("food_id"));
      $('.total-price', this.$el).text(this.model.totalPrice());
      return this;
    }
  });

  var OrderItemList = Backbone.Collection.extend({
    model: OrderItem,
    localStorage: new Backbone.LocalStorage("order-items"),

    totalPrice: function() {
      var totalPrice = 0;
      this.each(function(order) {
        totalPrice += order.totalPrice();
      });
      return totalPrice;
    },

    increaseOrder: function(order) {
      var activeOrderItem = this.activeItem(order.get("food_id"));
      if (activeOrderItem) {
        activeOrderItem.increaseAmmount();
      } else {
        this.create(order);
      }
    },

    descreaseOrder: function(order) {
      var activeOrderItem = this.activeItem();
      if (activeOrderItem && activeOrderItem.descreaseAmmount() <= 0) {
        activeOrderItem.destroy();
      }
    },

    checkout: function() {
      /*$.postJSON("/orders", this.toJSON(), function(response) {
        alert(response);
      }, 'json');*/
    },

    resetActiveItem: function() {
      this.each(function(orderItem) {
        orderItem.save({active: false});
      });
    },

    activeItem: function(foodId) {
      if (!foodId) {
        return this.findWhere({"active": true});
      } else {
        this.resetActiveItem();

        var orderItem = this.findWhere({"food_id": foodId});
        if (orderItem) {
          orderItem.active();
          return orderItem;
        }
      }
    },

    destroy: function() {
      while (orderItem = this.first()) {
        orderItem.destroy();
      }
    }
  });

  var orderItemList = new OrderItemList;


  var AppView = Backbone.View.extend({
    el: "#order-page", 

    events: {
      'click #checkout': 'checkout',
      "click tr.order": "activeOrderItem",
      // TODO magic
      //"click button.food": "orderFood",
      "click #plus-item": "increaseOrder",
      "click #minus-item": "descreaseOrder", 
      "click #delete-order": "deleteOrder", 
    },

    initialize: function() {
      this.listenTo(orderItemList, "add", this.addOrder);
      this.listenTo(orderItemList, "all", this.orderTotalPrice);

      this.orderTotalPriceText = $('#orderTotalPrice');

      $('.food').click(function() {
        $('.food').removeClass("btn-info");
        $this = $(this);
        $this.addClass("btn-info");

        var orderItem = new OrderItem({food_id: $this.attr("data-id"), title: $this.text(), price: $this.attr("data-price"), ammount: 1});
        orderItemList.increaseOrder(orderItem);
      });

      orderItemList.fetch();
    },

    render: function() {
      this.orderTotalPrice();
    },

    orderFood: function() {
        $('.food').removeClass("btn-info");
        $this = $(e.target);
        $this.addClass("btn-info");

        var orderItem = { food_id: $this.attr("data-id"), title: $this.text(), price: $this.attr("data-price"), ammount: 1 };
        orderItemList.increaseOrder(orderItem);
    },

    activeOrderItem: function(e) {
      var foodId = $(e.target).parent("tr.order").attr("data-id");
      orderItemList.activeItem(foodId);
      return false;
    },

    increaseOrder: function(e) {
      var activeItem = orderItemList.activeItem();
      if (activeItem) {
        orderItemList.increaseOrder(activeItem);
      }
    },

    descreaseOrder: function() {
      var activeItem = orderItemList.activeItem();
      if (activeItem) {
        orderItemList.descreaseOrder(activeItem);
      }
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

    deleteOrder: function() {
      orderItemList.destroy();
    }

  });

  var appView = new AppView;
});