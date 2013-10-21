// ui.js

$(function() {
  var $useButton = $("#use-button"),
      $usingGuide = $("#using-guide");
  
  $useButton.click(function() {
    $usingGuide.animate({
      height: "500px"
    }, 500, function() {
      $(this).height("auto");
    });
    
    $(this).hide();
  });
});
