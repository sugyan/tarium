import { HomeIcon } from "@heroicons/react/24/outline";
import Feed from "../components/Feed";
import { useFeedviewPost } from "../hooks/useFeedViewPosts";

const Home = () => {
  const posts = useFeedviewPost();
  return (
    <>
      <div className="flex items-center p-2 border-b sticky top-0 bg-gray-800">
        <div className="h-6 w-6">
          <div className="h-6 flex justify-center items-center">
            <HomeIcon className="h-6 w-6" />
          </div>
        </div>
        <span className="ml-2 font-semibold">Home</span>
      </div>
      <Feed posts={posts} />
    </>
  );
};

export default Home;
