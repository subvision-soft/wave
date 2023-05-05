import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Camera.css";
import React, { useEffect } from "react";
import { Plugins } from "@capacitor/core";
import { CameraPreview } from "@capacitor-community/camera-preview";

const Camera: React.FC = () => {
  const [photo, setPhoto] = React.useState<any>(null);
  const [start, setStart] = React.useState<any>(null);

  const takePicture = async () => {
    const image = await CameraPreview.capture({ quality: 90 });
    setPhoto("data:image/jpeg;base64," + image.value);
  };
  useEffect(() => {
    CameraPreview.start({
      parent: "content",
      toBack: true,
      position: "rear",
    })
      .then(() => {
        setStart(true);
      })
      .catch((err) => {});
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        id="content"
        className="content-camera-preview"
        fullscreen
      ></IonContent>
    </IonPage>
  );
};

export default Camera;
