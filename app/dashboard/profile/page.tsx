"use client";

import { UserDataProps, getUserDetails } from "@/lib/fetches/user-details";
import { getUsersFollowers } from "@/lib/fetches/followers";
import { useQuery } from "@tanstack/react-query";
import BannerCard from "@/components/cards/banner.card";
import RecentFollowers from "@/components/cards/followers.card";
import AdditionalInfoCard from "@/components/cards/additional-details.card";
import TweetCard from "@/components/cards/tweet.card";
import getTweets, { TweetPromiseProps } from "@/lib/fetches/tweets";
import ErrorPage from "@/components/message-pages/error.page";
import LoadingPage from "@/components/message-pages/loading-page";
import { LocalStore } from "@/store/local-store";

export default function Profile() {
  // const username = useAppSelector((state) => state.username)
  const username = LocalStore.getUsername() as string;

  console.log('username = ',username)

  // user details
  const { data: userData, status: userStatus } = useQuery<UserDataProps>({
    queryKey: ["user-details", username],
    queryFn: async () => await getUserDetails(username),
  });

  const user_id = userData?.user_id as number;

  // followers details
  const { data: followerData, status: followerStatus } = useQuery({
    queryKey: ["followers", user_id],
    queryFn: async () => {
      return await getUsersFollowers({ user_id: user_id, limit: 30 });
    },

    staleTime: Infinity,
  });

  // tweets details
  const { data: tweetData, status: tweetStatus } = useQuery({
    queryKey: ["tweets", username],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 30000));
      return await getTweets({ username: username, limit: 25, reply: true });
    },

  });

  const resultTweets = (tweetData as TweetPromiseProps)?.results || [];
  // filerting limit
  const filteredResultTweets = resultTweets.slice(0, 3);

  const sentimentInput = filteredResultTweets.map((tweet) => tweet.text);

  console.log("input = ", sentimentInput);

  if (userStatus === "loading") {
    return <div>
      
      <LoadingPage/>
    </div>;
  }

  if (userStatus === "error" || !userData) {
    return <div>

      <ErrorPage/>
    </div>;
  }

  return (
    <main className="p-5 bg-secondary">
      <div className="md:flex md:flex-row md:space-x-3">
        {/* Left container */}
        <section className="flex-1 flex flex-col gap-2">
          {/* BANNER */}
          <BannerCard {...userData} />

          {/* TWEETS */}
          <div className="p-5 border rounded-md flex flex-col gap-3">
            <h3 className="text-lg font-bold">Most Recent Tweets</h3>

            {filteredResultTweets.map((tweet, key) => (
              <TweetCard
                key={key}
                name={tweet.user.name}
                username={tweet.user.username}
                tweetText={tweet.text}
                comments={tweet.reply_count}
                retweets={tweet.retweet_count}
                likes={tweet.favorite_count}
                date={tweet.creation_date}
                userImg={tweet.user.profile_pic_url}
                usermedia={tweet.media_url}
                source={tweet.source}
                sentimentInput={sentimentInput}
              />
            ))}
          </div>
        </section>

        {/* Right container */}
        <aside className="flex-2 flex flex-col gap-2">
          {/* RECENT FOLLOWERS */}
          <RecentFollowers data={followerData?.results} limit={5} />

          {/* ADDITIONAL CARDS */}
          <AdditionalInfoCard {...userData} />
        </aside>
      </div>
    </main>
  );
}
