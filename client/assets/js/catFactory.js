
//Random color
function getColor() {
    var randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return randomColor
}

function genColors(){
    var colors = []
    for(var i = 10; i < 99; i ++){
      var color = getColor()
      colors[i] = color
    }
    return colors
}

//This function code needs to modified so that it works with Your cat code.
function headColor(color,code) {
    $('.cat__head, .cat__chest').css('background', '#' + color)  //This changes the color of the cat
    $('#headcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function mouthColor(color,code) {
    $('.cat__tail, .cat__chest_inner, .cat__mouth-contour').css('background', '#' + color)  //This changes the color of the cat
    $('#mouthcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnamouth').html(code) //This updates the mouth color part of the DNA that is displayed below the cat
}

function eyeColor(color,code) {
    $('.pupil-left, .pupil-right').css('background', '#' + color)  //This changes the color of the cat
    $('#eyecode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnaeyes').html(code) //This updates the eye color part of the DNA that is displayed below the cat
}

function earColor(color,code) {
    $('.cat__ear--left, .cat__ear--right, .cat__paw-left, .cat__paw-right, .cat__paw-right_inner, .cat__paw-left_inner').css('background', '#' + color)  //This changes the color of the cat
    $('#earcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnaears').html(code) //This updates the ear color part of the DNA that is displayed below the cat
}

function DecoMidColor(color,code) {
    $('.cat__head-dots').css('background', '#' + color)  //This changes the color of the cat
    $('#decocolor1').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnadecorationMid').html(code) //This updates the ear color part of the DNA that is displayed below the cat
}

function DecoOutColor(color,code) {
    $('.cat__head-dots_first, .cat__head-dots_second').css('background', '#' + color)  //This changes the color of the cat
    $('#decocolor2').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnadecorationSides').html(code) //This updates the ear color part of the DNA that is displayed below the cat
}

function setHeadColorByID(color,code, id) {
    $('#head'+ id).css('background', '#' + color)  //This changes the color of the cat
    // $('#headcode').html('code: '+code) //This updates text of the badge next to the slider
    // $('#dnabody').html(code) //This updates the body color part of the DNA that is displayed below the cat
}

function setMouthColorByID(color,code, id) {
    $('#mouth'+ id).css('background', '#' + color)  //This changes the color of the cat
    $('#mouthcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnamouth').html(code) //This updates the mouth color part of the DNA that is displayed below the cat
}

function setEyeColorByID(color,code, id) {
    $('#eye'+ id).css('background', '#' + color)  //This changes the color of the cat
    $('#eyecode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnaeyes').html(code) //This updates the eye color part of the DNA that is displayed below the cat
}

function setEarColorByID(color,code, id) {
    $('.cat__ear--left, .cat__ear--right, .cat__paw-left, .cat__paw-right, .cat__paw-right_inner, .cat__paw-left_inner').css('background', '#' + color)  //This changes the color of the cat
    $('#earcode').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnaears').html(code) //This updates the ear color part of the DNA that is displayed below the cat
}

function setDecoMidColorByID(color,code, id) {
    $('#midDot' + id).css('background', '#' + color)  //This changes the color of the cat
    $('#decocolor1').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnadecorationMid').html(code) //This updates the ear color part of the DNA that is displayed below the cat
}

function setDecoOutColorByID(color,code, id) {
    $('#leftDot' + id).css('background', '#' + color)  //This changes the color of the cat
    $('#rightDot' + id).css('background', '#' + color)  //This changes the color of the cat
    $('#decocolor2').html('code: '+code) //This updates text of the badge next to the slider
    $('#dnadecorationSides').html(code) //This updates the ear color part of the DNA that is displayed below the cat
}

//###################################################
//Functions below will be used later on in the project
//###################################################
function eyeVariation(num) {

    $('#dnashape').html(num)
    switch (num) {
        case 1:
            normalEyes()
            $('#eyeName').html('Basic') //set the badge to Basic
            break
        case 2:
            normalEyes() //reset
            $('#eyeName').html('Chill') //set the badge to Chill
            eyesType1()
            break
        case 3:
            normalEyes() //reset
            $('#eyeName').html('Up') //set the badge to Chill
            eyesType2()
            break
        default:
            console.log("Not 1 or 2")

    }
}

function decorationVariation(num) {
    $('#dnadecoration').html(num)
    switch (num) {
        case 1:
            $('#decorationName').html('Basic')
            normaldecoration()
            break
        case 2:
            $('#decorationName').html('Angled')
            normaldecoration()
            decoType1()
            break
        case 3:
            $('#decorationName').html('More angled')
            normaldecoration()
            decoType2()
            break
    }
}

function animationVariation(num) {
    $('#dnadanimation').html(num)
    switch (num) {
        case 1:
            $('#animation_').html('Head wiggle')
            animationType1()
            break
        case 2:
            $('#animation_').html('Tail wiggle')
            animationType2()
            break
    }
}

function animationType1(){
    resetAnimation()
    $('#head').addClass('movingHead')
}

function animationType2(){
    resetAnimation()
    $('#tail').addClass('movingTail')
}

function resetAnimation(){
    $('#head').removeClass('movingHead')
    $('#tail').removeClass('movingTail')
    //add any other animation class that I create
}

async function normalEyes() {
    await $('.cat__eye').find('span').css('border', 'none')
}

async function eyesType1() {
    await $('.cat__eye').find('span').css('border-top', '15px solid')
}

async function eyesType2() {
    await $('.cat__eye').find('span').css('border-bottom', '15px solid')
}

async function normaldecoration() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.cat__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.cat__head-dots_first').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.cat__head-dots_second').css({ "transform": "rotate(0deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

async function decoType1() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.cat__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.cat__head-dots_first').css({ "transform": "rotate(25deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.cat__head-dots_second').css({ "transform": "rotate(-25deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

async function decoType2() {
    //Remove all style from other decorations
    //In this way we can also use normalDecoration() to reset the decoration style
    $('.cat__head-dots').css({ "transform": "rotate(0deg)", "height": "48px", "width": "14px", "top": "1px", "border-radius": "0 0 50% 50%" })
    $('.cat__head-dots_first').css({ "transform": "rotate(50deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "50% 0 50% 50%" })
    $('.cat__head-dots_second').css({ "transform": "rotate(-50deg)", "height": "35px", "width": "14px", "top": "1px", "border-radius": "0 50% 50% 50%" })
}

