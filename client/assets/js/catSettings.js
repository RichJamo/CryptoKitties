
var colors = Object.values(allColors())

var defaultDNA = {
  "headcolor": 10,
  "mouthColor": 13,
  "eyesColor": 96,
  "earsColor": 10,
  //Cattributes
  "eyesShape": 1,
  "decorationPattern": 1,
  "decorationMidcolor": 13,
  "decorationSidescolor": 13,
  "animation": 1,
  "lastNum": 1
}

// when page loads, do the below:
//does this apply on all pages or just index.html??
$(document).ready(function () {
  $('#dnabody').html(defaultDNA.headColor);
  $('#dnamouth').html(defaultDNA.mouthColor);
  $('#dnaeyes').html(defaultDNA.eyesColor);
  $('#dnaears').html(defaultDNA.earsColor);

  $('#dnashape').html(defaultDNA.eyesShape)
  $('#dnadecoration').html(defaultDNA.decorationPattern)
  $('#dnadecorationMid').html(defaultDNA.decorationMidcolor)
  $('#dnadecorationSides').html(defaultDNA.decorationSidescolor)
  $('#dnaanimation').html(defaultDNA.animation)
  $('#dnaspecial').html(defaultDNA.lastNum)

  renderCat(defaultDNA)
});

function convertDNAfromIntToObject(dnaInt) {
  var dnaStr = dnaInt.toString()
  var kittyDNA = {
    "headcolor": parseInt(dnaStr.slice(0, 2)),
    "mouthColor": parseInt(dnaStr.slice(2, 4)),
    "eyesColor": parseInt(dnaStr.slice(4, 6)),
    "earsColor": parseInt(dnaStr.slice(6, 8)),
    //Cattributes
    "eyesShape": parseInt(dnaStr.slice(8, 9)),
    "decorationPattern": parseInt(dnaStr.slice(9, 10)),
    "decorationMidcolor": parseInt(dnaStr.slice(10, 12)),
    "decorationSidescolor": parseInt(dnaStr.slice(12, 14)),
    "animation": parseInt(dnaStr.slice(14, 15)),
    "lastNum": parseInt(dnaStr.slice(15, 16))
  }
  // console.log(kittyDNA.headcolor)
  return kittyDNA
}

function defaultCat() {
  renderCat(defaultDNA)
}

function randomCat() {
  var randomDNA = {
    "headcolor": Math.floor(Math.random() * 89) + 10,
    "mouthColor": Math.floor(Math.random() * 89) + 10,
    "eyesColor": Math.floor(Math.random() * 89) + 10,
    "earsColor": Math.floor(Math.random() * 89) + 10,
    //Cattributes
    "eyesShape": Math.floor(Math.random() * 7) + 1,
    "decorationPattern": Math.floor(Math.random() * 7) + 1,
    "decorationMidcolor": Math.floor(Math.random() * 89) + 10,
    "decorationSidescolor": Math.floor(Math.random() * 89) + 10,
    "animation": Math.floor(Math.random() * 6) + 1,
    "lastNum": 1
  }
  renderCat(randomDNA)
}

function createKitty() {
  var dnaStr = getDna();
  instance.methods.createKittyGen0(dnaStr).send({}, function (error, txHash) { //the function here is a callback function
    if (error)
      console.log(error);
    else {
      console.log(txHash);
    }
  })
}

function breedKitty() {
  var dadId = $("#dad").val();
  var mumId = $("#mum").val();
  console.log(dadId);
  // console.log(typeOf(dadId));
  instance.methods.breed(dadId, mumId).send({}, function (error, txHash) { //the function here is a callback function
    if (error)
      console.log(err);
    else {
      console.log(txHash);
    }
  })
}

// takes each element of the DNA, combines them into a string, and then converts that string into an integer
function getDna() {
  var dna = ''
  dna += $('#dnabody').html()
  dna += $('#dnamouth').html()
  dna += $('#dnaeyes').html()
  dna += $('#dnaears').html()
  dna += $('#dnashape').html()
  dna += $('#dnadecoration').html()
  dna += $('#dnadecorationMid').html()
  dna += $('#dnadecorationSides').html()
  dna += $('#dnaanimation').html()
  dna += $('#dnaspecial').html()
  return parseInt(dna)
}

// takes in the DNA object and renders a kitty
function renderCat(dna) {
  headColor(colors[dna.headcolor], dna.headcolor)
  $('#bodycolor').val(dna.headcolor)
  mouthColor(colors[dna.mouthColor], dna.mouthColor)
  $('#mouthcolor').val(dna.mouthColor)
  eyeColor(colors[dna.eyesColor], dna.eyesColor)
  $('#eyecolor').val(dna.eyesColor)
  earColor(colors[dna.earsColor], dna.earsColor)
  $('#earcolor').val(dna.earsColor)
  eyeVariation(dna.eyesShape)
  $('#eyeshape').val(dna.eyesShape)
  decorationVariation(dna.decorationPattern)
  $('#deco_shape').val(dna.decorationPattern)
  DecoMidColor(colors[dna.decorationMidcolor], dna.decorationMidcolor)
  $('#deco_color_mid').val(dna.decorationMidcolor)
  DecoOutColor(colors[dna.decorationSidescolor], dna.decorationSidescolor)
  $('#deco_color_out').val(dna.decorationSidescolor)
  animationVariation(dna.animation)
  $('#animation').val(dna.animation)
}

