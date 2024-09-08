import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VideoListCard from "../components/Video/VideoListCard";

function Search() {
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { query } = useParams();

    const fetchVideos = async () => {
        try {
            const response = await axios.get(`/api/v1/videos?query=${query}`, {
                withCredentials: true,
            });
            console.log(response)
            if (response.data.data?.length > 0) {
                setVideos(response.data.data);
            } else {
                setError("No videos found!");
            }
        } catch (error) {
            setError("An error occurred while fetching videos");
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
                <p className="flex text-xl justify-center mt-20">Loading...</p>
            ) : (
                <div>
                    {error ? (
                        <p className="flex text-xl justify-center mt-20">{error}</p>
                    ) : (
                        videos.map((video) => (
                            <div key={video?._id}>
                                <VideoListCard video={video} />
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

export default Search;
