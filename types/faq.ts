export type FrequentlyAskedQuestion = {
  id: string;
  question: string;
  answer: string;
  topicId: string;
  topic?: FaqTopic;
  createdAt: string;
  updatedAt: string;
};

export type FaqTopic = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};
