QUnit.config.reorder = false;

module("$.behaviors", {
  teardown: function() {
    $.clearBehaviors();
  }
});


test("Check adding of simple behaviors", function() {
  expect(4);

  var anchor1 = $("a.test1")[0],
      anchor2 = $("a[data-attribute=test-data]")[0];
  
  $.behaviors({
    "a.test1": function(param) {
      ok(true, "Behavior callback successfully executed");
      equal(param, anchor1, "Callback passes element as first argument");
    },
    "a[data-attribute]": function(param) {
      ok(true, "Behavior callback successfully executed");
      equal(param, anchor2, "Callback passes element as first argument");
    }
  });
});


test("Check adding of behavior with event", function() {
  expect(3);

  var input = $("input.test2")[0];

  $.behaviors({
    "input.test2:click": function(param1, param2) {
      ok(true, "Behavior callback successfully executed");
      equal(param1, input, "Callback passes element as first argument");
      ok(param2.preventDefault && param2.stopPropagation, "Callback passes event object as second argument");
    }
  });
  
  QUnit.triggerEvent(input, "click");
});


test("Check adding of complex css selector plus custom event", function() {
  expect(5);

  var $listItems = $("#test-container > ul li");

  $.behaviors({
    "#test-container > ul li:first-child:custom:event": function(param1, param2, param3, param4) {
      ok(true, "Behavior callback successfully executed");
      equal(param1, $listItems[0], "Callback passes element as first argument");
      ok(param2.preventDefault && param2.stopPropagation, "Callback passes event object as second argument");
      strictEqual(param3, 1);
      strictEqual(param4, 2);
    }
  });
  
  $listItems.trigger("custom:event", [1, 2]);
});


test("Check if each behavior is only set once", function() {
  expect(2);
  
  var counter1 = 0,
      counter2 = 0;
  
  $.behaviors({
    "#test-element":           function() { counter1++; },
    "#test-element:mousedown": function() { counter2++; }
  });
  
  $(document).updateBehaviors();
  $(document).updateBehaviors();
  
  $("#test-element").trigger("mousedown").trigger("mousedown");
  
  equal(counter1, 1);
  equal(counter2, 2);
});


test("Check if only those behaviors are assigned that are within a particular container", function() {
  expect(1);
  
  $.behaviors({
    "span.test-element": function() {
      ok(true);
    }
  });
  
  var container       = $("<div>"),
      subElement      = $("<span>", { "class": "test-element" }).appendTo(container),
      subElementClone = subElement.clone();
  
  $("#qunit-fixture").append(container).append(subElementClone);
  
  container.updateBehaviors();
});


test("Check multiple selectors with different events", function() {
  expect(2);
  
  var clickElement      = $("div.click-event")[0],
      mouseOverElement  = $("div.mouseover-event")[0];
      
  $.behaviors({
    ".click-event:click, .mouseover-event:mouseover": function(element) {
      ok(true, "Fired event on '" +  element.className + "'");
    }
  });
  
  $(document).updateBehaviors();
  
  QUnit.triggerEvent(clickElement, "click");
  QUnit.triggerEvent(mouseOverElement, "mouseover");
});