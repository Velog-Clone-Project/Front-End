import React, { useState } from "react";
import FeedIcon from "../assets/velog-feed.png";
import RecentlyIcon from "../assets/velog-recently.png";
import TrendingIcon from "../assets/velog-trending.png";

function TabMenu() {
  const [activeTab, setActiveTab] = useState("trending");

  const tabs = [
    { id: "trending", label: "트렌딩", icon: TrendingIcon },
    { id: "recent", label: "최신", icon: RecentlyIcon },
    { id: "feed", label: "피드", icon: FeedIcon },
  ];

  return (
    <div className="max-w-screen-2xl mx-auto flex space-x-8 px-[24px]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 py-4 text-base font-semibold ${
            activeTab === tab.id
              ? "border-b-2 border-black text-black"
              : "text-gray-500"
          }`}
        >
          <img src={tab.icon} alt={`${tab.label} icon`} className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default TabMenu;
