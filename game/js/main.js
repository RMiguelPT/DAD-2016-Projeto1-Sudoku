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




        highlightBtns.click(function () {
            highlightCells($(this).text());
        });

        function stopTimer(){
            console.log("STOP TIMER");//[DEBUG MODE] delete after development
            //console.log(index);//[DEBUG MODE] delete after development
            clearInterval(timer);
            timer = undefined;

        }

        function deHightlight() {
            stopTimer();
            cells.each(function () {
                if($(this).hasClass('highlight')) {
                    $(this).removeClass('highlight');
                }
            });
        }


        function startTimer(){
            timer = setInterval(deHightlight, 5000);
        }

        function highlightCells(index) {
            if(timer == null || timer == undefined) {
                setBlueBorderHightlight(index);
            }
            else{
                deHightlight();
                setBlueBorderHightlight(index);
            }
        }
        function setBlueBorderHightlight(index) {
            startTimer(index);
            cells.each(function () {
                if ($(this).val() == index) {
                    $(this).addClass('highlight');
                }
            });
        }


        //validates incorrect values on the input cells (deletes incorrect Values)
        cells.keyup(function() {
            if($(this).val() < 1 || $(this).val() > 9 || isNaN($(this).val())) {
                $(this).val(' ');
            }else {
                parseInt($(this).val());
            }
        });


        //checks it the fullfilled line is valid
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
                alert('CORRECT LINE'); //[DEBUG MODE] delete after development
                var parent = currentLine.parent();
                parent.delay(10).animate({backgroundColor:'#FFBC14'}, 3000)
                      .animate({backgroundColor:'#FFFFFF'}, 3000);
            }
        }

        //checks it the fullfilled column is valid
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
                alert('CORRECT COLUMN');//[DEBUG MODE] delete after development
            }
        }

        //checks it the fullfilled column is valid
        function checkSquare(squareNumber) {
            var square = $("input[square='"+squareNumber+"']");
            var correctValue = 45;
            var soma = 0;

            square.each(function () {
                if($(this).val() != '') {
                    soma += parseInt($(this).val());
                }
            });

            if(soma === correctValue) {
                //do the animation
                alert('CORRECT SQUARE');//[DEBUG MODE] delete after development
            }
        }



        //adds the bakcground to a cell with value
        cells.blur(function() {
            if($(this).val() > 0 && $(this).val() < 10) {
                $(this).addClass('with-value');
                var lineNumber = $(this).attr('data-line');
                var colNumber = $(this).attr('data-column');
                var squareNumber = $(this).attr('square');

                console.log('line - '+lineNumber);//[DEBUG MODE] delete after development
                console.log('Col - '+colNumber);//[DEBUG MODE] delete after development
                console.log('Square -' + squareNumber);
                checkLine(lineNumber);
                checkColumn(colNumber);
                checkSquare(squareNumber);
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
                        //put all the board cells green and display the winning window with data

                    }else {
                        $.each(data.conflicts ,function(index){
                            manageConflicts(data.conflicts[index].line, data.conflicts[index].column);
                        });
                    }
                })
                .fail(function () {
                    alert('ERROR FINISHING THE GAME');
                })
                .always(function(){
                });
        });


        //changes the project authors data in the html page
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

        function setQuadrante() {
            var quadrante = 1;
            var rows = $('.dad-row');
            var currentRow = 1;

            rows.each(function () {
                console.log('ROW' + currentRow);

                if(currentRow < 4) {

                    var cells = $('input', this);
                    cells.each(function () {
                        var col = $(this).attr('data-column');
                        if( (col+1) % 3 == 0) {
                            $(this).attr('square', quadrante);
                            quadrante++;

                            if(($(this).attr('data-column') == 8)){
                                quadrante = 1;
                            }
                        }else {
                            $(this).attr('square', quadrante);
                        }
                    });
                } else if(currentRow < 7) {
                    quadrante = 4;
                    var cells = $('input', this);
                    cells.each(function () {
                        var col = $(this).attr('data-column');
                        if( (col+1) % 3 == 0) {
                            $(this).attr('square', quadrante);
                            quadrante++;

                            if(($(this).attr('data-column') == 8)){
                                quadrante = 4;
                            }
                        }else {
                            $(this).attr('square', quadrante);
                        }
                    });
                }else {
                    quadrante = 7;
                    var cells = $('input', this);
                    cells.each(function () {
                        var col = $(this).attr('data-column');
                        if( (col+1) % 3 == 0) {
                            $(this).attr('square', quadrante);
                            quadrante++;

                            if(($(this).attr('data-column') == 8)){
                                quadrante = 7;
                            }
                        }else {
                            $(this).attr('square', quadrante);
                        }
                    });
                }
                currentRow++;
            });
        }

        //function to initiate de game
        function init() {
            projetAuthors();
            newGame();
            setQuadrante();
        }

        init();
    });
})();
