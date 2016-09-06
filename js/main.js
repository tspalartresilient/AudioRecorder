// Copyright

/* Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// Call the Audio API of Html5
window.AudioContext = window.AudioContext || window.webkitAudioContext;

// Definition of all the var needed
// Define audioContext as a new object based on the API Object
var audioContext = new AudioContext();
// Set all it's value to null
var audioInput = null,
    realAudioInput = null,
    inputPoint = null,
    audioRecorder = null;
var rafID = null;
var analyserContext = null;
var canvasWidth, canvasHeight;
// Current rec number to save the audio file
var recIndex = 0;


/* TODO:

- offer mono option
- "Monitor input" switch
*/


// function which save the recording when clicking the second button
function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
}

// Function calling the draw buffer to display the last record
function gotBuffers( buffers ) {
    var canvas = document.getElementById( "wavedisplay" );

    drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

    // the ONLY time gotBuffers is called is right after a new recording is completed -
    // so here's where we should set up the download.
    audioRecorder.exportWAV( doneEncoding );
}

// Give the name to the current record so it can be save
function doneEncoding( blob ) {
    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;

    // Auto save line, comment if you want to test without getting recording save.
    // document.getElementById('save').click();
}

// This function is used to get the onclick element on the mic image
function toggleRecording( e ) {
    if (e.classList.contains("recording")) {
        // stop recording
            toastr.remove();
            toastr.success("<div>Are you sure you want to stop the recording ?</div><div><button type='button' id='okBtn' class='btn btn-primary' onclick='cancelStop()'>Cancel</button><button type='button' id='surpriseBtn' class='btn' style='margin: 0 8px 0 8px' onclick='validStop()'>Yes</button></div>");
        //

    } else {
        // start recording
        if (!audioRecorder)
            return;
        e.classList.add("recording");
        audioRecorder.clear();
        audioRecorder.record();
        document.getElementById("record").src = "/img/btn_record_active.png";
    }
}

// Validation button function for the stop recording toastr
function validStop() {
  var imid = document.getElementById( "record" );
  audioRecorder.stop();
  imid.classList.remove("recording");
  audioRecorder.getBuffers( gotBuffers );
  document.getElementById("record").src = "/img/btn_record_inactive.png";
  imid.classList.remove("chrono");
  Stop();
  toastr.remove();
}

// Cancel button function for the stop recording toastr
function cancelStop (){
  toastr.remove();
}

// Converting the stereo sound into a mono sound if required
function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
}

// Not find yet
function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
}

// Here is the analyser code, top canvas, display the current audio level
function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 3;
        var BAR_WIDTH = 2;
        var numBars = 1;
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData);

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;
        var maxDecibels = analyserNode.maxDecibels;
        var minDecibels = analyserNode.minDecibels;

        // // Draw rectangle for each frequency bin.
        // for (var i = 0; i < numBars; ++i) {
        //     var magnitude = 0;
        //     var offset = Math.floor( i * multiplier );
        //     // gotta sum/average the block, or we miss narrow-bandwidth spikes
        //     for (var j = 0; j< multiplier; j++)
        //         magnitude += freqByteData[offset + j];
        //     magnitude = magnitude / multiplier;
        //     var magnitude2 = freqByteData[i * multiplier];
        //     analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
        //     analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        // }

        // Draw a left to right rectangle to show average audio volume.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier * 5;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext.fillStyle = "hsl( " + 115 + ", 100%, 100%)";
            analyserContext.fillRect(0, 0, magnitude, canvasHeight);
        }

        // // Draw a rectangle for the average frequency.
        // for (var i = 0; i < numBars; ++i) {
        //     var magnitudemoy = 0;
        //     var magnitude = 0;
        //     var offset = Math.floor( i * multiplier );
        //     // gotta sum/average the block, or we miss narrow-bandwidth spikes
        //     for (var j = 0; j< multiplier; j++) {
        //         magnitude += freqByteData[j];
        //         magnitude = magnitude / multiplier;
        //           for (var i = 0; i < numBars; ++i) {
        //             magnitudemoy += magnitude / numBars;
        //           }
        //     }
        //     // var magnitude2 = freqByteData[i * multiplier];
        //     analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
        //     analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitudemoy);
        // }
    }

    rafID = window.requestAnimationFrame( updateAnalysers );
}

function toggleMono() {
    if (audioInput != realAudioInput) {
        audioInput.disconnect();
        realAudioInput.disconnect();
        audioInput = realAudioInput;
    } else {
        realAudioInput.disconnect();
        audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
}

// Recording function to get mic input.
function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
}

// All the end is the function required to acces the microphone
function initAudio() {
        if (!navigator.getUserMedia)
            navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        if (!navigator.cancelAnimationFrame)
            navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
        if (!navigator.requestAnimationFrame)
            navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
        {
            "audio": {
                "mandatory": {
                    "googEchoCancellation": "false",
                    "googAutoGainControl": "false",
                    "googNoiseSuppression": "false",
                    "googHighpassFilter": "false"
                },
                "optional": []
            },
        }, gotStream, function(e) {
            console.log(e);

            //
            $(document).ready(function() {
                toastr.remove();
                toastr.options = {
                  "timeOut": 0,
                  "extendedTimeOut": 0,
                  "tapToDismiss": false
                };
                toastr.options.closeButton = true;
                toastr.error("Error getting audio, please check your microphone's connection or the microphone setting of your current browser. <div><button type='button' id='surpriseBtn' class='btn' style='margin: 0 8px 0 8px' onclick='initAudio(), toastr.remove()'>Check Again</button></div>");
            });
            //
        });
}

// Launch the microphone detection and ask it's acces on load
window.addEventListener('load', initAudio );
