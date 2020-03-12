
$listOpen = $(".overPageButton"); // przyciski otwierające instrukcje lub autorów 
$list = $(".howToPlayPage");// lista z instrukcją
$fieldUser1 = $("#num1"); // pierwsze pole tesktowe do wpisania gracza
$startGameButton = $("#startGameButton"); // główny przycisk rozpoczęcia gry
$submit = $("#nextStep1234");
$formPlace = $(".form"); //formularz z polami tekstowymi
$addTextField = $(".addUser"); // przycisk dodający pola tekstowe
$count = 1; // ogranicznik dla wpisywania użytkowników
$open = false; 

function keyboardUp () {
    $(".fUser").each(function() {
        if($(this).attr("id") != "num1"){
            if(!$(this).is(":focus")) {
                $(this).hide();
                $inputId = $(this).attr('id');
                $(".closeInput[name="+$inputId+"]").hide();
            }
        }  
    });
}

function keyboardDown () {
    $(".fUser").each(function() {
        if(!$(this).is(":focus")) {
            $(this).show();
            $inputId = $(this).attr('id');
            $(".closeInput[name="+$inputId+"]").show();
        }
    });
}

$(document).ready(function(){
    var _originalSize = $(window).width() + $(window).height();
    $(window).resize(function(){
        if($(window).width() + $(window).height() != _originalSize){
            console.log("keyboard show up");
            keyboardUp();
            $(".fUser").each(function () {
                $(this).focus(function () {
                    keyboardUp();
                });
                $(this).blur(function () {
                    setTimeout(function () {
                        keyboardDown();
                    }, 500)
                });
            });
        }
        else{
            console.log("keyboard closed");
            keyboardDown();
        }

        
    });

    
});

$listOpen.each(function(){ //otwieranie instrukcji i autorów
    $(this).click(function() {
        if($(this).attr("id") == 'howToPlay') {
            $('.howToPlayPage').fadeIn(200);
            $('.howToPlayPage').css("display", "flex");
        }
        else {
            $('.authorsPage').fadeIn(200);
            $('.authorsPage').css("display", "flex");
        }
        $(".close").click(function(){
            $(".close").closest(".overPage").fadeOut(400);
            $(".close").closest(".overPage").removeClass('flexColumn');
             
            
        })
    });
});

$startGameButton.click(function() {
    $(".addUsersPage").fadeIn(200);
    $(".addUsersPage").css("display", "flex");
    $(".fUser#num1").focus();
    $(".back").click(function() {
        $(".addUsersPage").fadeOut(200);
    })
})

var notValidate = false;
$("#nextStep").click(function(){ // po kliknięciu rozpoczyna się gra
    $(".fUser").each(function() {
        if($(this).val() != "" && ($(this).val().length >= 2 && $(this).val().length <= 7)) 
        {
            notValidate = false;
            getNames();
            setUsersInfo();
            $(".mainGame").fadeIn("fast");
            /*startGame();  */
        } 
        else notValidate = true;
    })
    if(notValidate) alert("Nazwy graczy muszą się składać z od 2 do 7 znaków.")
})

if($count < 5)
{
    $addTextField.click(function(){
        if($(".fUser").length < 5) {
            $count++;
            addInput();
        } 
    })        
}
        
function getNames() // pobiera graczy do tablicy
{
    $players = [];
    $.each($(".fUser"), function(){
        $players.push($(this).val())
    })
}
        
function addInput() // dodaje pola tekstowe
{
    $addTextField.attr("href","#num"+$count);
    $addTextField.attr("title","Dodaj gracza");

    $newEl = $("<input>");  // dodaje pola tekstowe, nie więcej niż 5
    $newEl.attr("type","text");
    $newEl.attr("name","number"+$count);
    $newEl.attr("placeholder","Podaj "+$count+" uczestnika");
    $newEl.attr("id","num"+$count); 
    $newEl.addClass("fUser");

    $newSpan = $("<span></span>"); // tworzy przycisk usuwający dane pole
    $newSpan.attr("title","Usuń gracza");
    $newSpan.addClass("closeInput");
    $newSpan.html("&times;"); 
    $newSpan.attr("name","num"+$count); 
    
    

    if($count <= 5)
    {

        if(($("#num"+($count+1))).length) {
            $nextInput = $("#num"+($count+1));
            $($newSpan).insertBefore($nextInput);
            $($newEl).insertBefore($newSpan);
            if (deletedInputs.length > 1 && deletedInputs[deletedInputs.length-1] == 4) { 
                deletedInputs.shift();
            }
            else deletedInputs.pop();
            if(deletedInputs.length != 0) { 
                $count = deletedInputs[deletedInputs.length-1];
            }
            else $count = $(".fUser").length;  
        }
        else {   
            $formPlace.append($newEl, $newSpan);
            if (deletedInputs.length > 1 && deletedInputs[deletedInputs.length-1] == 4) { 
                deletedInputs.pop();
                $count = deletedInputs[deletedInputs.length-1]
            }
            else {
                deletedInputs.shift();
            }
        } 
    }
    deleteInput();
}

