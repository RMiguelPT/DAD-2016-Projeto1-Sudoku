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

        //function to initiate de game
        function init() {
            projetAuthors();
            cells.prop("disabled", true);
        }



        //validates incorrect values on the input cells (deletes incorrect Values)
        cells.keyup(function() {
            if($(this).val() < 1 || $(this).val() > 9 || isNaN($(this).val())) {
                $(this).val(' ');
            }
        });

        //adds the bakcground to a cell with value
        cells.blur(function() {
            if($(this).val() > 0 && $(this).val() < 9) {
                $(this).addClass('with-value');
            }
        });

        //when a cell with a value is doubleclicked adds a red border
        cells.dblclick(function() {
            if($(this).val() > 0 && $(this).val() < 9) {
                $(this).addClass('individual-highlight');
            }
        });


        //process a new game
        newGameBtn.click( function () {
            newGame();
        });


        function newGame() {
            $('input').prop("disabled", false);

        }

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
