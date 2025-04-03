import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  LinearProgress,
  CardHeader,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

// TensorFlow.js will be loaded dynamically
let tf = null;
let faceLandmarksDetection = null;

// Core emotion labels
const EMOTIONS = ['happy', 'sad', 'angry', 'surprised', 'neutral', 'focused'];

const RealTimeEmotionDetector = ({ onClose, onEmotionDetected }) => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);
  
  // State
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  
  // Load TensorFlow.js libraries from CDN for better compatibility
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        setIsLoading(true);
        
        // Load TensorFlow.js from CDN
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        
        // Get reference to global TF object
        tf = window.tf;
        console.log('TensorFlow.js loaded from CDN');
        
        // Initialize TensorFlow
        await tf.ready();
        console.log('TensorFlow.js ready');
        
        // Load face-landmarks-detection from CDN
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection@1.0.5/dist/face-landmarks-detection.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
        
        faceLandmarksDetection = window.faceLandmarksDetection;
        console.log('Face landmarks detection loaded');
        
        setIsLoading(false);
        
        // Initialize the face detector
        initDetector();
      } catch (err) {
        console.error('Failed to load libraries:', err);
        setError('Failed to load required libraries. Please refresh the page and try again.');
        setIsLoading(false);
      }
    };
    
    loadLibraries();
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      stopCamera();
    };
  }, []);
  
  // Initialize the face detection model
  const initDetector = async () => {
    try {
      setIsLoading(true);
      
      // Create the MediaPipe FaceMesh model
      detectorRef.current = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true, // Enable iris detection
          maxFaces: 1
        }
      );
      
      setIsLoading(false);
      
      // Start camera
      startCamera();
    } catch (err) {
      console.error('Error initializing detector:', err);
      setError('Failed to initialize face detection. Please refresh the page and try again.');
      setIsLoading(false);
    }
  };
  
  // Start camera and begin detection
  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Stop any existing streams
      if (streamRef.current) {
        stopCamera();
      }
      
      // Request camera with appropriate settings
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (!videoRef.current) {
        throw new Error('Video element not available');
      }
      
      // Set up video
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      
      // Set up canvas when video is ready
      videoRef.current.onloadedmetadata = () => {
        if (canvasRef.current) {
          canvasRef.current.width = videoRef.current.videoWidth;
          canvasRef.current.height = videoRef.current.videoHeight;
        }
      };
      
      // Start detection when playing
      videoRef.current.onplaying = () => {
        setIsLoading(false);
        setIsActive(true);
        requestAnimationFrame(detectFace);
      };
      
      // Try to play
      await videoRef.current.play();
    } catch (err) {
      console.error('Camera access error:', err);
      setError(`Unable to access camera: ${err.message}. Please check camera permissions.`);
      setIsLoading(false);
    }
  };
  
  // Stop the camera stream and detection
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    
    setIsActive(false);
  };
  
  // Main face detection loop
  const detectFace = async () => {
    if (!detectorRef.current || !videoRef.current || !canvasRef.current || !isActive) {
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Detect faces
      const faces = await detectorRef.current.estimateFaces(video);
      
      if (faces && faces.length > 0) {
        // Draw face landmarks and features on canvas
        drawFaceFeatures(ctx, faces[0]);
        
        // Analyze emotions based on facial landmarks
        const emotion = analyzeEmotion(faces[0]);
        setCurrentEmotion(emotion);
        
        // Report to parent component
        if (onEmotionDetected) {
          onEmotionDetected({
            emotion: emotion,
            timestamp: new Date(),
            timeString: new Date().toLocaleTimeString()
          });
        }
      } else {
        // Draw guide for positioning
        drawPositionGuide(ctx);
      }
    } catch (err) {
      console.error('Detection error:', err);
    }
    
    // Continue detection loop
    animationRef.current = requestAnimationFrame(detectFace);
  };
  
  // Draw guide for face positioning
  const drawPositionGuide = (ctx) => {
    const { width, height } = ctx.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Draw oval face outline
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, width * 0.15, height * 0.2, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add text instruction
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Position your face here', centerX, height - 30);
  };
  
  // Draw face landmarks and features
  const drawFaceFeatures = (ctx, face) => {
    if (!face || !face.keypoints) return;
    
    const keypoints = face.keypoints;
    
    // Extract important facial landmarks
    const leftEye = keypoints.find(kp => kp.name === 'leftEye');
    const rightEye = keypoints.find(kp => kp.name === 'rightEye');
    const nose = keypoints.find(kp => kp.name === 'noseTip');
    const mouthLeft = keypoints.find(kp => kp.name === 'mouthLeft');
    const mouthRight = keypoints.find(kp => kp.name === 'mouthRight');
    const leftIris = keypoints.find(kp => kp.name === 'leftEyeIris') || leftEye;
    const rightIris = keypoints.find(kp => kp.name === 'rightEyeIris') || rightEye;
    
    // 1. Draw face bounding box with enhanced styling
    if (face.box) {
      // Gradient border for the face box
      const gradient = ctx.createLinearGradient(
        face.box.xMin, 
        face.box.yMin, 
        face.box.xMin + face.box.width, 
        face.box.yMin + face.box.height
      );
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(0, 128, 255, 0.8)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(
        face.box.xMin, 
        face.box.yMin, 
        face.box.width, 
        face.box.height
      );
      ctx.stroke();
      
      // Add styled emotion label with background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      const labelText = currentEmotion.toUpperCase();
      const textMetrics = ctx.measureText(labelText);
      const labelPadding = 5;
      
      ctx.fillRect(
        face.box.xMin,
        face.box.yMin - 30,
        textMetrics.width + labelPadding * 2,
        25
      );
      
      // Add gradient text for emotion
      const textGradient = ctx.createLinearGradient(
        face.box.xMin, 
        face.box.yMin - 25, 
        face.box.xMin + textMetrics.width, 
        face.box.yMin - 5
      );
      textGradient.addColorStop(0, '#7df3ff');
      textGradient.addColorStop(1, '#00eeff');
      
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = textGradient;
      ctx.fillText(
        labelText, 
        face.box.xMin + labelPadding, 
        face.box.yMin - 10
      );
    }
    
    // 2. Draw enhanced wireframe connecting key points
    if (leftEye && rightEye && nose && mouthLeft && mouthRight) {
      // Connect eyes to nose with glow effect
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
      ctx.shadowBlur = 5;
      
      ctx.beginPath();
      ctx.moveTo(leftEye.x, leftEye.y);
      ctx.lineTo(nose.x, nose.y);
      ctx.lineTo(rightEye.x, rightEye.y);
      ctx.stroke();
      
      // Connect nose to mouth
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y);
      ctx.lineTo((mouthLeft.x + mouthRight.x) / 2, (mouthLeft.y + mouthRight.y) / 2);
      ctx.stroke();
      
      // Connect mouth corners with animation-like effect
      ctx.strokeStyle = 'rgba(255, 200, 200, 0.8)';
      ctx.beginPath();
      ctx.moveTo(mouthLeft.x, mouthLeft.y);
      ctx.lineTo(mouthRight.x, mouthRight.y);
      ctx.stroke();
      
      // Reset shadow for other elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
    
    // 3. Draw face model axis (head orientation) with enhanced visualization
    if (leftEye && rightEye && nose) {
      const eyeMidX = (leftEye.x + rightEye.x) / 2;
      const eyeMidY = (leftEye.y + rightEye.y) / 2;
      
      // Calculate head orientation
      const xDiff = rightEye.x - leftEye.x;
      const yDiff = rightEye.y - leftEye.y;
      const headTilt = Math.atan2(yDiff, xDiff);
      
      const axisLength = 60; // Slightly longer for better visibility
      
      // X-axis (red) with arrow
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y);
      ctx.lineTo(nose.x + axisLength, nose.y);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(nose.x + axisLength, nose.y);
      ctx.lineTo(nose.x + axisLength - 10, nose.y - 5);
      ctx.lineTo(nose.x + axisLength - 10, nose.y + 5);
      ctx.closePath();
      ctx.fillStyle = 'red';
      ctx.fill();
      
      // Y-axis (green) with arrow
      ctx.strokeStyle = 'green';
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y);
      ctx.lineTo(nose.x, nose.y + axisLength);
      ctx.stroke();
      
      // Arrow head
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y + axisLength);
      ctx.lineTo(nose.x - 5, nose.y + axisLength - 10);
      ctx.lineTo(nose.x + 5, nose.y + axisLength - 10);
      ctx.closePath();
      ctx.fillStyle = 'green';
      ctx.fill();
      
      // Z-axis (blue) with arrow - projects out from the face
      ctx.strokeStyle = 'blue';
      ctx.beginPath();
      ctx.moveTo(nose.x, nose.y);
      
      // Calculate Z endpoint based on head tilt
      const zEndX = nose.x - Math.sin(headTilt) * axisLength;
      const zEndY = nose.y - Math.cos(headTilt) * axisLength;
      
      ctx.lineTo(zEndX, zEndY);
      ctx.stroke();
      
      // Arrow head for Z-axis
      const zAngle = Math.atan2(nose.y - zEndY, nose.x - zEndX);
      ctx.beginPath();
      ctx.moveTo(zEndX, zEndY);
      ctx.lineTo(
        zEndX + Math.cos(zAngle - Math.PI/6) * 10,
        zEndY + Math.sin(zAngle - Math.PI/6) * 10
      );
      ctx.lineTo(
        zEndX + Math.cos(zAngle + Math.PI/6) * 10,
        zEndY + Math.sin(zAngle + Math.PI/6) * 10
      );
      ctx.closePath();
      ctx.fillStyle = 'blue';
      ctx.fill();
      
      // Add head tilt angle display
      const tiltDegrees = Math.round(headTilt * (180/Math.PI));
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText(
        `Head tilt: ${tiltDegrees}°`, 
        nose.x + 10, 
        nose.y + axisLength + 20
      );
    }
    
    // 4. Draw enhanced eye features with detailed gaze tracking
    if (leftEye && rightEye && leftIris && rightIris) {
      // Left eye outline with glow effect
      const eyeGradient = ctx.createRadialGradient(
        leftEye.x, leftEye.y, 5,
        leftEye.x, leftEye.y, 15
      );
      eyeGradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
      eyeGradient.addColorStop(1, 'rgba(0, 255, 255, 0.7)');
      
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
      ctx.fillStyle = eyeGradient;
      ctx.lineWidth = 1.5;
      
      // Left eye
      ctx.beginPath();
      ctx.ellipse(leftEye.x, leftEye.y, 18, 12, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Right eye
      const rightEyeGradient = ctx.createRadialGradient(
        rightEye.x, rightEye.y, 5,
        rightEye.x, rightEye.y, 15
      );
      rightEyeGradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
      rightEyeGradient.addColorStop(1, 'rgba(0, 255, 255, 0.7)');
      
      ctx.fillStyle = rightEyeGradient;
      ctx.beginPath();
      ctx.ellipse(rightEye.x, rightEye.y, 18, 12, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Draw iris with realistic gradient
      const irisRadius = 6;
      
      // Left iris gradient
      const leftIrisGradient = ctx.createRadialGradient(
        leftIris.x, leftIris.y, 1,
        leftIris.x, leftIris.y, irisRadius
      );
      leftIrisGradient.addColorStop(0, 'rgba(60, 160, 255, 0.9)');
      leftIrisGradient.addColorStop(0.8, 'rgba(0, 100, 255, 0.8)');
      leftIrisGradient.addColorStop(1, 'rgba(0, 60, 120, 0.8)');
      
      // Left iris
      ctx.fillStyle = leftIrisGradient;
      ctx.beginPath();
      ctx.arc(leftIris.x, leftIris.y, irisRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Right iris gradient
      const rightIrisGradient = ctx.createRadialGradient(
        rightIris.x, rightIris.y, 1,
        rightIris.x, rightIris.y, irisRadius
      );
      rightIrisGradient.addColorStop(0, 'rgba(60, 160, 255, 0.9)');
      rightIrisGradient.addColorStop(0.8, 'rgba(0, 100, 255, 0.8)');
      rightIrisGradient.addColorStop(1, 'rgba(0, 60, 120, 0.8)');
      
      // Right iris
      ctx.fillStyle = rightIrisGradient;
      ctx.beginPath();
      ctx.arc(rightIris.x, rightIris.y, irisRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Draw pupil with light reflection
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      
      // Left pupil
      ctx.beginPath();
      ctx.arc(leftIris.x, leftIris.y, irisRadius / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Light reflection on left pupil
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(leftIris.x - 1, leftIris.y - 1, irisRadius / 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Right pupil
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.beginPath();
      ctx.arc(rightIris.x, rightIris.y, irisRadius / 2, 0, 2 * Math.PI);
      ctx.fill();
      
      // Light reflection on right pupil
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(rightIris.x - 1, rightIris.y - 1, irisRadius / 6, 0, 2 * Math.PI);
      ctx.fill();
      
      // Calculate gaze direction with more precision
      const leftGazeX = leftIris.x - leftEye.x;
      const leftGazeY = leftIris.y - leftEye.y;
      const rightGazeX = rightIris.x - rightEye.x;
      const rightGazeY = rightIris.y - rightEye.y;
      
      // Average gaze direction
      const gazeX = (leftGazeX + rightGazeX) / 2;
      const gazeY = (leftGazeY + rightGazeY) / 2;
      
      // Calculate gaze angle
      const gazeAngle = Math.atan2(gazeY, gazeX) * (180 / Math.PI);
      const gazeIntensity = Math.sqrt(gazeX * gazeX + gazeY * gazeY);
      
      // Determine more detailed gaze direction
      let gazeDirection = "Center";
      let gazeColor = 'rgba(0, 255, 0, 0.8)';
      
      if (gazeIntensity > 3) {
        if (Math.abs(gazeX) > Math.abs(gazeY)) {
          gazeDirection = gazeX > 2 ? "Looking Right" : "Looking Left";
          gazeColor = 'rgba(255, 165, 0, 0.8)';
        } else {
          gazeDirection = gazeY > 2 ? "Looking Down" : "Looking Up";
          gazeColor = 'rgba(255, 165, 0, 0.8)';
        }
      }
      
      // Display enhanced gaze information with better UI
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(
        (leftEye.x + rightEye.x) / 2 - 60,
        Math.min(leftEye.y, rightEye.y) - 40, 
        120, 
        25
      );
      
      ctx.font = 'bold 14px Arial';
      ctx.fillStyle = gazeColor;
      ctx.textAlign = 'center';
      ctx.fillText(
        gazeDirection, 
        (leftEye.x + rightEye.x) / 2, 
        Math.min(leftEye.y, rightEye.y) - 22
      );
      
      // Draw gaze direction line
      if (gazeIntensity > 1) {
        const gazeLineLength = 30;
        const eyesMidX = (leftEye.x + rightEye.x) / 2;
        const eyesMidY = (leftEye.y + rightEye.y) / 2;
        
        ctx.strokeStyle = gazeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(eyesMidX, eyesMidY);
        ctx.lineTo(
          eyesMidX + gazeX * (gazeLineLength / gazeIntensity),
          eyesMidY + gazeY * (gazeLineLength / gazeIntensity)
        );
        ctx.stroke();
      }
    }
    
    // 5. Draw facial landmarks with enhanced visual effect
    keypoints.forEach(point => {
      if (point.score > 0.5) {
        // Create pulsing effect for points
        const size = 1.5 + Math.sin(Date.now() * 0.01) * 0.5;
        
        // Different colors for different facial regions
        let pointColor = 'rgba(255, 255, 255, 0.5)';
        
        // Check if point is part of specific facial features
        if (point.name && point.name.includes('eye')) {
          pointColor = 'rgba(0, 255, 255, 0.6)';
        } else if (point.name && point.name.includes('mouth')) {
          pointColor = 'rgba(255, 200, 200, 0.6)';
        } else if (point.name && point.name.includes('nose')) {
          pointColor = 'rgba(255, 255, 0, 0.6)';
        }
        
        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };
  
  // Analyze facial landmarks to determine emotion with improved algorithm
  const analyzeEmotion = (face) => {
    if (!face || !face.keypoints) {
      return 'neutral';
    }
    
    const keypoints = face.keypoints;
    
    // Extract key facial points with more detail
    const leftEye = keypoints.find(kp => kp.name === 'leftEye');
    const rightEye = keypoints.find(kp => kp.name === 'rightEye');
    const leftEyebrow = keypoints.find(kp => kp.name === 'leftEyebrowUpper') || 
                       keypoints.find(kp => kp.name === 'leftEyebrow');
    const rightEyebrow = keypoints.find(kp => kp.name === 'rightEyebrowUpper') || 
                        keypoints.find(kp => kp.name === 'rightEyebrow');
    const mouthLeft = keypoints.find(kp => kp.name === 'mouthLeft');
    const mouthRight = keypoints.find(kp => kp.name === 'mouthRight');
    const mouthCenter = keypoints.find(kp => kp.name === 'mouthCenter') || 
                       keypoints.find(kp => kp.name === 'lipsLowerCenter') || 
                       (mouthLeft && mouthRight ? 
                        {x: (mouthLeft.x + mouthRight.x) / 2, 
                         y: (mouthLeft.y + mouthRight.y) / 2} : null);
    const nose = keypoints.find(kp => kp.name === 'noseTip');
    
    // Check if we have enough keypoints for reliable detection
    if (!leftEye || !rightEye || !mouthLeft || !mouthRight) {
      return 'neutral';
    }
    
    // Calculate more facial metrics for better emotion analysis
    const eyeDistance = Math.sqrt(
      Math.pow(rightEye.x - leftEye.x, 2) + 
      Math.pow(rightEye.y - leftEye.y, 2)
    );
    
    const mouthWidth = Math.sqrt(
      Math.pow(mouthRight.x - mouthLeft.x, 2) + 
      Math.pow(mouthRight.y - mouthLeft.y, 2)
    );
    
    // Calculate eyebrow position relative to eyes if available
    let eyebrowEyeRatio = 0;
    if (leftEyebrow && rightEyebrow) {
      const leftEyebrowHeight = leftEye.y - leftEyebrow.y;
      const rightEyebrowHeight = rightEye.y - rightEyebrow.y;
      const avgEyebrowHeight = (leftEyebrowHeight + rightEyebrowHeight) / 2;
      eyebrowEyeRatio = avgEyebrowHeight / eyeDistance;
    }
    
    // Calculate mouth center position
    const mouthCenterPos = {
      x: (mouthLeft.x + mouthRight.x) / 2,
      y: (mouthLeft.y + mouthRight.y) / 2
    };
    
    // Calculate vertical distance from nose to mouth
    const noseToMouthDistance = nose ? Math.abs(nose.y - mouthCenterPos.y) : 0;
    const normalizedNoseToMouth = noseToMouthDistance / eyeDistance;
    
    // Normalize mouth width relative to eye distance
    const mouthEyeRatio = mouthWidth / eyeDistance;
    
    // Enhanced emotion detection with more nuanced rules
    
    // Happy - wide smile and relaxed eyebrows
    if (mouthEyeRatio > 0.7) {
      return 'happy';
    }
    
    // Surprised - raised eyebrows and open mouth
    if (eyebrowEyeRatio > 0.3 && mouthEyeRatio > 0.5) {
      return 'surprised';
    }
    
    // Sad - downturned mouth and lowered eyebrows
    if (mouthEyeRatio < 0.4 && normalizedNoseToMouth < 0.5) {
      return 'sad';
    }
    
    // Angry - lowered and drawn eyebrows, tight mouth
    if (eyebrowEyeRatio < 0.15 && mouthEyeRatio < 0.5) {
      return 'angry';
    }
    
    // Focused - neutral expression with steady gaze
    if (mouthEyeRatio > 0.4 && mouthEyeRatio < 0.6) {
      return 'focused';
    }
    
    // Default to neutral for other cases
    return 'neutral';
  };
  
  // Style definitions
  const videoContainerStyle = {
    position: 'relative',
    width: '100%',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#000'
  };
  
  const videoStyle = {
    width: '100%',
    display: 'block',
    transform: 'scaleX(-1)', // Mirror effect
    objectFit: 'cover'
  };
  
  const canvasStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transform: 'scaleX(-1)', // Mirror effect
    zIndex: 2
  };
  
  return (
    <Card 
      elevation={3} 
      sx={{ 
        maxWidth: 450, 
        margin: 'auto',
        overflow: 'hidden',
        borderRadius: 2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
      }}
    >
      <CardHeader
        title="Advanced Facial Emotion Analysis"
        titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }}
        action={
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        }
        sx={{ 
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white'
        }}
      />
      
      {isLoading && (
        <LinearProgress 
          sx={{ 
            height: 4, 
            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.2) 30%, rgba(33, 203, 243, 0.2) 90%)' 
          }} 
        />
      )}
      
      <Box 
        sx={{
          ...videoContainerStyle,
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)'
        }}
      >
        {error ? (
          <Box sx={{ 
            p: 3, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            height: 320,
            color: 'error.main',
            background: 'linear-gradient(rgba(0,0,0,0.02), rgba(0,0,0,0.06))'
          }}>
            <Typography variant="body2" gutterBottom>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={startCamera}
              sx={{ 
                mt: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
              }}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          <>
            <video 
              ref={videoRef}
              style={{
                ...videoStyle,
                minHeight: 320
              }}
              width="100%"
              height="auto"
              muted
              playsInline
            />
            <canvas 
              ref={canvasRef}
              style={canvasStyle}
            />
          </>
        )}
        
        {/* Camera controls with enhanced UI */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 0, 
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 3
        }}>
          {!isActive ? (
            <Button 
              variant="contained" 
              startIcon={<VideocamIcon />}
              onClick={startCamera}
              disabled={isLoading}
              sx={{ 
                px: 3,
                py: 1,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1E88E5 30%, #1CB5E0 90%)',
                }
              }}
            >
              Start Camera
            </Button>
          ) : (
            <Button 
              variant="contained" 
              color="error"
              startIcon={<VideocamOffIcon />}
              onClick={stopCamera}
              sx={{ 
                px: 3,
                py: 1,
                background: 'linear-gradient(45deg, #F44336 30%, #FF9800 90%)',
                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #E53935 30%, #FB8C00 90%)',
                }
              }}
            >
              Stop Camera
            </Button>
          )}
        </Box>
      </Box>
      
      <CardContent sx={{ pb: 2 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 1.5,
            p: 1,
            borderRadius: 2,
            background: 'linear-gradient(rgba(33, 150, 243, 0.05), rgba(33, 203, 243, 0.1))'
          }}
        >
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            sx={{ 
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Detected: {currentEmotion.toUpperCase()}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This advanced analysis shows facial landmarks, gaze direction, and head orientation in 
          real-time. For best results, ensure good lighting and position your face directly in 
          the frame.
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RealTimeEmotionDetector; 