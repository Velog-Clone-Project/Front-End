import React from "react";
import TabMenu from "../components/TabMenu";
import PostList from "../components/PostList";

function Home() {
  return (
    <div className="bg-[#F8F9FA] min-h-screen">
      <TabMenu />
      <PostList />
    </div>
  );
}

export default Home;
