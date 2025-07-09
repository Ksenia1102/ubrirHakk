$(document).ready(function(){
  
  $("#form_registration").on('click', '[name="check_policy"]', function(e){
    if ($(this).prop('checked') === false){
      $("#form_registration .btn").attr('disabled',true);
    }
    else{
      $("#form_registration .btn").attr('disabled',false);
    }
  });
  
  $("#form_registration").on('click', '.btn', function(e){
      e.preventDefault();
      const form = $('#form_registration');
      form.find('input').each(function(){
          $(this).removeClass('error_input');
      });
      form.find('.error').each(function(){
          $(this).remove();
      });
      const email = form.find('input[name="email"]').val(),
      name = form.find('input[name="name"]').val(),
      password = form.find('input[name="password"]').val(),
      password_rep = form.find('input[name="password_rep"]').val();
      $.ajax({
          type: "POST",
          url: document.location.href,
          data: {
            'action': 'reg',
            'name': name,
            'password': password,
            'password_rep': password_rep,
            'email': email
          },
          dataType: "json",
          success: function(data){
            if(data.result == 'success'){   
              $.fancybox.close();
              location.href = location.href;
           }
           else {
               if (data.flag == 1) {
                $('#reg_email').parent().append('<div class="error">Пользователь с таким E-mail уже зарегистрирован</div>');
               }
               else{
                  if (data.text_error.name) {
                    $('#reg_name').parent().append(`<div class="error">${data.text_error.name}</div>`);
                  } 
                  if (data.text_error.email === false) {
                    $('#reg_email').parent().append('<div class="error">Неверно заполнен E-mail</div>');
                  } 
                  else if ((data.text_error.email)){
                    $('#reg_email').parent().append('<div class="error">Поле обязательно для заполнения</div>');
                  } 
                  if (data.pass_leight_error === true) {
                    $('#reg_password').parent().append('<div class="error">Пароль должен содержать минимум 8 символов</div>');
                  } else {
                      if (data.pass_error === true) {
                        $('#reg_password_repeat').parent().append('<div class="error">Пароли не совпадают</div>');
                    }
                };
                for(var errorField in data.text_error){
                    $('#reg_'+errorField).addClass('is-error');                      
                }
            }
          }
      }
    });
  });

  $("#loginmodal").on('click', '.btn', function(e){
      e.preventDefault();
      form = $('#form_login');
      form.find('input').each(function(){
          $(this).removeClass('error_input');
      });
      form.find('.error').each(function(){
          $(this).remove();
      });
      var email = form.find('input[name="email"]').val();
      var pass = form.find('input[name="password"]').val();
      $.ajax({
          type: "POST",
          url: document.location.href,
          data: {
              'action': 'login',
              'email': email,
              'pass': pass
          },
          dataType: "json",
          success: function(data){
              if(data.flag == 0){   
                  form.find('input[name="email"]').addClass('is-error');
                  form.find('input[name="email"]').parent().append(`<div class="error">${data.message}</div>`);
              }
              else if(data.flag == 1){   
                  form.find('input[name="email"]').addClass('is-error');
                  form.find('input[name="email"]').parent().append(`<div class="error">${data.message}</div>`);
              } else if (data.flag == 2) {
                  form.find('input[name="password"]').addClass('is-error');
                  form.find('input[name="password"]').parent().append(`<div class="error">${data.message}</div>`);
              } else {
                  // location.href = '/unit-' + data.progress_start_step;
                  location.href = location.href;
              }
          }
      });
  })

  $('.sidebar__logout').on('click', function(e){
      e.preventDefault();
      $.ajax({
          type: "POST",
          url: document.location.href,
          data: {
          	'action': 'out'
          },
          success: function(){
              location.href='/';
          },
          error: function(data){
              console.log(data);
          } 
      });
  });


		
  $("#form_reset").on("click", ".btn", function(e) {
    e.preventDefault();
    $.ajax({
            type    : "POST",
            data    : $("#form_reset").serializeArray(),
            success: function(data) {
                const errMessage = $(data).find("#reset_password_alert").html();
                $("#form_reset").parent().append(errMessage);
                $("#form_reset").remove();
            }
    });

    return false;
});


		
  $("a#start_test").on("click",  function(e) {
    e.preventDefault(); 
    $.ajax({
        type : "POST",
        data : {
          'action': 'test_repeat',
          'id': $(this).attr("data-id"),
      },
      dataType: "json",
      success: function(data){
        if (data.result === "success"){
          setTimeout(function(){
            document.location.href = $("a#start_test").attr("href");
        },300);
        }
      }
    });

  });

		
  $(document).on("click", "button#test_repeat",  function() {
    $.ajax({
        type : "POST",
        data : {
          'action': 'test_repeat',
          'id': $(this).attr("data-id"),
      },
      dataType: "json",
      success: function(data){
        if (data.result === "success"){
          location.href = location.href;
        }
      }
    });

  });


$('#form_test').on('click', 'label', function(e){
  const form = $('#form_test'),
  data_id = $(this).attr("data-id");
  if (form.parent().find(".is-active").length){
    e.preventDefault();
    return;
  }
  $.ajax({
      type: "POST",
      url: document.location.href,
      data: {
          'action': 'answer',
          'data_id': data_id
      },
      dataType: "json",
      success: function(data){
          const success_popup = `<div class="info"><p><b>Всё верно!</b> ${data.success_text}</p></div>`,
          error_popup = `<div class="info"><p><b>Нет, это не так.</b> ${data.error_text}</p></div>`;
          if (data.flag == 'success') {
              const container = form.find("input:checked");
              container.addClass("done");
              container.parent().append(success_popup);
          }
          else{
            const container = form.find("input:checked");
            container.addClass("error");
            container.parent().append(error_popup);
            const success_answer = form.find("#answer" + data.success_answer);
            setTimeout(function(){
                success_answer.addClass("done");
            },300);
          }
          setTimeout(function(){
            form.parent().append('<button class="btn__next">Дальше</button>');
          },500);
      },
      error: function(data){
          console.log('error'+data.flag);
      }
  });
});

$(document).on('click', '.btn__next, .btn.next', function(e){
  let skip = "";
  if ($(this).is(".next") && $(".s-testing").find(".btn__next").length == 0){
    skip = "skip";
  }
  $.ajax({
      type: "POST",
      url: document.location.href,
      data: {
          'action': 'next_q',
          'skip': skip
      },
      dataType: "json",
      success: function(data){
        $(".btn__next").remove();
        if (data.result == "finish"){
          $('.s-testing__wrapper').html(data.text_result);
          $(".footer__inner").remove();
        }
        else{
          $(".s-testing__subtitle").html("Вопрос " + data.number_q);
          $(".s-testing__title").html(data.data_q);
          $('#form_test').html(data.data_a);
          $('.footer__inner .total').find("span").html(data.number_q);
          $(".footer__inner .prev").removeClass("hidden");
        }
      }
  });
});

$(document).on('click', '.prev', function(e){
  $.ajax({
      type: "POST",
      url: document.location.href,
      data: {
          'action': 'prev_q',
      },
      dataType: "json",
      success: function(data){
        $(".btn__next").remove();
        // console.log(data);
        if (data.result == "finish"){
          $('.s-testing__wrapper').html(data.text_result);
          $(".footer__inner").remove();
        }
        else{
          $(".s-testing__subtitle").html("Вопрос " + data.number_q);
          $(".s-testing__title").html(data.data_q);
          $('#form_test').html(data.data_a);
          $('.footer__inner .total').find("span").html(data.number_q);
          if (data.number_q == 1){
            $(".footer__inner .prev").addClass("hidden");
          }
          else{
            $(".footer__inner .prev").removeClass("hidden");
          }
        }
      }
  });
});

$('#form_theme_check').on('click', 'label', function(){
  $(this).parent().find("input").addClass("done");
  $.ajax({
      type: "POST",
      url: document.location.href,
      data: {
          'action': 'check_theme',
          'field': $(this).parent().find('[name="field_name"]').val(),
      },
      dataType: "json",
      success: function(){
      }
  });
});

$('#form_updateprofile').on('click', '#login-updprof-btn', function(e){
  if ($("#form_updateprofile #fullname").val().length < 3){
    e.preventDefault();
    $("#form_updateprofile").find(".invalid-feedback").text("Корректно заполнените имя");
    return false;
  }
  else{
    let name = $("#form_updateprofile #fullname").val();
    name = name.replace(/\s/g, '');
    if (name.length < 3){
      e.preventDefault();
      $("#form_updateprofile").find(".invalid-feedback").text("Корректно заполнените имя");
      return false;
    } 
  }
});


		
  /*$("#form_updateprofile").on("click", ".btn", function(e) {
    e.preventDefault();
    $.ajax({
            type    : "POST",
            data    : $("#form_updateprofile").serializeArray(),
            success: function(data) {
              console.log(data);
                const errMessage = $(data).find("#updateprofile_success").html();
                $("#form_updateprofile").parent().append(errMessage);
            }
    });

    return false;
});

		
  $("#form_edit_password").on("click", ".btn", function(e) {
    e.preventDefault();
    $.ajax({
            type    : "POST",
            data    : $("#form_edit_password").serializeArray(),
            success: function(data) {
              console.log(data);
                const errMessage = $(data).find("#edit_password_success").html();
                $("#form_edit_password").parent().append(errMessage);
            }
    });

    return false;
});
*/

});