var deletedInputs = [];
var max;

function deleteInput()  // usuwa pole tekstowe
{
    $.each($($newSpan), function(){
        $(this).click(function(){
            $closeButName = $(this).attr("name");
            $closeButIdNum = parseInt($closeButName[3]);
            $idInp = "#"+ $closeButName;
            $($idInp).remove();
            $(this).remove();
            //usuwam pole nr 3, tablica = [2], count = 2, 
            //usuwam pole nr 2, tablica = [2,3]
            //usuwam pole nr 4, tablica = [2,3,4]
            deletedInputs.push($closeButIdNum-1);
            deletedInputs.sort((a, b) => a - b);
            max = deletedInputs[deletedInputs.length-1];
            $count = max;
        })  
    });
}
//Koniec sekcji startGame------------------------------

function setUsersInfo() // tworzy objekt z użytkownikami i ich danymi 
{
    $playersInfo = new Object;
    for($i=0; $i<$players.length; $i++)
    { 
        $playersInfo[$players[$i]] = new Object;
        $playersInfo[$players[$i]]["time"] = 30;
        $playersInfo[$players[$i]]["points"] = 0;
        $playersInfo[$players[$i]]["wheels"] = new Object;
        $playersInfo[$players[$i]]["wheels"]["halfByHalf"] = 1;
        $playersInfo[$players[$i]]["wheels"]["addTime"] = 1;
    }
}

function startGame() //tworzy boxy z pytaniami i nadaje im funckcję boxInside
{
    $questions = "";
    $.get('http://git.spcity.pl:8000/api/losuj?ilosc='+(5*$players.length),function(answ){
        answ=answ.data;
        $questions=answ;
        createBoxes();
        $.each($(".questBox"),function(){
            boxInside();
        });
    }); 
}

function createBoxes() // tworzy boxy z pytaniami
{
    $webBody = $(".appendHere");
    $count = 0; // ogranicznik, żeby gracze się na zmianę wpisywali 
    for($i=0; $i<(5*$players.length); $i++)
    {
            $newBox = $("<div></div>");
            $newBox.addClass("questBox");
            $newBox.attr("id","box"+$i);
            function newBoxText() // nadaje innerHTML dla boxów
            {
            $newBox.html('<section><div class="user"><h2 class="userName">Pytanie dla <span class="uName">'+$players[$count]+
            '</span></h2><h2><span class="timeDesc">Pozostały czas: <span class="timer">30</span></span></h2><h2 class="points">'+$playersInfo[$players[$count]]["points"]+
            '</h2></div>'+
            '<div class="wheels"><h2 class="wheelDesc">Koła ratunkowe:</h2><div class="wheel" id="halfByHalf"><i class="icon-star-half-alt"></i> 50/50</div><div class="wheel" id="addTime"><i class="icon-clock"></i> + 30s</div></div></section>'+
            '<section class="here"><div class="question"><h3>'+$questions[$i]["tresc"]+
            '</h3><button data-id='+$i+' type="button" class="answer choose" value="0"><p>'+$questions[$i]["odpowiedzi"][0].tresc+
            '</p></button><button data-id='+$i+' type="button" class="answer choose" value="1"><p>'+$questions[$i]["odpowiedzi"][1].tresc+
            '</p></button><button data-id='+$i+' type="button" class="answer choose" value="2"><p>'+$questions[$i]["odpowiedzi"][2].tresc+
            '</p></button><button data-id='+$i+' type="button" class="answer choose" value="3"><p>'+$questions[$i]["odpowiedzi"][3].tresc+
            '</p></button><input type="submit" class="answer subButton" value="Następne pytanie"></div></section>');
            }
            
        if($count >= $players.length) 
        {
            $count = 0;
            newBoxText();
            $count++;
        }
        else 
        {
            newBoxText(); 
            $count++;       
        }

        $answers = $newBox.find(".choose");
        $pointField = $newBox.find(".points"); 
        $nextQestionBut = $newBox.find(".subButton");
        $webBody.append($newBox);
        boxInside($answers, $nextQestionBut);  
    }   
}  

$c = 0;
function nextBoxVariables() // nadanie zmiennych pytaniowych dla czasomierza dla każdego pytania
{
    $c++;
    $nextBoxId = "box"+ $c;
    $nextBox = ("#"+ $nextBoxId);
    $nextBoxName = $($nextBox).find(".uName").html();
    $nextBoxTimerPlace = $($nextBox).find(".timer");
}

