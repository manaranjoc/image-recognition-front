import {useRef, useState, useEffect, useCallback} from 'react';
import styles from './Tagger.module.css'
import {listModels, uploadImage, uploadManifest} from '../../API/ImageAPI';
import {createManifest} from './Manifest';
import { useHistory } from 'react-router-dom';
import {getRandomInt} from '../../shared/utils/random';

const Tagger = () => {

  const [currentImage, setCurrentImage] = useState(0);
  const [boundingBox, setBoundingBox] = useState({width: undefined, height: undefined});
  const [imageSize, setImageSize] = useState({height: 0, width: 0, depth: 3})
  const [manifest, setManifest] = useState([]);
  const [imagesQty, setImagesQty] = useState(null);
  const [label, setLabel] = useState(null);
  const [isBoxMoving, setIsBoxMoving] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const imageContainer = useRef(null);
  const boundingBoxContainer = useRef(null);
  const imageInput = useRef(null);
  const labelInput = useRef(null);
  const history = useHistory();

  const updateCanvas = () => {
    const canvas = imageContainer.current;
    const context = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const image = new Image();
    const imageToLoad = imageInput.current.files[currentImage];

    image.onload = () => {
      setImageSize({...imageSize, height: image.height, width: image.width})
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(image.src);
    }

    image.src = URL.createObjectURL(imageToLoad);

  }

  const nextImage = async () => {
    const nextImage = currentImage + 1;
    const newManifest = createManifest(
      imageInput.current.files[currentImage].name,
      imageSize,
      boundingBox,
      label,
      boundingBoxContainer.current.height,
      boundingBoxContainer.current.width
    )

    await uploadImage(imageInput.current.files[currentImage]);
    if (nextImage < imageInput.current.files.length) {
      setCurrentImage(nextImage);
      setManifest([...manifest, newManifest])
    } else {
      await uploadManifest([...manifest, newManifest]);
      history.push('/');
    }
  }

  useEffect(() => {
    if(imageInput.current.files.length !== 0) {
      updateCanvas();
      const canvas = boundingBoxContainer.current
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [currentImage])

  const moveRectangle = useCallback((event) => {
    const canvas = boundingBoxContainer.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 0.5;
    context.fillStyle = 'blue';
    context.fillRect(boundingBox.x, boundingBox.y, x-boundingBox.x, y-boundingBox.y);
    context.globalAlpha = 1;
  }, [boundingBoxContainer, boundingBox]);

  const drawRectangle = (event) => {
    const canvas = boundingBoxContainer.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if(boundingBox.width === 0 || boundingBox.height === 0) {
      setIsBoxMoving(false);
      setBoundingBox({...boundingBox, width: x-boundingBox.x, height: y-boundingBox.y});
    } else {
      setBoundingBox({width: 0, height: 0, x, y});
      setIsBoxMoving(true);
    }

  };

  useEffect(() => {
    try {
      const boundingCanvas = boundingBoxContainer.current;

      if (isBoxMoving) {
        boundingCanvas.addEventListener("mousemove", moveRectangle);
      } else {
        boundingCanvas.removeEventListener("mousemove", moveRectangle);
      }
      return () => boundingCanvas.removeEventListener("mousemove", moveRectangle);
    } catch (error) {
      console.error(error);
    }
  }, [boundingBoxContainer, moveRectangle, isBoxMoving])

  useEffect(() => {
    const canvas = boundingBoxContainer.current;
    const context = canvas.getContext('2d');
    if( boundingBox.width !== 0 && boundingBox.height !== 0) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 0.5;
      context.fillStyle = 'blue';
      context.fillRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)
      context.globalAlpha = 1;
    }
  }, [boundingBox])

  const updateNameFiles = () => {
    setImagesQty(imageInput.current.files.length);
  }

  const startLabeling = async () => {
    const currentLabel = labelInput.current.value;
    const modelsResponse = await listModels();
    const isLabelUsed = modelsResponse.data.ProjectVersionDescriptions.some(
      (model) => model.ProjectVersionArn.match(/\/version\/(\w*)\//)[1] === currentLabel
    );

    if (isLabelUsed) {
      alert("Label is already in use");
    } else {
      setLabel(currentLabel === '' ? `Default${getRandomInt(0, 1000)}` : currentLabel);
      updateCanvas();
      setIsStarted(true);
    }
  }

  return (
    <div className={styles.customTagger}>
      <div className={styles.canvasContainer}>
        <canvas ref={boundingBoxContainer} className={styles.canvasBoundingBox} onClick={drawRectangle}>
          Not support for canvas tag
        </canvas>
        <canvas ref={imageContainer} className={styles.canvasImage}>
          Not support for canvas tag
        </canvas>
      </div>
      <div className={styles.form}>
        <label htmlFor="images" className={styles.fileUpload}>
          <input ref={imageInput}
                 accept="image/jpeg, image/png, image/jpg"
                 type="file"
                 name="images"
                 id="images"
                 multiple
                 className={styles.input}
                 onChange={updateNameFiles}
          />
          <span>
            {imagesQty <= 0 ? 'Select images' : `Images selected: ${imagesQty}`}
          </span>
        </label>
        {
          label ? <div className={styles.modelLabel}>Label: {label}</div> :
        <input type="text" placeholder="Label" className={styles.inputLabel} ref={labelInput}/>
        }
        <button onClick={startLabeling} className={styles.button} disabled={(imagesQty < 10 || isStarted)}>
          Start Labeling
        </button>
        <button onClick={nextImage} className={styles.button} disabled={(label === null || boundingBox.width === 0 || boundingBox.width === undefined)}>
          {currentImage === imagesQty-1 ? "Finish labeling" : "Next Image"}
        </button>
        <div className={styles.modelLabel}>
          {label !== null ? "Click two points in the image for making a bounding box" : null }
          {imagesQty<10 ? "Use at least 10 images to train your model" : null}
          <hr/>
          {(boundingBox.width === undefined || boundingBox.width === 0)? "No bounding box selected" : null}
        </div>
      </div>
    </div>
  )
}

export default Tagger;