import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axioslnstance'
import Modal from 'react-modal'
import TravelStoryCard from '../../components/Cards/TravelStroyCard'
import AddEditTravelStory from './AddEditTravelStory'
import { MdAdd } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ViewTravelStory from './ViewTravelStory'
import EmptyCard from '../../components/Cards/EmptyCard'
import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import { getEmptyCardMessage,getEmptyCardImg } from '../../utils/helper'
function Home() {
  const navigate = useNavigate()
  const [userInfo, setuserInfo] = useState(null)
  const [allstories, setAllStories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")
  const [dateRange, setDateRange] = useState({ form: null, to: null })
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null
  })
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null
  })
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user")
      if (response.data && response.data.user) {
        setuserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  }
  //get all the travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-the-travel-story")
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("An unexpected error oucerred. Pleses try again.")
    }
  }
  const handleEdit = (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }
  const handelViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }
  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id;
    try {
      const response = await axiosInstance.put(
        "/update-is-favourite/" + storyId, {
        isFavourite: !storyData.isFavourite,
      }
      )
      if (response.data && response.data.story) {
        toast.success("Story Update Successfully")
        if (filterType == "search" && searchQuery) {
          onSearchStory(searchQuery);

        } else if (filterType === "date") {
          filterStoriesByDate(dateRange)
        } else {
          getAllTravelStories();
        }
      }
    } catch (error) {
      console.log("An unexprected error occured. Please try again")
    }
  }
  const deleteTravelStory = async (data) => {
    const storyId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-story/" + storyId)
      if (response.data && !response.data.error) {
        toast.error("story is deleted sucessfully")
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
        getAllTravelStories()
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "An unexpected error occurred"
      );
    }
  }

  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/search", {
        params: {
          query,
        },
      })
      if (response.data && response.data.stories) {
        setFilterType("search")
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("error")
    }
  }


  const handleClearSearch = () => {
    setFilterType("")
    getAllTravelStories()
  }
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null
      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-stories/filter", {
          params: {
            startDate,
            endDate
          }
        })
        if (response.data && response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("error pls try later")
    }
  }
  const handleDayClick = (day) => {
    setDateRange(day);

    filterStoriesByDate(day);

  };
  const resetFilter = () => {
    setDateRange({ from: null, to: null })
    setFilterType("")
    getAllTravelStories()
  }

  useEffect(() => {
    getAllTravelStories()
    getUserInfo();
    return () => { }
  }, [])
  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">

        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter()
          }}
        />
        <div className="flex gap-7">
          <div className="flex-1">
            {allstories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allstories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imageUrl={item.imageUrl}  // Make sure this is correct
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavourite={item.isFavourite}

                      onClick={() => handelViewStory(item)}
                      onFavouriteClick={() => updateIsFavourite(item)}
                    />
                  )

                })}
              </div>
            ) : (
              <EmptyCard
                imgSrc={getEmptyCardImg(filterType)}
                message={getEmptyCardMessage(filterType)}
                
              />

            )}
          </div>
          <div className="w-[350px]">
            <div className="bg-white border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
              <div className="p-3 ">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,

          }
        }}
        appElement={document.getElementById("root")}
        className="model-box">
        <AddEditTravelStory

          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => { setOpenAddEditModal({ isShown: false, type: "add", data: null }) }
          }
          getAllTravelStories={getAllTravelStories} />
      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,

          }
        }}
        appElement={document.getElementById("root")}
        className="model-box">
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((preState) => ({ ...preState, isShown: false }))
          }}
          onEditClick={() => {
            setOpenViewModal((preState) => ({ ...preState, isShown: false }))
            handleEdit(openViewModal.data || null)
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null)
          }} />
      </Modal>
      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}>
        <MdAdd className="text-[32px] text-white" />

      </button>

      <ToastContainer />
    </>
  )
}

export default Home

