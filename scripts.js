//Bach Ngo 
//I attest that this is my own work and not copied from any other source

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const face = document.getElementById("face");
const rightFoot = document.getElementById("rightfoot");
const leftFoot = document.getElementById("leftfoot");

function drawGallows() {
	with(ctx) {
		beginPath();
		strokeStyle = "brown";
		lineWidth = 8;
		moveTo(170, 500);
		lineTo(30, 500);
		lineTo(100, 500);
		lineTo(100, 10);
		lineTo(400, 10);
		stroke();
		beginPath();
		strokeStyle = `rgb(196, 98, 16)`;
		lineWidth = 1;
		moveTo(400, 10);
		lineTo(400, 100);
		stroke();
	}
}

function drawHead() {
	with(ctx) {
		beginPath();
		strokeStyle = "black";
		lineWidth = 4;
		arc(400, 150, 50, 0, Math.PI * 2);
		stroke();
		drawImage(face, 350, 100, 100, 100);
	}
}

function drawSpine() {
	with(ctx) {
		beginPath();
		strokeStyle = "black";
		lineWidth = 50;
		moveTo(400, 190);
		lineTo(400, 300);
		stroke();

	}
}

function drawRightArm() {
	with(ctx) {
		beginPath();
		strokeStyle = "black";
		lineWidth = 10;
		moveTo(400, 210);
		lineTo(330, 250);
		lineTo(300, 220);
		stroke();
	}
}

function drawLeftArm() {
	with(ctx) {
		beginPath();
		strokeStyle = "black";
		lineWidth = 10;
		moveTo(400, 210);
		lineTo(470, 250);
		lineTo(500, 220);
		stroke();
	}
}

function drawBooty() {
	with(ctx) {
		beginPath();
		strokeStyle = "black";
		lineWidth = 10;
		fillStyle = "black";
		arc(380, 300, 20, 0, Math.PI * 2);
		fill();
		arc(420, 300, 20, 0, Math.PI * 2);
		fill();
		stroke();
	}
}

function drawRightLeg() {
	with(ctx) {
		beginPath();
		strokeStyle = "black";
		lineWidth = 15;
		moveTo(380, 300);
		lineTo(370, 400);
		stroke();
		drawImage(rightFoot, 329, 390, 50, 50);
	}
}

function drawLeftLeg() {
	with(ctx) {
		beginPath();
		strokeStyle = "black";
		lineWidth = 15;
		moveTo(420, 300);
		lineTo(430, 400);
		stroke();
		drawImage(leftFoot, 421, 390, 50, 50);
	}
}

drawGallows();

var lettersWrongList = [];
var lettersWrong = 0;
var vowelsList = "false";
var $vowelToggle = $("#flexSwitchCheckDefault");
var gameOver = false;

/*
$.ajax ({
	type:'',
	url: '',
	data: {},
	success: function(response) {
		console.log(response);
	},
	error: function(error) {
		alert('error communicating with the server');
	}
});
*/

newWord();
function newWord(){
	$("#wordGuess").text("");
	$("#wrong").text("");
	lettersWrongList = [""];
	lettersWrong = 0;
	$vowelToggle.attr("disabled", true);
	
	$.ajax ({
		type: "GET",
		url: 'words.php',
		success: function(response) {
			$("#wordGuess").text(response);
		},
		error: function(error) {
			alert('error communicating with the server');
		}
	});
}

$("form").on("submit", function(e) {
	e.preventDefault();
	var guess = $("#guessInput").val().toLowerCase();
	$("#guessInput").val("");
	if(!gameOver) {
		$.ajax ({
			type:'POST',
			url: 'words.php',
			data: {"guess":guess, "request":"gaming", "vowels":vowelsList},
			success: function(response) {
				if(response.length <= 1) {
					if(!lettersWrongList.includes(response)) {
						lettersWrongList.push(response);
						$("#wrong").text($("#wrong").text() + response + " ");
						lettersWrong++;
						buildCharlatan();
					}
				} else if(response.length > 1) {
					$("#wordGuess").text(response);
					checkWin();
				}
			},
			error: function(error) {
				alert('error communicating with the server');
			}
		});
	}
});

$vowelToggle.change(function() {
	if(gameOver) {
		if(this.checked) {
			$("#flexSwitchCheckDefaultText").html("<b>Vowels Not Allowed</b>");
			vowelsList = "true";
		} else {
			$("#flexSwitchCheckDefaultText").html("<b>Vowels Allowed</b>");
			vowelsList = "false";
		}
	}
});

function checkWin() {
	$.ajax ({
		type:'POST',
		url: 'words.php',
		data: {"request":"checkWin", "vowels":vowelsList},
		success: function(response) {
			console.log(response);
			if(response != "stillPlaying") {
				$("#wordGuess").text(response);
				$("#wrong").text("You Won! You can toggle vowel guesses below");
				newGame();
			}
		},
		error: function(error) {
			alert('error communicating with the server');
		}
	});
}

function buildCharlatan() {
	if (lettersWrong == 1) {
		drawSpine();
	} else if (lettersWrong == 2) {
		drawHead();
	} else if (lettersWrong == 3) {
		drawRightArm();
	} else if (lettersWrong == 4) {
		drawLeftArm();
	} else if (lettersWrong == 5) {
		drawBooty();
	} else if (lettersWrong == 6) {
		drawRightLeg();
	} else if (lettersWrong == 7) {
		drawLeftLeg();
		$.ajax ({
			type:'GET',
			url: 'words.php',
			data: {"request":"solve"},
			success: function(response) {
				$("#wrong").text("You Lost! The word was: " + response + ". You can toggle vowel guesses below");
				newGame();
			},
			error: function(error) {
				alert('error communicating with the server');
			}
		});
	}
}

function newGame() {
	gameOver = true;
	$vowelToggle.attr("disabled", false);
	setTimeout(function() {
		newWord();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawGallows();
		gameOver = false;
	}, 4000);
}

