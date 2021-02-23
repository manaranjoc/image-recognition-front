import {useRef, useState, useEffect, useCallback} from 'react';
import styles from './Tagger.module.css'
import {uploadImage, uploadManifest} from '../../API/ImageAPI';
import {createManifest} from './Manifest';

const Tagger = () => {

  const [currentImage, setCurrentImage] = useState(0);
  const [boundingBox, setBoundingBox] = useState({width: undefined, height: undefined});
  const [imageSize, setImageSize] = useState({height: 0, width: 0, depth: 3})
  const [manifest, setManifest] = useState([]);
  const [images, setImages] = useState([]);
  const [label, setLabel] = useState(null);
  const imageContainer = useRef(null);
  const boundingBoxContainer = useRef(null);
  const imageInput = useRef(null);
  const labelInput = useRef(null);

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
      'test',
      boundingBoxContainer.current.height,
      boundingBoxContainer.current.width
    )
    console.log(imageInput.current.files[currentImage]);
    await uploadImage(imageInput.current.files[currentImage]);
    if (nextImage < imageInput.current.files.length) {
      setCurrentImage(nextImage);
      setManifest([...manifest, newManifest])
    } else {
      await uploadManifest([...manifest, newManifest]);
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

  const drawRectangle = (event) => {
    const canvas = boundingBoxContainer.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    console.log("clicking")

    if(boundingBox.width === 0 || boundingBox.height === 0) {
      setBoundingBox({...boundingBox, width: x-boundingBox.x, height: y-boundingBox.y})
    } else {
      setBoundingBox({width: 0, height: 0, x, y})
    }

  };

  useEffect(() => {
    const context = boundingBoxContainer.current.getContext('2d');
    if( boundingBox.width !== 0 && boundingBox.height !== 0) {
      context.clearRect(0, 0, 300, 300);
      context.globalAlpha = 0.5;
      context.fillStyle = 'blue';
      context.fillRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height)
      context.globalAlpha = 1;
    }
  }, [boundingBox])

  const updateNameFiles = () => {
    setImages(imageInput.current.files);
  }

  const startLabeling = () => {
    updateCanvas();
    const currentLabel = labelInput.current.value;
    setLabel(currentLabel === '' ? 'Default' : currentLabel);
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
            {images.length === 0 ? 'Select images' : `Images selected: ${images.length}`}
          </span>
        </label>
        {
          label ? <div className={styles.modelLabel}>Label: {label}</div> :
        <input type="text" placeholder="Label" className={styles.inputLabel} ref={labelInput}/>
        }
        <button onClick={startLabeling} className={styles.button} disabled={images.length === 0}>
          Start Labeling
        </button>
        <button onClick={nextImage} className={styles.button} disabled={label === null}>
          {currentImage <= images.length ? "Next Image" : "Finish labeling"}
        </button>
        {label !== null ? <div className={styles.modelLabel}>Click two points in the image for making a bounding box</div> : null }
      </div>
    </div>
  )
}

export default Tagger;