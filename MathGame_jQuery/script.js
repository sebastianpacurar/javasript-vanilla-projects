'use strict';

// when document is ready, execute the contents
$(document).ready(function () {

    const $firstNum = $("#num-1"),
        $secondNum = $("#num-2"),
        $answerNum = $("#input-answer"),
        $answerEval = $("#answer-evaluation");

    // generate random integer numbers
    $.fn.generateNumbers = function () {
        $firstNum.text(Math.trunc(Math.random() * 20));
        $secondNum.text(Math.trunc(Math.random() * 20));
    };

    // when "Start Test" button is clicked, generate the 2 random numbers
    $("#start").click(function () {
        $.fn.generateNumbers();
        $answerEval.hide();
    });

    $("#submit").click(function () {
        $answerEval.show();

        // check if the sum of numbers is equal to the value of your inserted value in the input type text
        if (parseInt($firstNum.text()) + parseInt($secondNum.text()) === parseInt($answerNum.val())) {

            // if answer is correct, display "answer is correct" in green. fades out in 1 second
            $answerEval.text(`Your answer is correct`).css("color", "green");
            $answerEval.fadeOut(1000);

        } else if (isNaN(parseInt($firstNum.text()) + parseInt($secondNum.text()))) {

            // if sum of values is NaN, it means the game did not start
            $answerEval.text(`Please start a new game`).css("color", "blue");
        } else {

            // if answer is wrong then display your result and the actual result in red. fades out in 3 seconds
            $answerEval.text(`Your answer is ${$answerNum.val()} and the result is ${parseInt($firstNum.text()) + parseInt($secondNum.text())}`).css("color", "red");
            $answerEval.fadeOut(3000);
        }
    })
});