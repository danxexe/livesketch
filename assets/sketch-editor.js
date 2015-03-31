var editor = ace.edit("editor");
editor.setTheme("ace/theme/tomorrow");
editor.getSession().setMode("ace/mode/ruby");

var editorEval = function() {
  try {
    editor.getSession().clearAnnotations();

    var compiler = Opal.Opal.Compiler.$new("Sketch.sketch do\n" + editor.getValue() + "\nend");
    var compiled = compiler.$compile();

    Opal.Sketch.$canvas().$clear();
    eval(compiled);
  } catch (e) {
    generated_location = e.$backtrace()[5].match(/(\d+):(\d+)\)$/);
    generated_line = parseInt(generated_location[1]);
    generated_column = parseInt(generated_location[2]);

    generated_location = compiler.$source_map().$map().mappings.filter(function(m){
      return (m.generated.line == generated_line) && m.generated.column > generated_column
    })[0];

    original_line = generated_location.original.line;

    setTimeout(function() {
      editor.getSession().setAnnotations([{type: 'error', text: e.message, row: original_line - 2}])
    }, 0);
  } finally {
    return true;
  }
}
editorEval();

editor.on('change', function() {
  editorEval();
});