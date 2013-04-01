$(function() {
  
  var Order = Backbone.Model.extend({
    defaults: function() {
      return {
        ammount: 1,
        tag: "少盐、多糖",
        totalPrice: 20.0
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

  var OrderList = Backbone.Collection.extend({
    model: Order,

    totalPrice: function() {
      var totalPrice = 0;
      this.each(function(order) {
        totalPrice += order.totalPrice();
      });
      return totalPrice;
    },

    increaseOrder: function(order) {
      var existOrder = this.findOrder(order.id);
      if (existOrder) {
        existOrder.increaseAmmount();
      } else {
        this.add(order);
      }
    },

    descreaseOrder: function(order) {
      var existOrder = this.findOrder(order.id);
      var ammount = existOrder.descreaseAmmount();

      if (ammount <= 0) {
        existOrder.destroy();
      }
    },

    findOrder: function(foot_id) {
      this.each(function(order) {
        if(order.foot_id == foot_id) {
          return order;
        } 
      });
    }
  });

  var orderList = new OrderList;

  var OrderView = Backbone.View.extend({
    tagName: "tr",
    template: _.template($("#order-template").html()),

    initialize: function() {
      this.listenTo(this.model, "change", this.render);
      this.listenTo(this.model, "destroy", this.remove);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.addClass("order active");
      return this;
    }
  });

  var AppView = Backbone.View.extend({

    initialize: function() {
      this.listenTo(orderList, "add", this.addOrder);

      $('#cookbook .tab-pane button').click(function() {
        $('#cookbook .tab-pane button').removeClass("btn-info");
        $this = $(this);
        $this.addClass("btn-info");

        var order = { foot_id: $this.attr("data-id"), title: $this.text(), price: $this.attr("data-price"), ammount: 1 };
        orderList.increaseOrder(order);
      });
    },


    addOrder: function(order) {
      $("#order-list tbody tr").removeClass("active");

      var orderView = new OrderView({model: order});
      $("#order-list tbody").prepend(orderView.render().el);
    },

    updateOrder: function(order) {

    }

  });

  var appView = new AppView;
});