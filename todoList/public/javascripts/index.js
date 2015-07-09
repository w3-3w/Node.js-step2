function clearMessage() {
  $('.message').text('');
}

function getList() {
  $.get('/getList', function(res) {
    $('#list-title').val('');
    $('#list-list').fadeOut(function() {
      $(this).empty();
      for (var item in res) {
        var temp = $('<div></div>');
        temp.attr({
          "class": "col-md-12 bordered",
          id: 'list-' + res[item]._id
        });
        var temp2 = $('<a></a>').text(res[item].title);
        temp2.attr('href', '/todo/' + res[item]._id);
        temp.append(temp2);
        temp2.wrap('<p></p>');

        var count = 0;
        var countDone = 0;
        var latest = null;
        for (var todoIdx in res[item].todos) {
          count += 1;
          if (res[item].todos[todoIdx].isDone) {
            countDone += 1;
          }
          else {
            var toCompare = moment(res[item].todos[todoIdx].limitDate);
            if (count - countDone > 1) {
              if (latest.isAfter(toCompare)) {
                latest = toCompare;
              }
            }
            else {
              latest = toCompare;
            }
          }
        }

        if (count === 0) {
          temp.append($('<p></p>').text('ToDoはありません'));
        }
        else {
          temp.append($('<p></p>').text(count + '個中' + countDone + '個がチェック済み'));
          if (latest !== null) {
            temp.append($('<p></p>').text('～ ' + latest.fromNow()));
          }
        }

        temp.append($('<p></p>').text('作成：' + moment(res[item].createdDate).fromNow()));
        $('#list-list').prepend(temp);
      }
      if (res.length === 0) {
        $('#message-notice').text('リストは作成されていません');
      }
      $(this).fadeIn();
    });
  });
}

$(function() {
  $('#form-addList').submit(function() {
    try {
      clearMessage();
      var title = $('#list-title').val();
      if (title.length > 30) throw 'リストの名称は30文字以内にしてください';
      if (title.length < 1) throw 'リストの名称を入力してください';
      $.post('/', { title: title }, function(res) {
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
