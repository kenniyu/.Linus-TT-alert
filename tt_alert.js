(function() {
  var $body         = $('body'),
      $audioDiv     = $('<audio id="myPing" src="http://jjc.changsclan.net/ken/tri-tone.mp3" preload="auto"></audio><audio id="djTime" src="http://jjc.changsclan.net/ken/mail_mother-fuka-ringtone.mp3" preload="auto"></audio><audio id="fagAlert" src="http://jjc.changsclan.net/ken/shittyshittyfagfag.wav" preload="auto"></audio>'),
      msgCount      = 1,
      myDownvoters  = { '4fb64f2feb35c12131000048': 'p014k' },
      MY_USER_ID    = '4e0646ef4fe7d05e0f00e44a',
      BOT_USER_ID   = '4faf2ceceb35c11f31000439',
      BOT_NAME      = '.Linus';

  function initRoomObj() {
    // set the room obj cuz i need this later
    var turntableObj = turntable;
    for (var key in turntableObj) {
      if ( turntableObj[key] && turntableObj[key]['creatorId'] ) {
        roomObj = turntableObj[key];
        console.log('found room object');
        console.log(roomObj);
        break;
      }
    }
  }

  function handlePm(messageObj) {
    // when i get pmed, make sure its not pms. what?
    var userId = messageObj['senderid'],
        chatText,
        audioEl;
    if (userId === BOT_USER_ID) {
      // he just alerted me, why?  might be my turn, play alert sound
      chatText = messageObj['text'];
      audioEl = document.getElementById('myPing');
      audioEl.play();
    }
  }

  function handleNewSong(messageObj) {
    var currentDj = messageObj['room']['metadata']['current_dj'],
        audioEl,
        downvoterExists = myDownvoters[currentDj];
    if (currentDj === '4e0646ef4fe7d05e0f00e44a') {
      // my turn to spin!
      audioEl = document.getElementById('djTime');
      audioEl.play();
    } else if (downvoterExists) {
      // someone who downvoted me is playing, downvote his ass LOL!
      audioEl = document.getElementById('fagAlert');
      audioEl.play();
    }
  }

  function handleVotes(messageObj) {
    // aint nobody gonna downvote me
		var currentDj = messageObj['room']['metadata']['current_dj'],
        voteLog   = messageObj['room']['metadata']['votelog'][0],
        voterId   = voteLog[0],
        voteType  = voteLog[1],
        users     = roomObj['users'],
        voterName = users[voterId]['name'];

    if (currentDj !== '4e0646ef4fe7d05e0f00e44a') {
      // why would i care about the vote if im not djing? well i dont
      return;
    }

    // shit, im djing, did i get downvoted?
    if (voteType === 'down') {
      // shit, i did. remember this fool so i can downvote him when he plays
      myDownvoters[voterId] = voterName;
    }
  }

  // ============================================== actions ============================================== //

  // initialize shit
  initRoomObj();
  $body.append($audioDiv);

  // open up linus pm
  $('#privateChatIcon').click();
  $('#buddyList .user').each(function(index, item) {
    if ($(item).find('.name').text() === BOT_NAME) {
      $(item).click();
    }
  });

  // start listening
  turntable.addEventListener('message', function(m) {
    var command = m['command'];
    console.log(m)
    if (command === 'pmmed') {
      handlePm(m);
    } else if (command === 'newsong') {
      handleNewSong(m);
    } else if (command === 'update_votes') {
      handleVotes(m);
    }
  });

  // start auto prevent afk
  setInterval(function() {
    $('.pmInput').find('input').val('hi'+msgCount).submit();
    msgCount += 1;
  }, 180000);

})();
