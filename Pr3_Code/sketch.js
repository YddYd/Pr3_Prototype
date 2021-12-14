/* 
August 2019 - Doug Whitton 
play 3 analog sensors that output sound and circle graphic
The Arduino file that's running is "threeSensorExample"
*/

let osc;
let playing = false;
let serial;
let latestData = "waiting for data"; // you'll use this to write incoming data to the canvas
let splitter;
let nx = 0,
    ny = 0;
let diameter0 = 0,
    diameter1 = 0,
    diameter2 = 0,
    diameter3 = 0;

let video;
let pose;
//let img1;
//let img2;
let skeleton;
let angle = 0;
let history = [];

let osc1, osc2, osc3, fft;

var mass = [];
var positionX = [];
var positionY = [];
var velocityX = [];
var velocityY = [];

function setup() {

    b = new Ball();

    createCanvas(windowWidth, windowHeight);
    noStroke();

    ///////////////////////////////////////////////////////////////////
    //Begin serialport library methods, this is using callbacks
    ///////////////////////////////////////////////////////////////////    

    video = createCapture(VIDEO);
    video.size(width, height);

    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses)
        //img1 = loadImage('images/hand2.svg');
        //img2 = loadImage('images/face.svg');    
    video.hide();

    rectMode(CENTER);
    angleMode(DEGREES);




    // Instantiate our SerialPort object
    serial = new p5.SerialPort();

    // Get a list the ports available
    // You should have a callback defined to see the results
    serial.list();
    console.log("serial.list()   ", serial.list());

    //////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////
    // Assuming our Arduino is connected, let's open the connection to it
    // Change this to the name of your arduino's serial port
    serial.open("COM3");
    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////
    // Here are the callbacks that you can register

    // When we connect to the underlying server
    serial.on('connected', serverConnected);

    // When we get a list of serial ports that are available
    serial.on('list', gotList);
    // OR
    //serial.onList(gotList);

    // When we some data from the serial port
    serial.on('data', gotData);
    // OR
    //serial.onData(gotData);

    // When or if we get an error
    serial.on('error', gotError);
    // OR
    //serial.onError(gotError);

    // When our serial port is opened and ready for read/write
    serial.on('open', gotOpen);
    // OR
    //serial.onOpen(gotOpen);

    // Callback to get the raw data, as it comes in for handling yourself
    //serial.on('rawdata', gotRawData);
    // OR
    //serial.onRawData(gotRawData);

    // createCanvas(windowWidth, windowHeight);
    // noStroke();
    fill(255, 180, 0, 157);


}

function modelLoaded() {
    console.log("modelLoaded function has been called so this work!!!!");
};

function gotPoses(poses) {
    //console.log(poses);
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }

}
////////////////////////////////////////////////////////////////////////////
// End serialport callbacks
///////////////////////////////////////////////////////////////////////////


// osc1 = new p5.TriOsc(); // set frequency and type
// osc1.amp(.5);
// osc2 = new p5.TriOsc(); // set frequency and type
// osc2.amp(.5);
// osc3 = new p5.TriOsc(); // set frequency and type
// osc3.amp(.5);

// fft = new p5.FFT();
// osc1.start();
// osc2.start();
// osc3.start();

// We are connected and ready to go
function serverConnected() {
    console.log("Connected to Server");
}

// Got the list of ports
function gotList(thelist) {
    console.log("List of Serial Ports:");
    // theList is an array of their names
    for (var i = 0; i < thelist.length; i++) {
        // Display in the console
        console.log(i + " " + thelist[i]);
    }
}

// Connected to our serial device
function gotOpen() {
    console.log("Serial Port is Open");
}

// Ut oh, here is an error, let's log it
function gotError(theerror) {
    console.log(theerror);
}



// There is data available to work with from the serial port
function gotData() {
    var currentString = serial.readLine(); // read the incoming string
    trim(currentString); // remove any trailing whitespace
    if (!currentString) return; // if the string is empty, do no more
    console.log("currentString  ", currentString); // println the string
    latestData = currentString; // save it for the draw method
    console.log("latestData" + latestData); //check to see if data is coming in
    splitter = split(latestData, ','); // split each number using the comma as a delimiter
    //console.log("splitter[0]" + splitter[0]); 
    diameter0 = splitter[0]; //put the first sensor's data into a variable
    diameter1 = splitter[1];
    diameter2 = splitter[2];
    diameter3 = splitter[3];



}

// We got raw data from the serial port
function gotRawData(thedata) {
    println("gotRawData" + thedata);
}

