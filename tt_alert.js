(function() {
  var $body = $('body'),
      $audioDiv = $('<audio id="myPing" src="http://jjc.changsclan.net/ken/tri-tone.mp3" preload="auto"></audio>'),
      command,
      userId,
      chatText,
      audioEl,
      msgCount = 1;

  $body.append($audioDiv);

  // open up linus pm
  $('#privateChatIcon').click();
  $('#buddyList .user').each(function(index, item) {
    if ($(item).find('.name').text() === '.Linus') {
      $(item).click();
    }
  });
  $('#privateChatIcon').click();

  turntable.addEventListener('message', function(m) {
    command = m['command'];
    if (command === 'pmmed') {
      userId = m['senderid'];
      if (userId === '4faf2ceceb35c11f31000439') {
        chatText = m['text'];
        audioEl = document.getElementById('myPing');
        audioEl.play();
      }
    }
  });

  setInterval(function() {
    $('.pmInput').find('input').val('hi'+msgCount).submit();
    msgCount += 1;
  }, 180000);

})();
