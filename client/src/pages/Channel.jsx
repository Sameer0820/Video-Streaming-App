import React from "react";
import ChannelComponent from "../components/Channel/Channel";
import GuestChannel from "../components/GuestPages/GuestChannel";
import { useParams } from "react-router-dom";

function Channel() {
    const { username } = useParams();
    if (username === "undefined") {
        return <GuestChannel />;
    } else return <ChannelComponent />;
}

export default Channel;
