import Column from "@/components/Column";
import Feed from "@/components/Feed";
import { useFeedViewPosts } from "@/hooks/useFeedViewPosts";
import { HomeIcon } from "@heroicons/react/24/outline";

const Home = () => {
  const posts = useFeedViewPosts();
  const headerContent = (
    <>
      <div className="h-6 w-6">
        <div className="h-6 flex justify-center items-center">
          <HomeIcon className="h-6 w-6" />
        </div>
      </div>
      <span className="ml-2 font-semibold">Home</span>
    </>
  );
  return (
    <Column headerContent={headerContent}>
      <Feed posts={posts} />
    </Column>
  );
};

export default Home;
