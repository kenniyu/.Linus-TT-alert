// vars
var $body         = $('body'),
    $audioDiv     = $('<audio id="myPing" src="http://jjc.changsclan.net/ken/tri-tone.mp3" preload="auto"></audio><audio id="djTime" src="http://jjc.changsclan.net/ken/mail_mother-fuka-ringtone.mp3" preload="auto"></audio><audio id="fagAlert" src="http://jjc.changsclan.net/ken/shittyshittyfagfag.wav" preload="auto"></audio>'),
    msgCount      = 1,
    myDownvoters  = { '4fb64f2feb35c12131000048': 'p014k' },
    MY_USER_ID    = '4e0646ef4fe7d05e0f00e44a',
    BOT_USER_ID   = '4faf2ceceb35c11f31000439',
    BOT_NAME      = '.Linus';

// functions

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
  var senderId  = messageObj['senderid'],
      audioEl   = document.getElementById('myPing'),
      chatText;
  if (senderId === BOT_USER_ID) {
    // he just alerted me, why?  might be my turn, play alert sound
    chatText = messageObj['text'];
    audioEl.play();
  }
}

function handleNewSong(messageObj) {
  var currentDj = roomObj['currentDj'],
      audioEl,
      downvoterExists = myDownvoters[currentDj];
  if (currentDj === MY_USER_ID) {
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
  console.log('handleVotes');
  var currentDj = roomObj['currentDj'],
      voteLog   = messageObj['room']['metadata']['votelog'][0],
      voterId   = voteLog[0],
      voteType  = voteLog[1],
      users     = roomObj['users'],
      voterName = users[voterId]['name'],
      audioEl   = document.getElementById('fagAlert');

  console.log(currentDj);
  console.log(MY_USER_ID);
  console.log(voteLog);
  console.log(voteType);
  console.log(voterName);

  // shit, im djing, did i get downvoted?
  if (currentDj === MY_USER_ID && voteType === 'down') {
    // shit, i did. remember this fool so i can downvote him when he plays. ring the alarm
    myDownvoters[voterId] = voterName;
    audioEl.play();
    console.log(voterName + ' downvoted me');
    $('.chatBar').find('input').val(voterName + ' is a LAMEr').submit();
  }
}

function handleSnag(messageObj) {
  // this nigger stole something
  var currentDj   = roomObj['currentDj'],
      snaggerId   = messageObj['userid'],
      users       = roomObj['users'],
      snaggerName = users[snaggerId]['name'],
      audioEl     = document.getElementById('myPing');

  if (currentDj === MY_USER_ID) {
    // this fool snagged my bombass track
    audioEl.play();
    console.log(snaggerName + ' snagged me');
    $('.chatBar').find('input').val(snaggerName + ' loves this track').submit();
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
  if (command === 'pmmed') {
    handlePm(m);
  } else if (command === 'newsong') {
    handleNewSong(m);
  } else if (command === 'update_votes') {
    handleVotes(m);
  } else if (command === 'snagged') {
    handleSnag(m);
  } else {
    console.log(m);
  }
});

// start auto prevent afk
setInterval(function() {
  $('.pmInput').find('input').val('hi'+msgCount).submit();
  msgCount += 1;
}, 180000);
