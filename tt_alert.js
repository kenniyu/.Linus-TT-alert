// vars
var $body                   = $('body'),
    $audioDiv               = $('<audio id="my-ping" src="http://jjc.changsclan.net/ken/tri-tone.mp3" preload="auto"></audio>'+
                                '<audio id="dj-time" src="http://jjc.changsclan.net/ken/mail_mother-fuka-ringtone.mp3" preload="auto"></audio>'+
                                '<audio id="fag-alert" src="http://jjc.changsclan.net/ken/shittyshittyfagfag.wav" preload="auto"></audio>'+
                                '<audio id="killing-spree" src="http://jjc.changsclan.net/ken/jabys/killingspree.wav" preload="auto"></audio>'+
                                '<audio id="dominating" src="http://jjc.changsclan.net/ken/jabys/dominating.wav" preload="auto"></audio>'+
                                '<audio id="megakill" src="http://jjc.changsclan.net/ken/jabys/megakill.wav" preload="auto"></audio>'+
                                '<audio id="unstoppable" src="http://jjc.changsclan.net/ken/jabys/unstoppable.wav" preload="auto"></audio>'+
                                '<audio id="wickedsick" src="http://jjc.changsclan.net/ken/jabys/wickedsick.wav" preload="auto"></audio>'+
                                '<audio id="monsterkill" src="http://jjc.changsclan.net/ken/jabys/monsterkill.wav" preload="auto"></audio>'+
                                '<audio id="godlike" src="http://jjc.changsclan.net/ken/jabys/godlike.wav" preload="auto"></audio>'+
                                '<audio id="holyshit" src="http://jjc.changsclan.net/ken/jabys/holyshit.wav" preload="auto"></audio>'),
    msgCount                = 1,
    upvoteStreak            = 0,
    upvoteStreakAudioHash   = {
      3: 'killingspree',
      4: 'dominating',
      5: 'megakill',
      6: 'unstoppable',
      7: 'wicketsick',
      8: 'monsterkill',
      9: 'godlike',
      10: 'holyshit'
    },
    myDownvoters            = {
      '4fb64f2feb35c12131000048': 'p014k',
      '4e7279c44fe7d045be1c45b5': 'Theod Huxtable'
    },
    UPVOTE_AUDIO_SRC_PREFIX = 'http://jjc.changsclan.net/ken/jabys/',
    MY_USER_ID              = '4e0646ef4fe7d05e0f00e44a',
    BOT_USER_ID             = '4faf2ceceb35c11f31000439',
    BOT_NAME                = '.Linus';

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
    // he just pmed me
    chatText = messageObj['text'];
    if (chatText === 'Hey! This spot is yours, so go ahead and step up!') {
      // it's my turn, play alert sound
      audioEl.play();
    }
  }
}

function handleNewSong(messageObj) {
  var currentDj = roomObj['currentDj'],
      audioEl,
      downvoterExists = myDownvoters[currentDj];
  if (currentDj === MY_USER_ID) {
    // my turn to spin!
    upvoteStreak = 0;
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
  var currentDj = roomObj['currentDj'],
      users     = roomObj['users'],
      voteLog   = messageObj['room']['metadata']['votelog'][0],
      voteType  = voteLog[1],
      voterId,
      voterName,
      audioEl;

  // shit, im djing, did i get downvoted?
  if (currentDj === MY_USER_ID) {
    if (voteType === 'down') {
      console.log('AHHH I GOT DOWNVOTED. messageObj = ');
      console.log(messageObj);
      console.log('votelog = ');
      console.log(voteLog);

      voterId               = voteLog[0];
      voterName             = users[voterId]['name'];
      myDownvoters[voterId] = voterName;
      audioEl               = document.getElementById('fagAlert');

      audioEl.play();
      console.log(voterName + ' downvoted me');
      $('.chatBar').find('input').val(voterName + ' is a LAMEr').submit();
    } else {
      upvoteStreak += 1;
      if (upvoteStreak >= 3) {
        audioEl = document.getElementById( upvoteStreakAudioHash[ Math.min(10, upvoteStreak) ] );
        audioEl.play();
      }
    }
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

function handleRemoveDj(messageObj) {
  var userObj = messageObj['user'],
      userId  = userObj[0]['userid'],
      audioEl;

  if (userId === MY_USER_ID) {
    // i just got removed, type q+
    $('.pmInput').find('input').val('q+').submit();
    audioEl = document.getElementById('djTime');
    audioEl.play();
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
  } else if (command === 'rem_dj') {
    console.log('handle remove dj');
    handleRemoveDj(m);
  } else {
    console.log(m);
  }
});

// start auto prevent afk
setInterval(function() {
  $('.pmInput').find('input').val('hi'+msgCount).submit();
  msgCount += 1;
}, 180000);
