import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axios.helper";
import VideoListCard from "../components/Video/VideoListCard";
import GuestComponent from "../components/GuestPages/GuestComponent";
import { IoPlayOutline } from "react-icons/io5";
import { icons } from "../assets/Icons.jsx";

function Search() {
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { query } = useParams();

    const fetchVideos = async () => {
        setError("");
        try {
            const response = await axiosInstance.get(`/videos?query=${query}`);
            if (response.data.data?.length > 0) {
                setVideos(response.data.data);
            }
        } catch (error) {
            if (error.status === 404) {
                setError(
                    <GuestComponent
                        title="No videos found"
                        subtitle="There are no videos here for your search result. Please try to search something else."
                        icon={
                            <span className="w-full h-full flex items-center p-2">
                                <IoPlayOutline className="w-28 h-28" />
                            </span>
                        }
                        guest={false}
                    />
                );
            } else {
                setError(
                    <p className="flex text-xl justify-center mt-20">
                        An error occured while fetching videos.
                    </p>
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, [query]);

    return (
        <div>
            {loading ? (
                <span className="flex justify-center mt-20">
                    {icons.bigLoading}
                </span>
            ) : (
                <div>
                    {error
                        ? error
                        : videos.map((video) => (
                              <div key={video?._id}>
                                  <VideoListCard video={video} />
                              </div>
                          ))}
                </div>
            )}
        </div>
    );
}

export default Search;
