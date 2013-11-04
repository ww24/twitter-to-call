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

  // Add Phone Number
  var $addPhoneModal = $("#add-phone-modal"),
      $addPhoneModalError = $("#add-phone-modal-error").hide(),
      $addPhoneModalSubmit = $("#add-phone-modal-submit");
  $addPhoneModal.find("form").submit(function (e) {
    e.preventDefault();

    $addPhoneModalSubmit.button("loading");

    $.ajax({
      method: "post",
      url: "/phone/add",
      headers: {
        "X-CSRF-Token": csrf_token
      },
      data: $(this).serialize()
    }).done(function (res) {
      console.log(res);
      
      $addPhoneModalError.hide(500, function () {
        location.assign("/dashboard");
      });
    }).fail(function (ajax) {
      var res = ajax.responseJSON;
      console.log(ajax);

      // show error alert
      $addPhoneModalError.show();

      switch (ajax.status) {
        case 403:
          $delPhoneModalError.text("セッションがタイムアウトしました");
          return location.reload(true);
        case 500:
          return $delPhoneModalError.text("サーバーエラーが発生しました");
      }

      // validation error
      if (res.status = "validation error")
        return $addPhoneModalError.html(res.error.join("<br>"));

      $addPhoneModalError.text("未知のエラーが発生しました");
    }).always(function () {
      $addPhoneModalSubmit.button("reset");
    });
  });

  // Verify Phone Number
  var $verifyPhoneModalSubmit = $("#verify-phone-modal-submit");
  $verifyPhoneModalSubmit.click(function () {
    $verifyPhoneModalSubmit.button("loading");
    setTimeout(function () {
      location.reload(true);
    }, 1000);
  });

  // Delete Phone Number
  var $delPhoneModal = $("#del-phone-modal"),
      $delPhoneModalError = $("#del-phone-modal-error").hide(),
      $delPhoneModalSubmit = $("#del-phone-modal-submit");
  var target;
  $("#phones button.delete").click(function () {
    target = $(this).attr("data-phone-target");
  });
  $delPhoneModal.find("form").submit(function (e) {
    e.preventDefault();

    $delPhoneModalSubmit.button("loading");

    $.ajax({
      method: "post",
      url: "/phone/del/" + encodeURIComponent(target),
      headers: {
        "X-CSRF-Token": csrf_token
      },
      data: $(this).serialize()
    }).done(function (res) {
      console.log(res);
      
      $addPhoneModalError.hide(500, function () {
        location.reload(true);
      });
    }).fail(function (ajax) {
      var res = ajax.responseJSON;
      console.log(ajax);

      // show error alert
      $delPhoneModalError.show();

      switch (ajax.status) {
        case 403:
          $delPhoneModalError.text("セッションがタイムアウトしました");
          return location.reload(true);
        case 500:
          return $delPhoneModalError.text("サーバーエラーが発生しました");
      }

      $addPhoneModalError.text("未知のエラーが発生しました");
    }).always(function () {
      $delPhoneModalSubmit.button("reset");
    });
  });
});
