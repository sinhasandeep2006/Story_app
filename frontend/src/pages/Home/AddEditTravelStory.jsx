import React, { useState } from 'react';
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md';
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import axiosInstance from '../../utils/axioslnstance';
import uploadImage from '../../utils/uploadImage';
import moment from 'moment';
import { toast } from 'react-toastify';

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
}) => {
    const [title, setTitle] = useState(storyInfo?.title || "");
    const [storeImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
    const [story, setStroy] = useState(storyInfo?.story || "");
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || null);
    const [error, setError] = useState("");

    const addNewTravelStory = async () => {
        try {
            let imageUrl = "";
            if (storeImg) {
                const imgUploadRes = await uploadImage(storeImg);
                imageUrl = imgUploadRes.imageUrl || "";
            }
            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,
                imageUrl,
                visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            });
            if (response.data && response.data.story) {
                toast.success("Story added successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            if(error.response&&
                error.response.data&&
                error.response.data.message
            )
            setError(
                error.response?.data?.message || "An unexpected error occurred"
            );else{
                setError("An unexpected error occurred")
            };
        }
    };

    const updateTravelStory = async () => {
        const storyId = storyInfo._id;
        try {
            let imageUrl = "";
            let postData = {
                title,
                story,
                imageUrl: storyInfo.imageUrl || "",
                visitedLocation,
                visitedDate: visitedDate
                    ? moment(visitedDate).valueOf()
                    : moment().valueOf(),
            };
            if (typeof storeImg === "object") {
                const imgUploadRes = await uploadImage(storeImg);
                imageUrl = imgUploadRes.imageUrl || "";
                postData = { ...postData, imageUrl };
            }
            const response = await axiosInstance.put(`/edit-story/${storyId}`, postData);
            if (response.data && response.data.story) {
                toast.success("Story updated successfully");
                getAllTravelStories();
                onClose();
            }
        } catch (error) {
            if(error.response&&
                error.response.data&&
                error.response.data.message
            )
            setError(
                error.response?.data?.message || "An unexpected error occurred"
            );else{
                setError("An unexpected error occurred")
            };
        }
    };

    const handleAddorUpdateClick = () => {
        if (!title) {
            setError("Please enter the title");
            return;
        }
        if (!story) {
            setError("Please enter the story");
            return;
        }
        setError("");
        if (type === "edit") {
            updateTravelStory();
        } else {
            addNewTravelStory();
        }
    };

    const handleDeleteStoryImg = async () => {
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params: {
                imageUrl: storyInfo.imageUrl,
            },
        });
        if (deleteImgRes.data) {
            const storyId = storyInfo._id;
            const postData = {
                title,
                story,
                visitedLocation,
                visitedDate: moment().valueOf(),
                imageUrl: "",
            };
            
            await axiosInstance.put(`/edit-story/${storyId}`, postData);
            setStoryImg(null);
        }
    };

    return (
        <div className="relative max-w-screen-sm mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg sm:text-xl font-medium text-slate-700">
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>
                <div className="flex items-center gap-3">
                    {type === "add" ? (
                        <button className="btn-small" onClick={handleAddorUpdateClick}>
                            <MdAdd className="text-lg" /> Add Story
                        </button>
                    ) : (
                        <button className="btn-small" onClick={handleAddorUpdateClick}>
                            <MdUpdate className="text-lg" /> Update Story
                        </button>
                    )}
                    <button className="p-1" onClick={onClose}>
                        <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>
            </div>
            {error && (
                <p className="text-red-500 text-xs text-right mb-2">{error}</p>
            )}
            <div className="flex flex-col gap-4">
                <div>
                    <label className="input-label">Title</label>
                    <input
                        type="text"
                        className="w-full text-sm sm:text-base text-slate-950 p-2 border border-gray-300 rounded"
                        placeholder="A Day at..."
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <DateSelector date={visitedDate} setDate={setVisitedDate} />
                <ImageSelector
                    image={storeImg}
                    setImage={setStoryImg}
                    handleDeleteImg={handleDeleteStoryImg}
                />
                <div>
                    <label className="input-label">Story</label>
                    <textarea
                        className="w-full text-sm sm:text-base text-slate-950 p-2 border border-gray-300 rounded"
                        placeholder="Your story"
                        rows={5}
                        value={story}
                        onChange={({ target }) => setStroy(target.value)}
                    />
                </div>
                <div>
                    <label className="input-label">Visited Locations</label>
                    <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
                </div>
            </div>
        </div>
    );
};

export default AddEditTravelStory;
