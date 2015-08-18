/*
*  This file, the ShellCheck.net Web UI Supporting Javascript,
*  is free of known copyright restriction. The author, 
*  Vidar Holen, waives any copyright claims to it.
*/

var isBadIE = navigator.appVersion.match(/MSIE [89]+/) != null;

function mixup(contents, comments) { 
  var lines = (contents+"\n").split("\n");
  var commentIndex = 0;
  var output = "";

  output += "<div class='nocode summary'>";
  if(comments.length == 0) {
    output += "It all looks good!\n"
  } else {
    output += comments.length + " comments";
  }
  output += "</div>";
  output += '<span class="nocode tip" style="float: right; padding-right: 10px; "><a id="feedbacklink" href="https://github.com/koalaman/shellcheck/issues">Report bugs</a></span>';

  for(var i=1; i<=lines.length; i++) {
    if(i != lines.length)
      output += paddy(formatLineNumber(i) + htmlEncode(lines[i-1].replace("\t", "        "))) + "\n";
    while(commentIndex < comments.length && comments[commentIndex].line == i) {
      var c = comments[commentIndex];
      output += paddy(formatLineNumber("") + padding(c.column-1)) + "^––" + pod(c.level + "c", c.code, c.message) + "\n";
      commentIndex++;
    }
  }
  return output.replace(/\n/g, "<br>");
}
function paddy(s) { 
  if(!isBadIE) return s;
  return s.replace(/ /g, "&nbsp;");
}

function pod(level, code, str) { 
  var url = "https://github.com/koalaman/shellcheck/wiki/SC" + encodeURI(code);
  var link = code !== "" ? "<a target='blank_' class='help' href='" + url + "'>SC" + code + "</a> " : "";
  if(isBadIE)
    return "<span class='nocode " + escape(level)+ "'>" + 
      link + htmlEncode(str) + "</span>";
  else { 
    return "<div class='nocode comment " + escape(level) + "'>" +
      link + htmlEncode(str) + "</div>";
  }
}

function formatLineNumber(n) { 
  var s=n.toString();
  while(s.length < 4) s=" "+s;
  return "<span class='nocode linenumber'>" +s + "</span>  ";
}

function padding(n) {
  var s = "";
  while(s.length < n) s+=" ";
  return s.replace(/ /g, "&nbsp;");
}

function transfer(fromSelector, toSelector) { 
  setMoreStuff(false);
  var contents=$(fromSelector).val();
  $.post("shellcheck.php", { script: contents }, function (comments) { 
    var str =  mixup(contents, comments);
    $(toSelector).html(str);
    prettyPrint();
  }, 'json');
}

function identify(fromSelector, toSelector) { 
  setMoreStuff(false);
  var contents=$(fromSelector).val();
  $.post("wtfsh.php", { script: contents }, function (comments) { 
    var str =  mixup(contents, comments);
    $(toSelector).html(str);
    prettyPrint();
  }, 'json');
}

function htmlEncode(value){
  if (value) {
    return $('<div />').text(value).html();
  } else {
    return '';
  }
}

function setMoreStuff(t) {
  if(t) {
    $("#htmlmao").hide();
    $("#htmlol").show(500);
  } else { 
    $("#htmlmao").show();
    $("#htmlol").hide(500);
  }
}

function addTextHint(elem, hintText)
{       
  if (elem.value == '')  
  {    
    elem.value = hintText;
    $(elem).addClass("ghosted");
  }

  elem.onfocus = function ()
  {      
    if (elem.value == hintText)     
    {
      elem.value = '';
      $(elem).removeClass("ghosted");
    }
  }

  elem.onblur = function ()
  {
    if (elem.value == '')
    {
      elem.value = hintText;
      $(elem).addClass("ghosted");
    }
  }      
}

var delayCounter = {}; 
function runAfterDelay(id, delay, f) {
  if (delayCounter[id] !== undefined) {
    clearTimeout(delayCounter[id]);
  }
  delayCounter[id] = setTimeout(f, delay);
}

