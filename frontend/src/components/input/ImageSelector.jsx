import React, { useEffect, useRef, useState } from 'react'
import { FaRegFileImage } from "react-icons/fa"
import { MdDeleteOutline } from 'react-icons/md'

const ImageSelector = ({ image, setImage,handleDeleteImg }) => {
  const inputRef = useRef(null)
  const [previewUrl, setPreviewurl] = useState(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file)
    }
  }
  const onChoseFile = () => {
    inputRef.current.click()
  }
  const handleRemoveImage =()=>{
    setImage(null)
    handleDeleteImg()
  }
  useEffect(() => {
    if (typeof image === 'string') {
      setPreviewurl(image);
    } else if (image) {
      setPreviewurl(URL.createObjectURL(image))
    }
    else {
      setPreviewurl(null)
    }
    return () => {
      if (previewUrl && typeof previewUrl === 'string' && !image) {
        URL.revokeObjectURL(previewUrl);
      }
    }
  }, [image])
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden" />
      {!image ? <button
        className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border-slate-200/50"
        onClick={() => onChoseFile()}>
        <div className="w-14 h-14 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100">
          <FaRegFileImage className="text-xl text-cyan-500" />
        </div>
        <p className="test-sm text-slate-500 "> Browse image to upload </p>
      </button> :
        <div className="w-full relative">
          <img src={previewUrl} alt="Selected"
            className="w-full h-[300px] object-cover rounded-lg" />
          <button className="btn-small btn-delete absolute top-2 right-2"
          onClick={handleRemoveImage}>
            <MdDeleteOutline className="text-lg"/>
          </button>
        </div>
      }

    </div>
  )
}

export default ImageSelector
