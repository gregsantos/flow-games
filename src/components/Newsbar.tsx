import * as React from "react";
import { Box } from "@chakra-ui/react";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export interface NewsbarProps {
  visible: boolean;
}

export interface Story {
  title: string;
  url: string;
  publishedAt: Date;
}

interface StoryProps {
  title: string;
  url: string;
  date: Date;
}

const Story = ({ url, title, date }: StoryProps) => {
  return (
    <div className="newsStory">
      <a href={url}>{title} </a>
      <span className="publishedAt">{new Date(date).toLocaleTimeString()}</span>
    </div>
  );
};

const Newsbar = () => {
  const { data } = useSWR(
    "https://newsapi.org/v1/articles?source=bloomberg&sortBy=top&apiKey=59c2506fe9fd429f8fb5914a571e3abd",
    fetcher
  );

  return (
    <Box w="100%" h={["2.5rem", "2.5rem"]} m="0 auto 0">
      <Box overflow="hidden" whiteSpace="nowrap">
        <Box className="newsbar-collection">
          {data &&
            data.articles &&
            data.articles.map((story: Story, id: number) => {
              return (
                <Story
                  key={id}
                  title={story.title}
                  url={story.url}
                  date={story.publishedAt}
                ></Story>
              );
            })}
        </Box>
      </Box>
    </Box>
  );
};

export default Newsbar;
