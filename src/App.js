import { Button, Progress } from "antd";
import axios from "axios";

import React, {useState} from "react";
import "./styles.css";
import {
  useRecordWebcam,
  CAMERA_STATUS
} from "react-record-webcam";

const OPTIONS = {
  filename: "test-filename",
  fileType: "mp4",
  width: 620,
  height: 500,
  facingMode: "user"
};


export default function App(){

  // const BASE_URL 
  console.log("process.env", process.env)
  const {REACT_APP_BASE_API_URL, REACT_APP_CLOUDINARY_UPLOAD_PRESET, REACT_APP_CLOUDINARY_CLOUD_NAME, REACT_APP_CLOUDINARY_API_KEY} = process.env;

  const recordWebcam = useRecordWebcam(OPTIONS);
  const [uploadPercetage, setUploadPercentage] = useState(0);

  // console.log("recordWebcam", recordWebcam)

  const submitRecordings = async () => {
    const blob = await recordWebcam.getRecording();
    let saving_time = new Date().getTime(); 
    console.log("saving_time : " + saving_time);
    // console.log(process.env.REACT_APP_WEBCAM_VIDEO_RECORDING);
    let fileName = "WebcamRecording_" + saving_time + ".mp4"
    const file = new File([blob], fileName, { lastModified: saving_time, type: blob.type } );

    const instance = axios.create()

    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        setUploadPercentage(percent);
      },
    };
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", REACT_APP_CLOUDINARY_CLOUD_NAME);
    formData.append("api_key", REACT_APP_CLOUDINARY_API_KEY);
    // formData.append("api_key", "CLOUDINARY_URL=cloudinary://447637346711745:KoUMtYiKu4DymV7ygpBnbwQ7I0E@shubjain")

    const cloudnaryUrl = `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_CLOUD_NAME}/video/upload`;
    const cloudinaryResponse = await instance.post(cloudnaryUrl, formData, options)
    console.log("cloudnaryResponse", cloudinaryResponse.data);
    const videoUrl = cloudinaryResponse.data.url;

    // Client fetch api to post all webcam recording to server db
    const uploadResponse = await axios.post(`${REACT_APP_BASE_API_URL}/api/upload_recording`, { name: fileName, dateModified: saving_time, url: videoUrl})
          
  };



 return (
  <div className="container">
    {/* <div className="webcam_recording_status">
        <span>React Webcam Recording</span>
        <p>Camera status: {recordWebcam.status}</p>
    </div> */}
    <div className="webcam-layout">
      
      <div className="open-close-camera">
        <Button
          style={{margin: "20px"}}
          disabled={
            recordWebcam.status === CAMERA_STATUS.OPEN ||
            recordWebcam.status === CAMERA_STATUS.RECORDING ||
            recordWebcam.status === CAMERA_STATUS.PREVIEW
          }
          type="primary"
          shape="round"
          size="large"
          onClick={recordWebcam.open}>
            Open Camera
        </Button>

        <Button
          style={{margin: "20px"}}
          disabled={
            recordWebcam.status === CAMERA_STATUS.CLOSED ||
            recordWebcam.status === CAMERA_STATUS.PREVIEW
          }
          type="primary"
          shape="round"
          size="large"
          onClick={recordWebcam.close}>
            Close Camera
        </Button>
        
      </div>

      <video
        ref={recordWebcam.webcamRef}
        style={{
          display: `${
            recordWebcam.status === CAMERA_STATUS.OPEN ||
            recordWebcam.status === CAMERA_STATUS.RECORDING
              ? "block"
              : "none"
          }`
        }}
        autoPlay
        muted
      />
      <div className="recorded-video">
        <video
          ref={recordWebcam.previewRef}
          style={{
            display: `${
              recordWebcam.status === CAMERA_STATUS.PREVIEW ? "block" : "none"
            }`,
            width: "100%"
          }}
          controls
        />
      </div>
      {
        recordWebcam.status === CAMERA_STATUS.OPEN ||
        recordWebcam.status === CAMERA_STATUS.RECORDING ||
        recordWebcam.status === CAMERA_STATUS.PREVIEW ? (
          <div>
              <div className="record-stop-btn">
            <Button
              disabled={
                recordWebcam.status === CAMERA_STATUS.CLOSED ||
                    recordWebcam.status === CAMERA_STATUS.RECORDING ||
                    recordWebcam.status === CAMERA_STATUS.PREVIEW
              }
              type="primary"
              shape="round"
              size="large"
              onClick={recordWebcam.start}>
                Start Recording
            </Button>
            <Button
              disabled={recordWebcam.status !== CAMERA_STATUS.RECORDING}
              type="primary"
              shape="round"
              size="large"
              onClick={recordWebcam.stop}>
                Stop Recording
            </Button>
            <Button
              type="primary"
              shape="round"
              size="large"
              disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
              onClick={recordWebcam.retake}>
                Retake
            </Button>
            <Button
              type="primary"
              shape="round"
              size="large"
              disabled={recordWebcam.status !== CAMERA_STATUS.PREVIEW}
              onClick={submitRecordings}>
                Submit Recording
            </Button>
            
          </div>
          <div className="progress-bar">
            <Progress type="circle" style={{alignItems: "center"}} percent={uploadPercetage} />
          </div>      
        </div>  
        ) : null
      }
      
     
    </div>
  </div>
 )
}