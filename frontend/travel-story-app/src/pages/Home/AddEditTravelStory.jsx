import React, { useState } from "react";
import { MdAdd, MdUpdate, MdClose } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector.jsx";
import ImageSelector from "../../components/Input/ImageSelector.jsx";
import TagInput from "../../components/Input/TagInput.jsx";
import { toast } from "react-toastify";
import { format, getTime } from "date-fns";
import uploadImage from "../../utils/uploadImage.js";
import axiosInstance from "../../utils/axiosInstance";

const AddEditTravelStory = ({
  storyInfo = {},
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [visitedDate, setVisitedDate] = useState(
    storyInfo?.visitedDate ? new Date(storyInfo.visitedDate) : new Date()
  );
  const [error, setError] = useState("");
  const [visitedLocation, setVisitedLocation] = useState(
    storyInfo?.visitedLocation || []
  );
  const [story, setStory] = useState(storyInfo?.story || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);

  const addNewTravelStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";
      }
      console.log("Posting to backend:", axiosInstance.defaults.baseURL);

      const response = await axiosInstance.post("/add-travel-story", {
        title,
        story,
        imageUrl,
        visitedLocation,
        visitedDate: getTime(visitedDate),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to add story");
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
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
        visitedDate: getTime(visitedDate),
      };
      if (storyImg && typeof storyImg === "object") {
        // Upload New Image
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";

        postData = {
          ...postData,
          imageUrl: imageUrl,
        };
      }

      console.log("Posting to backend:", axiosInstance.defaults.baseURL);

      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        getAllTravelStories();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to add story");

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  };

  const handleAddOrUpdateClick = () => {
    if (!title.trim()) {
      setError("Please enter the title");
      return;
    }
    if (!story.trim()) {
      setError("Please enter the story");
      return;
    }
    setError("");

    if (type === "edit") updateTravelStory();
    else addNewTravelStory();
  };

  //Delete story image and update the story
  const handleDeleteStoryImg = async () => {
    // Deleting the Image
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
        visitedDate: getTime(visitedDate),
        imageUrl: "",
      };

      // Updating story
      const response = await axiosInstance.put(
        "/edit-story/" + storyId,
        postData
      );
      storyInfo.imageUrl = "";
      setStoryImg(null);
    }
  };

  return (
    <div className=" relative p-4 max-w-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add a Story" : "Update Story"}
        </h5>

        <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
          <button className="btn-small" onClick={handleAddOrUpdateClick}>
            {type === "add" ? (
              <>
                <MdAdd className="text-lg" /> ADD STORY
              </>
            ) : (
              <>
                <MdUpdate className="text-lg" /> UPDATE STORY
              </>
            )}
          </button>
          <button onClick={onClose}>
            <MdClose className="text-xl text-slate-400" />
          </button>
        </div>
      </div>

      {/* Title Input */}
      <div className="flex-1 flex flex-col gap-2 pt-6">
        <label className="text-sm text-gray-600">Title</label>
        <input
          type="text"
          className="text-lg border border-slate-300 px-4 py-2 rounded outline-none focus:ring-2 focus:ring-cyan-300"
          placeholder="A Day at the Great Wall"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Date Selector */}
      <div className="flex flex-col gap-2 pt-4">
        <label className="text-sm text-gray-600">Visited Date</label>
        <DateSelector date={visitedDate} setDate={setVisitedDate} />
      </div>

      {/* Image Selector */}
      <div className="flex flex-col gap-2 pt-4">
        <label className="text-sm text-gray-600">Image</label>
        <ImageSelector image={storyImg} setImage={setStoryImg} />
      </div>

      {/* Story Textarea */}
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm text-gray-600">Story</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
          placeholder="Your Story"
          rows={10}
          value={story}
          onChange={({ target }) => setStory(target.value)}
        />
      </div>

      {/* Tag Input */}
      <div className="pt-3">
        <label className="input-label">VISITED LOCATIONS</label>
        <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
      </div>

      {/* Error Message - Final and Visible */}
      {error && <p className="text-red-500 text-sm mt-4 text-right">{error}</p>}
    </div>
  );
};

export default AddEditTravelStory;
