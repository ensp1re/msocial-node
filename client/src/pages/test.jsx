import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAnO1e-V0-BHeyDG3ZCWCweifMohFYtUPQ",
  authDomain: "m-chat-529a8.firebaseapp.com",
  projectId: "m-chat-529a8",
  storageBucket: "m-chat-529a8.appspot.com",
  messagingSenderId: "619744580225",
  appId: "1:619744580225:web:dd6f4ed03a3f787d84b380",
  measurementId: "G-QF2KPBQ9PW"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function FileUploader() {
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    
    const storageRef = ref(storage, 'files/' + file.name);
    await uploadBytes(storageRef, file);
    console.log('File uploaded successfully');

    const url = await getDownloadURL(storageRef);
    console.log('File URL:', url);
    setDownloadURL(url);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {downloadURL && <p>File URL: {downloadURL}</p>}
    </div>
  );
}

export default FileUploader;
