import React, { useState } from 'react'
import { MdAdd,MdClose, MdUpdate,MdDeleteOutline } from 'react-icons/md';
import DateSelector from '../../components/input/DateSelector';
import ImageSelector from '../../components/input/ImageSelector';
import TagInput from '../../components/input/TagInput';
import axiosInstance from '../../utils/axiosinstance';
import { toast } from 'react-toastify';
import uploadImage from '../../utils/uploadImage';
import moment from 'moment';

const AddEditTravelStory = ({storyInfo,
    type, onClose, getAllTravelStories,
}) => {

  const [dateVisited, setDateVisited] = useState(storyInfo?.dateVisited || null);
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [story, setStory] = useState(storyInfo?.details || "");
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [locationsVisited, setLocationsVisited] = useState(storyInfo?.locationsVisited || []);

  const [error,setError] = useState("");

  const addNewTravelStory = async () => {
    try{
      let imageUrl = "";
      if(storyImg instanceof File){
        const imageUploadRes = await uploadImage(storyImg);
        imageUrl = imageUploadRes.imageUrl || "";
      } else if (typeof storyImg === "string") {
        imageUrl=storyImg;
      }

      const response = await axiosInstance.post("/add-travel",{
        title, details: story,
        imageUrl: imageUrl || "",
        locationsVisited,
        dateVisited: dateVisited ? moment(dateVisited).valueOf() : moment().valueOf(),
      });
      if (response.data && response.data.details){
        toast.success("Story Added Successfully");

        getAllTravelStories();
        onClose();
      }
    } catch (error){
      if (error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("An unexpected error occured, Please try again.");
      }
    }
  };
  const updateTravelStory = async () => {

    const storyId = storyInfo._id;
    try{
      let imageUrl = "";

      let postData = {
        title, details: story,
        imageUrl: storyInfo.imageUrl || "",
        locationsVisited,
        dateVisited: dateVisited ? moment(dateVisited).valueOf() : moment().valueOf(),
      }
      if (typeof storyImg==="object"){
        const imgUploadRes = await uploadImage(storyImg);
        imageUrl = imgUploadRes.imageUrl || "";

        postData = {
          ...postData,
          imageUrl: imageUrl,
        };
      }

      const response = await axiosInstance.put("/edit-travel/" + storyId, postData);
      if (response.data && response.data.details){
        toast.success("Story Updated Successfully");

        getAllTravelStories();
        onClose();
      }
    } catch (error){
      if (error.response && error.response.data && error.response.data.message){
        setError(error.response.data.message);
      }
      else{
        setError("An unexpected error occured, Please try again.");
      }
    }
  };
  const handleAddOrUpdateClick = () => {
    console.log("Input Data:",{title, storyImg,story,locationsVisited,dateVisited});

    if(!title){
      setError("Please enter the title");
      return;
    }
    if(!story){
      setError("Please enter the story");
      return;
    }
    setError("");
    
    if (type === "edit"){;
      updateTravelStory()
    }
    else{
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
        details: story,
        locationsVisited,
        dateVisited: moment().valueOf(),
        imageUrl: "",
      };

      const response = await axiosInstance.put(
        "edit-travel/" + storyId,
        postData
      );
      setStoryImg(null);
    }
  };
  return (
    <div className='relative'>
      <div className='flex items-center justify-between'>
        <h5 className='text-xl font-medium text-slate-700'>
            {type === "add" ? "Add Story" : "Update Story"}
        </h5>
        <div>
            <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                {type === 'add' ? (<button className='btn-small' onClick={handleAddOrUpdateClick}>
                    <MdAdd className='text-lg'></MdAdd>
                    ADD STORY
                </button>) : (<>
                <button className='btn-small cursor-pointer' onClick={handleAddOrUpdateClick}>
                    <MdUpdate className='text-lg'></MdUpdate> UPDATE STORY
                </button>
                </>)}

                <button className='btn-small btn-delete cursor-pointer' onClick={onClose}>
                    <MdDeleteOutline className='text-lg'></MdDeleteOutline>DELETE
                </button>
                <button className='' onClick={onClose}>
                    <MdClose className='text-xl text-slate-400 cursor-pointer'></MdClose>
                </button>
            </div>
            {error && (
              <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
            )}
        </div>
      </div>
      
      <div>
        <div className='flex-1 flex flex-col gap-2 pt-4'>
          <label className='input-label'>TITLE</label>
          <input
          type='text'
          className='text-2xl text-slate-950 outline-none'
          placeholder='A Day Well Spent at....'
          value={title}
          onChange={({target}) => setTitle(target.value)}></input>
          <div className='my-3'>
            <DateSelector date={dateVisited} setDate={setDateVisited}/>
          </div>

          <ImageSelector image={storyImg} setImage={setStoryImg}
          handleDeleteImg={handleDeleteStoryImg}></ImageSelector>

          <div className='flex flex-col gap-2 mt-4'>
          <label className='input-label'>STORY</label>
          <textarea type="text" className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder='Your Story'
          rows={10}
          value={story}
          onChange={({target})=> setStory(target.value)}></textarea>
          </div>

          <div className='pt-3'>
            <label className='input-label'>VISITED LOCATIONS</label>
            <TagInput tags={locationsVisited} setTags={setLocationsVisited}></TagInput>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditTravelStory
