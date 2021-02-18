const createManifest = (imageName, imageSize, boundingBox, label) => {
  const realBoundingBox = {
    top: boundingBox.y * imageSize.height / 300,
    left: boundingBox.x * imageSize.width / 300,
    width: boundingBox.width * imageSize.width / 300,
    height: boundingBox.height * imageSize.height / 300,
  }
  return {
    "source-ref": `s3://BUCKET/images/${imageName}`,
    "bounding-box": {
      "image_size": [imageSize],
      "annotations": [{
        "class_id": 0,
        ...realBoundingBox
      }]
    },
    "bounding-box-metadata": {
      "objects": [{
        "confidence": 1
      }],
      "class-map": {
        "0": label,
      },
      "type": "groundtruth/object-detection",
      "human-annotated": "yes",
      "creation-date": "2013-11-18T02:53:27",
      "job-name": label
    }
  }
}

export { createManifest };