function renderCatByID(dna, id) {
  setHeadColorByID(colors[dna.headcolor], dna.headcolor, id)
  $('#KittyGenes').val(dna.headcolor)
  setMouthColorByID(colors[dna.mouthColor], dna.mouthColor, id)
  setEyeColorByID(colors[dna.eyesColor], dna.eyesColor, id)
  setEarColorByID(colors[dna.earsColor], dna.earsColor, id)
  eyeVariation(dna.eyesShape, id)  ///need to change???
  decorationVariation(dna.decorationPattern) ///need to change???
  setDecoMidColorByID(colors[dna.decorationMidcolor], dna.decorationMidcolor, id)
  setDecoOutColorByID(colors[dna.decorationSidescolor], dna.decorationSidescolor, id)
  animationVariation(dna.animation) ///need to change???
}

function renderMultipleCats(id, dna) {
  let catBox = `<div id="` + id + `"><
                  <div class="cat">
                  <div class="cat__ear">
                      <div id="leftEar` + id + `" class="cat__ear--left">
                          <div class="cat__ear--left-inside"></div>
                      </div>
                      <div id="rightEar` + id + `" class="cat__ear--right">
                          <div class="cat__ear--right-inside"></div>
                      </div>
                  </div>

                  <div id="head` + id + `" class="cat__head">
                      <div id="midDot` + id + `" class="cat__head-dots">
                          <div id="leftDot` + id + `" class="cat__head-dots_first"></div>
                          <div id="rightDot` + id + `" class="cat__head-dots_second"></div>
                      </div>
                      <div class="cat__eye">
                          <div class="cat__eye--left">
                              <span class="pupil-left" id="eye` +id + `"></span>
                          </div>
                          <div class="cat__eye--right">
                              <span class="pupil-right" id="eye` +id + `"></span>
                          </div>
                      </div>
                      <div class="cat__nose"></div>

                      <div class="cat__mouth-contour" id="mouth` + id + `"></div>
                      <div class="cat__mouth-left"></div>
                      <div class="cat__mouth-right"></div>

                      <div class="cat__whiskers-left"></div>
                      <div class="cat__whiskers-right"></div>
                  </div>

                  <div class="cat__body">

                      <div class="cat__chest"></div>

                      <div class="cat__chest_inner" id="mouth` + id + `"></div>


                      <div class="cat__paw-left"></div>
                      <div class="cat__paw-left_inner"></div>


                      <div class="cat__paw-right"></div>
                      <div class="cat__paw-right_inner"></div>


                      <div id="mouth` + id + `" class="cat__tail"></div>
                  </div>
                </div>
                <br>
                <br>
                <br>
                <br>
                <p> This is cat` + id + ` </p>
                <br>`

  $("#catBoxes").append(catBox) // Optionally you can use jquery with method 
  
  renderCatByID(dna, id)
}

// Changing cat colors
$('#bodycolor').change(() => {
  var colorVal = $('#bodycolor').val()
  headColor(colors[colorVal], colorVal)
})

$('#mouthcolor').change(() => {
  var colorVal = $('#mouthcolor').val()
  mouthColor(colors[colorVal], colorVal)
})

$('#eyecolor').change(() => {
  var colorVal = $('#eyecolor').val()
  eyeColor(colors[colorVal], colorVal)
})

$('#earcolor').change(() => {
  var colorVal = $('#earcolor').val()
  earColor(colors[colorVal], colorVal)
})

$('#eyeshape').change(() => {
  var shape = parseInt($('#eyeshape').val()) //number from 1 to 7
  eyeVariation(shape)
})

$('#deco_shape').change(() => {
  var shape = parseInt($('#deco_shape').val()) //number from 1 to 7
  decorationVariation(shape)
})

$('#deco_color_mid').change(() => {
  var colorVal = $('#deco_color_mid').val()
  DecoMidColor(colors[colorVal], colorVal)
})

$('#deco_color_out').change(() => {
  var colorVal = $('#deco_color_out').val()
  DecoOutColor(colors[colorVal], colorVal)
})

$('#animation').change(() => {
  var animationVal = parseInt($('#animation').val()) //number from 1 to 6
  animationVariation(animationVal)
})

$('#btn-random').click(function(){
  randomCat()
})

$('#btn-default').click(function(){
  defaultCat()
})

$('#btn-create').click(function(){
  //code to come here
})