$nextBox = "";
$firstBoxBorder = 0; //ogranicznik dla setTime przy pierwszym pytaniu
function setTime(name, timerPlace, thisBox)
{  
    if($playersInfo[name].time <= 0) 
    {
        nextBoxVariables();
        if($nextBox == "#box"+$players.length*5)
        {
            
            clearInterval($interval);
            $(".mainGame").fadeOut("fast");
            $(".endGame").fadeIn("slow");
            endGame();
        }  
        else
        {
            console.log("KONIEC CZASU!");
            clearInterval($interval);
            thisBox.fadeOut("500");
            $playersInfo[name].time = 30;
            $firstBoxBorder++;
            $interval = setInterval(function(){
                setTime($nextBoxName, $nextBoxTimerPlace, $($nextBox));
            },1000);
            $wheelsNextBox = $($nextBox).find(".wheel");
            $.each($wheelsNextBox, function(){
                checkWheels($(this)); 
                $(this).click(function(){
                    clickWheels($(this));
                })
            })
        }
       
       
    } 
    else
    {
        $playersInfo[name].time -= 1;
        timerPlace.html($playersInfo[name].time);
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
    }

function clickWheels(wheel) //odpowiada za czynności które staną się po kliknięciu kołą ratunkowego
{  
    $answerData = wheel.closest(".questBox").find(".choose").attr("data-id");
    $answers = wheel.closest(".questBox").find(".choose");
    $tmpData = $questions[$answerData]["odpowiedzi"];
    $name = wheel.closest(".questBox").find(".uName").html();
    if($playersInfo[$name]["wheels"][wheel.attr("id")] == 1)
    {
        if(wheel.attr("id") == "addTime")
        {
            $playersInfo[$name]["time"] += 30;
        }
        else 
        { 
            do // generują się dwie różne liczby
            {
                do
                {
                    $lucky1 = getRandomInt($tmpData.length);
                }while($tmpData[$lucky1].poprawna == 1); // sprawdza, czy liczba należy do błędnej odpowiedzi

                do
                {
                    $lucky2 = getRandomInt($tmpData.length);
                }while($tmpData[$lucky2].poprawna == 1); // sprawdza, czy liczba należy do błędnej odpowiedzi

            }while($lucky1 == $lucky2)  
            console.log($lucky1); 
            console.log($lucky2); 
            $.each($answers, function(){
                if($(this).val() == $lucky1 || $(this).val() == $lucky2) // dla tych 2 błędnych odp daje klasę "błędna"
                {
                    $(this).addClass("bad");
                    $(this).attr("disabled","disabled");
                }
            }) 
        }

        wheel.addClass("bad");
        wheel.attr("disabled","disabled");
        $playersInfo[$name]["wheels"][wheel.attr("id")] = 0;   
    }  
} 

function checkWheels(wheel) // sprawdza czy wcześniej koło ratunkowe nie było użyte
{
    $name = wheel.closest(".questBox").find(".uName").html();
    if($playersInfo[$name]["wheels"][wheel.attr("id")] == 1)
    {
        wheel.removeClass("bad");
        wheel.removeAttr("disabled");
    }
    else
    {
        wheel.addClass("bad");
        wheel.attr("disabled","disabled");
    }
}


$licz = true; // flaga, żeby funkcja zliczała zmienne raz z jednego pytanie, a nie z kilku
function boxInside(answ, submitBut)
{
    $boxTimerPlace = $(".questBox:first-child").find(".timer");
    $boxName = $(".questBox:first-child").find(".uName").html();
    $box = $(".questBox:first-child");
    
    if($licz)
    {
        $wheels = $box.find(".wheel");
        $.each($wheels, function(){
            $(this).click(function(){
                clickWheels($(this));
            }) 
        })

        $interval = setInterval(function() {
        if($firstBoxBorder == 0)
        {
            setTime($boxName, $boxTimerPlace, $box);  //tutaj to widać użycie timerCount
        }
        },1000);
    }
    $.each(answ, function(){
        $(this).click(function(){
            clearInterval($interval);
            $boxCounter = $(".questBox").length;
            //zmienne dla czasomierza odpalanego po kliknięciu dalej
            $thisBox = $(this).closest(".questBox");
            $idBox = $thisBox.attr("id").split("");   
            if($idBox.length == 5)
            {
                $tmp = Number($idBox[4]); $tmp++;  
                $idBox[4] = $tmp;         
            }
            else
            {
                $tmp = Number($idBox[3]); $tmp++;  
                $idBox[3] = $tmp;         
            }
             
                     
            $nextBoxId = "#" + $idBox.join("");
            console.log($nextBoxId);
            $nextBoxTimerPlace = $($nextBoxId).find(".timer");
            $nextBoxPlayerName = $($nextBoxId).closest(".questBox").find(".uName");
            $thisPlayerName = $(this).closest(".questBox").find(".uName");
            //------------------------------------------------------------
            $pointsField = $(".points");
            $answerVal = $(this).val();
            $answerData = $(this).attr("data-id");
            if($questions[$answerData]["odpowiedzi"][$answerVal].poprawna == 1)
            {
                console.log("Poprawna!");
                $playersInfo[$thisPlayerName.html()]["points"] += 5;
                $.each($pointsField, function(){ // wpisywanie punktów w zależności od nazwy gracza do pola z punktami
                    $tmpName = $(this).closest(".questBox").find(".uName");
                    $tmpPoints = $playersInfo[$tmpName.html()]["points"];
                    $(this).html($playersInfo[$(this).html($tmpPoints)]);
                })
                $.each(answ, function(){ // zablokowanie innych odpowiedzi nadanie im klasy
                    $(this).addClass("bad");
                    $(this).attr("disabled","disabled");
                })
                $(this).addClass("right"); // nadanie klasy dla prawidłowej odpowiedzi
                submitBut.addClass("rightButton"); // przy okazji dla przycisku
                submitBut.click(function(){
                    
                    if($nextBoxId == "#box"+$players.length*5)
                    {
                        $(".mainGame").fadeOut("fast");
                        $(".endGame").fadeIn("slow");
                        endGame();
                    }
                    else
                    {
                        $(this).closest(".questBox").fadeOut("500");
                        $licz = true;
                        //reset intervala
                        clearInterval($interval); 
                        $playersInfo[$thisPlayerName.html()].time = 30;
                        console.log("RESET!");
                        if($licz)
                        {
                            $interval = setInterval(function() { 
                                setTime($nextBoxPlayerName.html(), $nextBoxTimerPlace, $($nextBoxId));
                            }, 1000);
                        }
                        //----------------
                        $wheelsNextBox = $($nextBoxId).find(".wheel");
                        $.each($wheelsNextBox, function(){
                            checkWheels($(this)); 
                            $(this).click(function(){
                                clickWheels($(this));
                            })
                        })
                    }
                    
                })
            }
            else
            {
                $.each(answ, function(){    // wszystkie odpowiedzi jako niepoprawne
                    $(this).addClass("bad");
                    $(this).attr("disabled","disabled");  
                })
                $(this).addClass("wrong"); // wyróżnienie klikniętej błędnej odpowiedzi
                submitBut.addClass("wrongButton");
                //znalezienie i zaznaczenie poprawnej odpowiedzi
                $tmpData = $questions[$answerData]["odpowiedzi"];
                for($i=0; $i<$tmpData.length; $i++)
                {
                    if($tmpData[$i].poprawna == 1) 
                    {
                        $(this).closest(".questBox").find('.choose[value="'+$i+'"]').addClass("right");
                    }
                }
                //---------------------------------------------
                
                submitBut.click(function(){
                    clearInterval($interval);
                    if($nextBoxId == "#box"+$players.length*5)
                    {
                        $(".mainGame").fadeOut("fast");
                        $(".endGame").fadeIn("slow");
                        endGame();
                    }
                    else
                    {
                        $(this).closest(".questBox").fadeOut("500");
                        $licz = true;
                        // reset intervala
                        $playersInfo[$thisPlayerName.html()].time = 30;
                        console.log("RESET!");
                        if($licz)
                        {
                            $interval = setInterval(function() {
                                setTime($nextBoxPlayerName.html(), $nextBoxTimerPlace, $($nextBoxId));
                            }, 1000);
                        }
                        //----------------
                        $wheelsNextBox = $($nextBoxId).find(".wheel");
                        $.each($wheelsNextBox, function(){
                            checkWheels($(this)); 
                            $(this).click(function(){
                                clickWheels($(this));
                            })
                        })
                        
                    }
                    
                })
            }
        })
    })
    $licz = false; // ogranieczenie 
}

function endGame()
{

    $winnersBox = $(".endGame").find(".winners");
    for($i=0; $i < $players.length; $i++)
    {
        $newParagraph = $("<p></p>");
        $newParagraph.html('<span class="mono">'+$players[$i]+'</span>, udało Ci się zdobyć: <span class="mono">'+$playersInfo[$players[$i]].points+'</span> punktów');
        $winnersBox.append($newParagraph);
    }

    $(".endSubmit").click(function(){
        location.reload();
    })
}

    


    