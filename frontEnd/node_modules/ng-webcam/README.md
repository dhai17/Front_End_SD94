# NgWebCam

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.2.0.
A simple Angular library to support webcam audio/video access, with camera feature, and an edge for Machine learning

## Input Parameters are as follows

### mediaOptions 
Pass User media parameters. eg: { video: { width: 1280, height: 720 } }

### enableAudio
If with webcam, you want to access audio too. It is of boolean type. Use this when not providing mediaOptions Input. eg: true

### frameRate
This is to configure frame rate of user media. Use this when not providing mediaOptions Input. eg: { max: 30 }

### height
This is to configure height(In pixel) of user media. Use this when not providing mediaOptions Input. eg: 700

### width
This is to configure width(In pixel) of user media. Use this when not providing mediaOptions Input. eg: 1200

### mimeType
Captured image file type. eg: 'image/png'

### triggerCapture
Of type Observable<void>. This parameter is used capture image from current webcam element.

### webCamControl
Of type Observable<boolean>. This parameter allows you to stop and start the video stream.

## Output parameters are as follows

### capturedImage
This emits captured image source(of type mentioned in mimeType Input parameter, it defaults to 'image/png'). Use this to set the src of any image tag in your App.

### webCamElement
This emits video tag of user media. This is helpful if you are trying do to machine learning stuff with user gesture or training data based on user feed.

### handleError
Listen to this emitter for any possible error.

Enjoy Building !!
