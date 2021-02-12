import styles from './App.module.css';
import React, {useState} from "react";
import Form from "./components/Form";
import Image from "./components/Image"

function App() {
  const [image, setImage] = useState();
  const [imageLabels, setImageLabels] = useState();

  return (
    <div className={styles.container}>
      <Image
          image={image}
          labels={imageLabels}
      />
      <Form
          imageLabels={imageLabels}
          setImage={setImage}
          setImageLabels={setImageLabels}
      />
    </div>
  );
}

export default App;
