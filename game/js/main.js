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
        var newGameBtn = $('#btn-new');
        var highlightBtns = $('#highlightButtons button');
        var timer;


        //function to initiate de game
        function init() {
            projetAuthors();
            cells.prop("disabled", true);
            //callApiRest();

        }


        highlightBtns.click(function () {
            clearInterval(timer);
            timer = null;
            highlightCells($(this).text());
        });


        function highlightCells(index) {
            cells.each(function () {
                if($(this).val() == index) {
                    $(this).addClass('highlight');
                }
            });
            if(timer == null || timer == undefined) {
                timer = setInterval(function () {
                    cells.each(function () {
                        if($(this).val() == index) {
                            $(this).removeClass('highlight');
                        }
                    });
                },5000);

            }
            clearInterval(timer);
            timer = null;
        }



        //validates incorrect values on the input cells (deletes incorrect Values)
        cells.keyup(function() {
            if($(this).val() < 1 || $(this).val() > 9 || isNaN($(this).val())) {
                $(this).val(' ');
            }else {
                parseInt($(this).val());
            }
        });

        //adds the bakcground to a cell with value
        cells.blur(function() {
            if($(this).val() > 0 && $(this).val() < 10) {
                $(this).addClass('with-value');
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
                $(this).val('').removeClass('with-value');
            });
            //access the API to obtain the board
            callApiRest();
        }
        
        
        
        //Process Board with API REsults
        function processBoard(line, col, value) {
            $("input[data-column='"+col +"'][data-line='"+line+"']").val(value);

        }

        //process API results
        function processAPIResults() {
            if(result.Response === 'False') {
                alert('<strong> No Results Found!</strong>');
            }else {
                console.dir(data);
                $.each(data, function(index, number){
                    //params (Line  number, column number, cell value)
                    processBoard(data[index].line, data[index].column, data[index].value);
                });
            }
        }

        //call sudokuAPIRest
        function callApiRest() {
            var difficulty = $('#select-mode option:selected').val();
            var url = 'http://198.211.118.123:8080/board/';
            url += encodeURI(difficulty);
            console.log(url);
            $.get(url, processAPIResults);
        }



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
