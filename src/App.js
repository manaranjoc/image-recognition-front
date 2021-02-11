import './App.css';
import React, {useState} from "react";
import Form from "./components/Form";
import Image from "./components/Image"

function App() {
  const [image, setImage] = useState();
  const [imageLabels, setImageLabels] = useState();

  return (
    <div>
      <Image
          image={image}
          labels={imageLabels}
      />
      <Form
        setImage={setImage}
        setImageLabels={setImageLabels}
      />
    </div>
  );
}

export default App;
