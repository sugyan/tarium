import { HomeIcon } from "@heroicons/react/24/outline";
import Feed from "../components/Feed";
import { useFeedViewPosts } from "../hooks/useFeedViewPosts";

const Home = () => {
  const posts = useFeedViewPosts();
  return (
    <>
      <div className="flex items-center p-2 border-b border-muted sticky top-0 bg-background">
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
