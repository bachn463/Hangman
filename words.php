<?php
//Bach Ngo
//I attest that this is my own work 

ini_set("display_errors", 1);
ini_set("display_startup_errors", 1);
error_reporting(E_ALL);
include "wordlist.php";
session_start();
$vowels = ["a", "e", "i", "o", "u"];
if($_SERVER["REQUEST_METHOD"] === "GET") {
	if(isset($_GET["request"]) && $_GET["request"] == "solve") {
		echo ($words[$_SESSION["randomIndex"]]);
	} else {
		$_SESSION["numGuesses"] = 0;
		$_SESSION["randomIndex"] = rand(0, count($words)-1);
		$word = strtolower($words[$_SESSION["randomIndex"]]);
		$_SESSION["wordAsUnderscore"] = "";
		$_SESSION["consonantGuess"] = [];
		for($i = 0; $i < strlen($word); $i++) {
			$_SESSION["wordAsUnderscore"] .= "_";
		}
		echo implode(" ", str_split($_SESSION["wordAsUnderscore"]));
	}
} else if($_SERVER["REQUEST_METHOD"] === "POST") {
	$word = strtolower($words[$_SESSION["randomIndex"]]);
	if(isset($_POST["guess"])) {
		$guess = strtolower($_POST["guess"]);
	}
	if(isset($_POST["vowels"])) {
		$vowelsUsed = $_POST["vowels"];
	} 
	if($vowelsUsed == "true" && count($_SESSION["consonantGuess"]) == 0) {
		for($i = 0; $i < strlen($word); $i++) {
			if(in_array(str_split($word)[$i], $vowels)) {
				$_SESSION["consonantGuess"][] = "_";
			} else {
				$_SESSION["consonantGuess"][] = str_split($word)[$i];
			}
		}
	}
	if(isset($_POST["request"])) {
		if($_POST["request"] == "gaming") {
			$letterIndexes = [];
			for($i = 0; $i < strlen($word); $i++) {
				if($guess == str_split($word)[$i]) {
					if ($vowelsUsed == "true") {
						if (!in_array($guess, $vowels)) {
							$letterIndexes[] = $i;
						}
					} else {
						$letterIndexes[] = $i;	
					}
				}
			}
			if(count($letterIndexes) == 0) {
				if(in_array($guess, $vowels) && $vowelsUsed == "true") {
					echo "";
				} else {
					echo $guess;
				}
			} else {
				$tempWordReplace = str_split($_SESSION["wordAsUnderscore"]);
				for($i = 0; $i < count($letterIndexes); $i++) {
					$tempWordReplace[$letterIndexes[$i]] = str_split($word)[$letterIndexes[$i]];
				}
				$_SESSION["wordAsUnderscore"] = implode($tempWordReplace);
				echo implode(" ", str_split($_SESSION["wordAsUnderscore"]));
			}
		} else if($_POST["request"] == "checkWin") {
			if($vowelsUsed == "true"){
				if(implode($_SESSION["consonantGuess"]) != $_SESSION["wordAsUnderscore"]) {
					echo "stillPlaying";
				} else {
					echo $word;
				}
			} else {
				for($i = 0; $i < strlen($_SESSION["wordAsUnderscore"]); $i++) {
					if(str_split($_SESSION["wordAsUnderscore"])[$i] == "_") {
						echo "stillPlaying";
						break;
					}
				}
			}
		}
	}
}

