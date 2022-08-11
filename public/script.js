const socket = io("/");

const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
var myPeer = new Peer(undefined, {
	path: "/peerjs",
	host: "/",
	port: "3001",
});

let myVideoStream;
navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		myVideoStream = stream;
		addVideoStream(myVideo, stream);
		myPeer.on("call", call => {
			call.answer(stream);
			const video = document.createElement("video")
			call.on("stream", userVideoStream => {
				addVideoStream(video, userVideoStream);
			});
		});

		socket.on("user-connected", (userId) => {
      console.log("USER CONNECTED");
			connectToNewUser(userId, stream);
		});
	});

myPeer.on("open", (id) => {
  console.log(id, "PERR");
	socket.emit("join-room", ROOM_ID, id);
});

function connectToNewUser(userId, stream) {
  console.log("ENTRA A FUNCION");
	const call = myPeer.call(userId, stream);
	const video = document.createElement("video");
  console.log("ANTES");
	// call.on("stream", (userVideoStream) => {
    console.log("CALL ON");
		addVideoStream(video, stream);
	// });
  // console.log(userId);
}

function addVideoStream(video, stream) {
	video.srcObject = stream;
	video.addEventListener("loadedmetadata", () => {
		video.play();
	});
	videoGrid.append(video);
}

let text = $("input");
console.log(text);
$("html").keydown((e) => {
  if(e.which == 13 && text.val().length !== 0) {
    socket.emit("message", text.val());
    console.log(text.val());
    text.val("")
  }
})

const scrollBotton = () => {
  let d = $(".main__chat__window");
  d.scrollBottom(d.prop("scrollHeight"));
}
// Silenciar audio
const muteUnmuted = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if(enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton()
  } else {
    setMuteButton()
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if(enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo()
  } else {
    setStopVideo()
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video__button').innerHTML = html;
}

const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video__button').innerHTML = html;
}


socket.on("createMessage", msg => {
  $("ul").append(`<li class="message">user </br> ${msg}</li>`)
})