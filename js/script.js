function naver_dict() {}

function game(id, URL) {
  // local var
  let word_list = [];
  const $scrollbox = $(".scrollbox");
  const input = $("#input_word").val();

  function append_word(word) {
    word_list.push(word);
    let $element = $("<div>");
    $element.attr("class", "word_chain");
    $element.text(word);
    $scrollbox.append($element);
  }

  function add_word() {
    let val = input.val();
    val.replaceAll(/\s+/g, "");
    if (val == null || val == "" || word_list[-1][-1] != val[0]) return;

    $.ajax({
      url: URL + "game/post_word",
      type: "POST",
      data: { game_id: id, word: val },
    }).then(function () {
      append_word(val);
    });
  }

  // initialize
  $scrollbox.empty();

  for (let i = 0; i < 10; i++)
    $.ajax({
      url: URL + "game/word_list",
      data: { game_id: id },
      type: "GET",
    }).then(function (data) {
      for (input in data) {
        append_word(input);
      }
      i = 10;
    });
}

function App(URL) {
  // local variables
  const MAX_ID = 100000000;

  // function definition
  function create_game(event, id = 0, depth = 0) {
    let word = $("#word").val();
    word = word.replaceAll(/\s+/g, "");
    if (word == null || word == "") return;

    $(".input_word *").attr("disabled", true);

    if (depth == 10) {
      $(".input_word *").attr("disabled", false);
      alert("게임을 만들수 없습니다. 문제가 지속되면 SCSC에 문의해주세요.");
      return;
    }
    id = Math.floor(Math.random() * MAX_ID);

    $.ajax({
      url: URL + "/game/create",
      data: { game_id: id, first_word: word },
      type: "GET",
    })
      .done(function () {
        game(id, URL);
      })
      .fail(function () {
        create_game(event, id, depth + 1);
      });
  }

  function join_game(event) {
    let id = $(event.target).val();
    game(id, URL);
  }

  function load_games() {
    let $scrollbox = $(".scrollbox");
    $.get(URL + "/game/game_list", {})
      .done(function (data) {
        data.sort(() => {
          return Math.random() - 0.5;
        });
        for (let content in data) {
          let $element = $("<div>");
          $element.attr("class", "game_room");
          $element.val(content);
          $element.on("click", join_game);
          $scrollbox.append($element);
        }
      })
      .fail(function () {
        let $element = $("<div>");
        $element.attr("class", "error_loadgame");
        $element.text("게임 목록을 가져올 수 없습니다.");
        $scrollbox.append($element);
      });
  }

  // add event listeners
  $("#submit").on("click", create_game);

  // initialize
  load_games();
}

$(document).ready(function () {
  const URL = "http://127.0.0.1";
  let app = App(URL);
});
