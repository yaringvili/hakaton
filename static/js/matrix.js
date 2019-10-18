//global variables
var currentSection = 0;
var parseScroll = function(event) {
  //find which <section> is in the viewport
  var sections = document.querySelectorAll("#container section");
  for (var i = 0; i < sections.length; i++) {
    var position = sections[i].getBoundingClientRect();
    if (position.top < window.innerHeight && position.bottom > 0) {
      //percentage of the section that is in the viewport
      if (
        Math.round(
          (sections[i].offsetHeight - Math.abs(position.top)) /
            window.innerHeight *
            100
        ) > 50
      ) {
        currentSection = i;
      }
    }
  }
};

//global classes
class canvasManager {
  /*
  The flag for whether an animation's context properties have been set
  is stored as an undefined or defined flag at a number corresponding to its canvas
  animation.
  */
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.c = this.canvas.getContext("2d");
    this.resize();
    var timer = false;
    window.addEventListener(
      "resize",
      function() {
        window.clearTimeout(timer);
        timer = window.setTimeout(
          function() {
            this.resize();
          }.bind(this),
          100
        );
      }.bind(this)
    );
    this.animation = 0;
    this.frameInterval = window.setInterval(this.animate.bind(this),120)
    //this.animate();
  }
  resize() {
    this.c.save();
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.c.width = window.innerWidth;
    this.c.height = window.innerHeight;
    this.clearFrame();
    this.flushCanvas();
  }
  flushCanvas() {
    var found = false;
    var i = 0;
    while (!found) {
      if (typeof this[i] == "undefined") {
        found = true;
      } else {
        delete this[i];
      }
      i++;
    }
  }
  clearFrame() {
    this.c.clearRect(0, 0, this.c.width, this.c.height);
  }
  initAnimationOne() {
    this[0] = {
      chars: [
        "日",
        "ﾊ",
        "ﾐ",
        "ﾋ",
        "ｰ",
        "ｳ",
        "ｼ",
        "ﾅ",
        "ﾓ",
        "ﾆ",
        "ｻ",
        "ﾜ",
        "ﾂ",
        "ｵ",
        "ﾘ",
        "ｱ",
        "ﾎ",
        "ﾃ",
        "ﾏ",
        "ｹ",
        "ﾒ",
        "ｴ",
        "ｶ",
        "ｷ",
        "ﾑ",
        "ﾕ",
        "ﾗ",
        "ｾ",
        "ﾈ",
        "ｽ",
        "ﾀ",
        "ﾇ",
        "ﾍ",
        "ｦ",
        "ｲ",
        "ｸ",
        "ｺ",
        "ｿ",
        "ﾁ",
        "ﾄ",
        "ﾉ",
        "ﾌ",
        "ﾔ",
        "ﾖ",
        "ﾙ",
        "ﾚ",
        "ﾛ",
        "ﾝ",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "7",
        "8",
        "9",
        "Z",
        ":",
        "・",
        ".",
        '"',
        "=",
        "*",
        "+",
        "-",
        "<",
        ">",
        "¦",
        "｜",
        "ç",
        "ﾘ",
        "ｸ"
      ],
      updateValues: function() {
        for (var i = 0; i < Object.keys(this.columns).length; i++) {
          if(this.columns[i].yPos > this.parent.c.height){
            this.columns[i].yPos = -Object.keys(this.columns[i].chars).length*this.columnHeight
          }
          this.columns[i].yPos += 10;
          var randomChar = this.columns[i].chars[Math.floor(Math.random()*Object.keys(this.columns[i].chars).length)]
          randomChar.char = this.chars[Math.floor(Math.random()*this.chars.length)]
            //for (var j = 0; j < Object.keys(this.columns[i].chars).length; j++) {
              //change random character...
              /*var r = this[0].columns[i].chars[j].color[0];
              var g = this[0].columns[i].chars[j].color[1];
              var b = this[0].columns[i].chars[j].color[2];
              var a = this[0].columns[i].chars[j].color[3];
              this.c.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
              this.c.fillText(this[0].columns[i].chars[j].char,i*this[0].columnWidth,j*this[0].columnHeight+this[0].columns[i].yPos);*/
            //}
          }
      },
      columnWidth: 16,
      columnHeight: 16
    };
    this[0].columns = {};
    for (var i = 0; i < 2*Math.floor(this.c.width / this[0].columnWidth); i++) {
      this[0].columns[i] = {};
      this[0].columns[i].chars = {};
      this[0].columns[i].yPos = Math.floor(Math.random() *this.c.height);
      //  return Math.random() * (max - min) + min;
      var maxColHeight = Math.floor(this.c.height/this[0].columnHeight);
      var minColHeight = Math.floor(.25*maxColHeight);
      var colHeight = Math.floor(Math.random()* (maxColHeight - minColHeight)+minColHeight);//Math.floor(Math.random()*25+16);
      var windowCols = this.c.width/this[0].columnWidth;
      this[0].columns[i].xPos = Math.floor(Math.random()*windowCols)*this[0].columnWidth
      var colorIncrement = Math.floor(255/colHeight);
      var opacityIncrement = 1/colHeight
      for (var j = 0; j < colHeight; j++) {
        var r = 8;
        var g = 180;
        var b =15;
        var a = opacityIncrement*Math.pow(j,1.10)
        if(j == colHeight-1){
          r = 120;
          g = 190;
          b = 120;
        }
        this[0].columns[i].chars[j] = {
          char: this[0].chars[Math.floor(Math.random() * this[0].chars.length)],
          color: [r, g, b, a] //in rgba
        };
      }
    }

    console.log(this[0].columns);
    this[0].parent = this;
    //this.c.fillStyle = "#085C0F";
    this.c.shadowColor = "rgba(70,150,70)";
    this.c.shadowBlur = 3;
    //this.c.shadowOffsetX = 0;
    //this.c.shadowOffsetY = 0;
    this.c.textBaseline = "top";
    this.c.font = "600 16px sans-serif";
    this.canvas.style.background = "#000";
  }
  animate() {
    //window.requestAnimationFrame(refresh.bind(this));
    //function refresh() {
      switch (currentSection) {
        case 0:
          if (typeof this[0] == "undefined") {
            this.initAnimationOne();
          }
          this.clearFrame();

          for (var i = 0; i < Object.keys(this[0].columns).length; i++) {
            for (var j = 0; j < Object.keys(this[0].columns[i].chars).length; j++) {
              var r = this[0].columns[i].chars[j].color[0];
              var g = this[0].columns[i].chars[j].color[1];
              var b = this[0].columns[i].chars[j].color[2];
              var a = this[0].columns[i].chars[j].color[3];
              this.c.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
              this.c.fillText(this[0].columns[i].chars[j].char,this[0].columns[i].xPos,j*this[0].columnHeight+this[0].columns[i].yPos);
            }
          }

          //this.c.save();
          //this.c.scale(1, -1);

          //this.c.restore();
          this[0].updateValues();
          break;
        case 1:
          this.clearFrame();
          break;
        case 2:
          this.clearFrame();
          break;
        case 3:
          this.clearFrame();
          break;
        case 4:
          this.clearFrame();
          break;
        default:
          console.log("no selection");
      }
      //console.log(currentSection);
      //window.requestAnimationFrame(refresh.bind(this));
    }
  //}
}

//global events
window.addEventListener("load", init);

//use wheel when possible
//wheel works best for desktop browsers
//scroll works best for mobile browsers
//when wheel fires, cancel scroll listening
window.addEventListener("scroll", parseScroll);
window.addEventListener("wheel", function(event) {
  window.removeEventListener("scroll", parseScroll);
  parseScroll(event);
});

//global functions
function init() {
  initCanvas();
}

function initCanvas() {
  var canvas = new canvasManager();
  var sections = document.getElementsByTagName("section");
  for (var i = 0; i < sections.length; i++) {
    sections[i].setAttribute("data-order", i);
  }
}


/*
Made in appreciation for my favorite movie of all time. --William Green
*/