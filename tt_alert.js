(function() {
  var $body = $('body'),
      $audioDiv = $('<audio id="myPing" src="http://jjc.changsclan.net/ken/tri-tone.mp3" preload="auto"></audio><audio id="djTime" src="http://jjc.changsclan.net/ken/mail_mother-fuka-ringtone.mp3" preload="auto"></audio>'),
      command,
      userId,
      chatText,
      audioEl,
      currentDj,
      msgCount = 1,
      MY_USER_ID = '4e0646ef4fe7d05e0f00e44a',
      BOT_USER_ID = '4faf2ceceb35c11f31000439';

  $body.append($audioDiv);

  // open up linus pm
  $('#privateChatIcon').click();
  $('#buddyList .user').each(function(index, item) {
    if ($(item).find('.name').text() === '.Linus') {
      $(item).click();
    }
  });
  setTimeout(function() { $('#privateChatIcon').click(); }, 1000);

  turntable.addEventListener('message', function(m) {
    command = m['command'];
    console.log(m)
    if (command === 'pmmed') {
      userId = m['senderid'];
      if (userId === '4faf2ceceb35c11f31000439') {
        chatText = m['text'];
        audioEl = document.getElementById('myPing');
        audioEl.play();
      }
    } else if (command === 'newsong') {
			currentDj = m['room']['metadata']['current_dj'];
			if (currentDj === '4e0646ef4fe7d05e0f00e44a') {
				audioEl = document.getElementById('djTime');
        audioEl.play();
			}
    }
  });

  setInterval(function() {
    $('.pmInput').find('input').val('hi'+msgCount).submit();
    msgCount += 1;
  }, 180000);

})();
