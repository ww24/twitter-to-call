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
    var $form = $(this);

    $.ajax({
      method: "post",
      url: "/phone/add",
      headers: {
        "X-CSRF-Token": csrf_token
      },
      data: $form.serialize()
    }).done(function (res) {
      console.log(res);
      
      $addPhoneModalError.hide();
      if (res.status === "ok") {
        $addPhoneModal.modal("hide");
        location.assign("/dashboard");
      }
    }).fail(function (ajax) {
      var res = ajax.responseJSON;
      console.log(ajax);

      // show error alert
      $addPhoneModalError.show();

      if (ajax.status === 403) {
        $addPhoneModalError.text("セッションがタイムアウトしました");
        return location.reload(true);
      }

      // validation error
      if (res.status = "validation error")
        $addPhoneModalError.html(res.error.join("<br>"));
      else
        $addPhoneModalError.text(res.error);
    }).always(function () {
      $addPhoneModalSubmit.button("reset");
    });
  });
});
