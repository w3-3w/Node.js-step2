function clearMessage() {
  $('.message').text('');
}

$(function() {
  $('#form-search').submit(function() {
    try {
      clearMessage();
      var keyword = $('#search-content').val();
      if (keyword.length > 20) throw 'キーワードは20文字以内にしてください';
      if (keyword.length < 1) throw 'キーワードを入力してください';
      $.post('/search', { k: keyword }, function(res) {
        if (res) {
          $('#search-content').val('');
          $('#search-result').fadeOut(function() {
            $(this).empty();
            var result = [];
            for (var idx in res) {
              for (var todoIdx in res[idx].todos) {
                var todoNow = res[idx].todos[todoIdx];
                if (todoNow.content.match(keyword)) {
                  result.push({
                    _id: res[idx]._id,
                    title: res[idx].title,
                    content: todoNow.content,
                    limitDate: todoNow.limitDate,
                    createdDate: todoNow.createdDate
                  });
                }
              }
            }
            for (var idx in result) {
              var temp = $('<div></div>');
              temp.attr({
                "class": "col-md-12 bordered"
              });
              var temp2 = $('<a></a>').text(result[idx].content);
              temp2.attr('href', '/todo/' + result[idx]._id);
              temp.append(temp2);
              temp2.wrap('<h3></h3>');
              temp.append($('<p></p>').text('リスト：' + result[idx].title));
              temp.append($('<p></p>').text('期限：' + moment(result[idx].limitDate).calendar()));
              temp.append($('<p></p>').text('作成：' + moment(result[idx].createdDate).fromNow()));
              $('#search-result').prepend(temp);
            }

            if (result.length === 0) {
              $('#message-error').text('対象のToDoは見つかりません');
            }
            else {
              $('#message-notice').text(result.length + '件見つかりました');
            }

            $(this).fadeIn();
          });

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

});
