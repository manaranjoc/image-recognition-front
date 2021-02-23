const createManifest = (imageName, imageSize, boundingBox, label, height, width) => {
  const realBoundingBox = {
    top: Math.floor(boundingBox.y * imageSize.height / height),
    left: Math.floor(boundingBox.x * imageSize.width / width),
    width: Math.floor(boundingBox.width * imageSize.width / width),
    height: Math.floor(boundingBox.height * imageSize.height / height),
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