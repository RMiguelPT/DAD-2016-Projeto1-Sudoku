// 2130628- Paulo Penicheiro
// 2130664- Ruben Bernardo
// 2130780- Bruno Paixão

// Implementation:

(function () {
    'use strict';
    $(document).ready(function () {

        //Global variables
        var cells = $('input'); //gets all the inputs
        var checkGameBtn = $('#btn-check'); //check game button
        var newGameBtn = $('#btn-new'); //newgame button
        var highlightBtns = $('#highlightButtons button');
        var timer;
        var iconLoading = $('#loading');



        //function to initiate de game
        function init() {
            projetAuthors();
            //cells.prop("disabled", true);
            //callApiRest();
            newGame();

        }


        highlightBtns.click(function () {
            highlightCells($(this).text());
        });

        function stopTimer(index){
            console.log("STOP TIMER");//[DEBUG MODE] delete after development
            console.log(index);//[DEBUG MODE] delete after development
            clearInterval(timer);
            timer = undefined;
            cells.each(function () {
                if($(this).val() == index) {
                    $(this).removeClass('highlight');
                }
            });
        }


        function startTimer(index){

                var st=stopTimer.bind(window, index); // bind do parametro Index a ser usado no callback do setInterval
                timer = setInterval(st, 5000);

        }

        function highlightCells(index) {
            if(timer == null || timer == undefined) {
                startTimer(index);
                cells.each(function () {
                    if ($(this).val() == index) {
                        $(this).addClass('highlight');
                    }
                });
            }

        }


        //validates incorrect values on the input cells (deletes incorrect Values)
        cells.keyup(function() {
            if($(this).val() < 1 || $(this).val() > 9 || isNaN($(this).val())) {
                $(this).val(' ');
            }else {
                parseInt($(this).val());
            }
        });


        function checkLine(lineNumber) {
            var currentLine = $("input[data-line='"+lineNumber+"']");
            var correctValue = 45;
            var soma = 0;

            currentLine.each(function () {
                if($(this).val() != '') {
                    soma += parseInt($(this).val());
                }

            });

            if(soma === correctValue) {
                //do the animation
                alert('CORRECT LINE');
            }
        }

        function checkColumn(colNumber) {
            var currentLine = $("input[data-column='"+colNumber+"']");
            var correctValue = 45;
            var soma = 0;

            currentLine.each(function () {
                if($(this).val() != '') {
                    soma += parseInt($(this).val());
                }

            });

            if(soma === correctValue) {
                //do the animation
                alert('CORRECT COLUMN');
            }
        }


        //adds the bakcground to a cell with value
        cells.blur(function() {
            if($(this).val() > 0 && $(this).val() < 10) {
                $(this).addClass('with-value');
                var lineNumber = $(this).attr('data-line');
                var colNumber = $(this).attr('data-column');
                console.log('line - '+lineNumber);//[DEBUG MODE] delete after development
                console.log('Col - '+colNumber);//[DEBUG MODE] delete after development
                checkLine(lineNumber);
                checkColumn(colNumber);
            }
            else {
                $(this).removeClass('with-value');
            }
        });

        //when a cell with a value is doubleclicked adds a red border
        cells.dblclick(function() {
            if($(this).val() > 0 && $(this).val() < 9) {
                $(this).toggleClass('individual-highlight');
            }
        });


        //process a new game
        newGameBtn.click( function () {
            newGame();
        });

        //starts a new game
        function newGame() {
            $('input').prop("disabled", false);
            cells.each(function () {
                $(this).val('').removeClass();
            });
            //access the API to obtain the board
            callApiRest();
        }
        
        
        
        //Process Board with API REsults
        function processBoard(line, col, value) {
            console.log("Line: " + line + "Col: " + col + "Value: " + value);//[DEBUG MODE] delete after development
            $("input[data-column='"+col +"'][data-line='"+line+"']").val(value).prop("disabled", true).addClass('initial');

        }

        //process API results
        function processAPIResults(result) {
            if(result.Response === 'False') {
                alert('<strong> No Results Found!</strong>');
            }else {
                console.dir(result);//[DEBUG MODE] delete after development
                $.each(result, function(index, number){
                    //params (Line  number, column number, cell value)
                    iconLoading.addClass('invisible');
                    processBoard(result[index].line, result[index].column, result[index].value);
                });
            }
        }

        //call sudokuAPIRest GET BOARD
        function callApiRest() {
            iconLoading.removeClass('invisible');
            var difficulty = $('#select-mode option:selected').val();
            var url = 'http://198.211.118.123:8080/board/';
            url += encodeURI(difficulty);
            console.log(url);//[DEBUG MODE] delete after development
            $.get(url, processAPIResults);
        }



        //processes the board to post data to the APIRest
        function processBoardToSend(){
            var gameCells = [];
            cells.each(function(){
                if( $(this).val() != '' || $(this).val() == undefined){ //only sends the cells with values
                    gameCells.push({
                        "line": parseInt($(this).attr('data-line')),
                        "column": parseInt($(this).attr('data-column')),
                        "value": $(this).val(),
                        "fixed": $(this).prop('disabled')
                    });
                }

            });
            return gameCells;
        }

        //processes the conflicts on the game board
        function manageConflicts(lineConflicts, columnConflicts) {
            var conflictCell = $("input[data-column='" + columnConflicts +"'][data-line='" + lineConflicts + "']");

            conflictCell.addClass('conflict');
            setTimeout(function () {
                    conflictCell.removeClass('conflict');
            },5000);


        }

        //button to check the game conflicts
        checkGameBtn.on('click', function(){
            $.ajax({
                type: 'POST',
                url: 'http://198.211.118.123:8080/board/check',
                data: JSON.stringify(processBoardToSend()),
                contentType: 'application/json'

            })
                .done(function(data){

                    if(data.finished){
                        alert('*** WINNER - GAME OVER ***');

                    }
                    $.each(data.conflicts ,function(index){
                        manageConflicts(data.conflicts[index].line, data.conflicts[index].column);
                    })
                })
                .fail(function () {
                    alert('ERROR FINISHING THE GAME');
                })
                .always(function(){
                });
        });


        //
        function projetAuthors() {
            var numbers = $('#authors-section h3');
            var names = $('#authors-section p');
            var divs = $('#authors-section .photo-zone');

            numbers.eq(0).text('2130628');
            numbers.eq(1).text('2130664');
            numbers.eq(2).text('2130780');
            names.eq(0).text('Paulo Penicheiro');
            names.eq(1).text('Ruben Bernardo');
            names.eq(2).text('Bruno Paixão');

            //hides the 4th member of the team
            divs.eq(3).addClass('hidden');
        }


        init();
    });
})();
