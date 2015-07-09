function clearMessage() {
  $('.message').text('');
}

function getList() {
  $.get('/todo/list/' + todoId, function(res) {
    $('#todo-content').val('');
    $('#todo-date').val('');
    $('#todo-list').fadeOut(function() {
      $(this).empty();
      for (var item in res.todos) {
        var temp = $('<div></div>');
        temp.attr({
          "class": "col-md-12 bordered",
          id: 'todo-' + res.todos[item]._id
        });
        var temp2 = $('<button></button>');
        temp2.attr({
          "class": "btn todo-status",
          type: 'button',
          id: 'button-' + res.todos[item]._id
        });
        if (res.todos[item].isDone) {
          temp2.addClass('btn-info');
          temp2.text('完了');
        }
        else {
          temp2.addClass('btn-danger');
          temp2.text('未完了');
        }
        temp.append(temp2);
        temp2 = $('<strong></strong>').text(res.todos[item].content);
        temp.append(temp2);
        temp2.wrap('<p></p>');
        temp.append($('<p></p>').text('期限：' + moment(res.todos[item].limitDate).calendar()));
        temp.append($('<p></p>').text('作成：' + moment(res.todos[item].createdDate).fromNow()));
        $(this).prepend(temp);
      }
      if (res.todos.length === 0) {
        $('#message-notice').text('ToDoがありません');
      }
      $(this).fadeIn();

      $('.todo-status').click(function() {
        var no = this.id.substr(7); //button-
        $.post('/todo/' + todoId, { n: no }, function(res) {
          if (res) {
            var button = $('#button-' + no);
            button.fadeOut(function() {
              button.toggleClass('btn-danger btn-info');
              if (button.text() == '完了') {
                button.text('未完了');
              }
              else {
                button.text('完了');
              }
              button.fadeIn();
            });
          }
        });
      });

    });
  });
}

$(function() {
  $('#form-add').submit(function() {
    try {
      clearMessage();
      var content = $('#todo-content').val();
      var d = $('#todo-date').val();
      var date = moment(d);
      if (content.length > 30) throw 'ToDoの名称は30文字以内にしてください';
      if (content.length < 1) throw 'ToDoの名称を入力してください';
      if (! (date.isValid())) throw '正しい日付を入力してください';
      $.post('/todo/list/' + todoId, { c: content, d: d }, function(res) {
        if (res) {
          getList();
        }
        else {
          throw 'エラーが発生しました';
        }
      });
    }
    catch (e) {
      $('#message-error').text(e);
    }
    finally {
      return false;
    }
  });

  getList();
});