// Methods available
// serial.read() returns a single byte of data (first in the buffer)
// serial.readChar() returns a single char 'A', 'a'
// serial.readBytes() returns all of the data available as an array of bytes
// serial.readBytesUntil('\n') returns all of the data available until a '\n' (line break) is encountered
// serial.readString() retunrs all of the data available as a string
// serial.readStringUntil('\n') returns all of the data available as a string until a specific string is encountered
// serial.readLine() calls readStringUntil with "\r\n" typical linebreak carriage return combination
// serial.last() returns the last byte of data from the buffer
// serial.lastChar() returns the last byte of data from the buffer as a char
// serial.clear() clears the underlying serial buffer
// serial.available() returns the number of bytes available in the buffer
// serial.write(somevar) writes out the value of somevar to the serial device


function draw() {



    image(video, 0, 0, width, height);
    //TRESHOLD 0 is white  1 is black
    filter(THRESHOLD, 1);

    // background(255, 255, 255);
    // // text(latestData, 10, 10);
    // ellipseMode(RADIUS);
    // fill(255, 0, 0);
    // noStroke();
    //console.log("diameter0  "  + diameter0);
    // ellipse(100, 100, diameter0 * 100, diameter0 * 100);
    // ellipseMode(RADIUS);
    // fill(0, 255, 0);
    // ellipse(200, 100, diameter1, diameter1);
    // ellipseMode(RADIUS);
    // fill(0, 0, 255);
    // ellipse(300, 100, diameter2, diameter2);


    // var freq = map(diameter0, 0, width, 40, 880);
    // osc1.freq(freq);
    // console.log(freq);

    // var freq2 = map(diameter1, 0, width, 40, 880);
    // osc2.freq(freq2);
    // console.log(freq2);

    // var freq3 = map(diameter2 * 10, 0, width, 40, 880);
    // osc3.freq(freq3);
    // console.log(freq3);

    if (pose) {

        nx = pose.nose.x;
        ny = pose.nose.y;
        lex = pose.leftEye.x;
        ley = pose.leftEye.y;
        rex = pose.rightEye.x;
        rey = pose.rightEye.y;
        console.log(pose);

        background(32);

        for (var particleA = 0; particleA < mass.length; particleA++) {
            var accelerationX = 0,
                accelerationY = 0;

            for (var particleB = 0; particleB < mass.length; particleB++) {
                if (particleA != particleB) {
                    var distanceX = positionX[particleB] - positionX[particleA];
                    var distanceY = positionY[particleB] - positionY[particleA];

                    var distance = sqrt(distanceX * distanceX + distanceY * distanceY);
                    if (distance < 1) distance = 1;

                    var force = (distance - 320) * mass[particleB] / distance;
                    accelerationX += force * distanceX;
                    accelerationY += force * distanceY;
                }
            }

            velocityX[particleA] = velocityX[particleA] * 0.99 + accelerationX * mass[particleA];
            velocityY[particleA] = velocityY[particleA] * 0.99 + accelerationY * mass[particleA];
        }

        for (var particle = 0; particle < mass.length; particle++) {
            positionX[particle] += velocityX[particle];
            positionY[particle] += velocityY[particle];

            fill(255, 180, 0, 157);
            noStroke();

            ellipse(positionX[particle], positionY[particle], mass[particle] * 1000, mass[particle] * 1000);
        }

        if (diameter3 >= 20) {
            addNewParticle();
        }

        fill(144, 158, 85);
        stroke(144, 158, 85);
        ellipse(nx, ny, 10, 10);
        ellipse(lex, ley, 10, 10);
        ellipse(rex, rey, 10, 10);
        line(nx, ny, lex, ley);
        line(rex, rey, lex, ley);
        line(rex, rey, nx, ny);

        // filter(BLUR, random(5, 7));
    }
}


function mouseClicked() {
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
        console.log("getAudioContext().state" + getAudioContext().state);
    }
};

/////////////////////////////////////////////////////////////////////////////////////////////////////

function addNewParticle() {
    mass.push(random(0.003, 0.03));
    // positionX.push(map(nx, 0, width, 400, 1000));
    // positionY.push(map(ny, 0, height, 400, 1000));
    positionX.push(nx);
    positionY.push(ny);
    velocityX.push(0);
    velocityY.push(0);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function mouseClicked() {
    addNewParticle();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function mouseDragged() {
    addNewParticle();
}

//resource code:https://openprocessing.org/sketch/492096