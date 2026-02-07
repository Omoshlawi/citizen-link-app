import { ScreenLayout } from "@/components/layout";
import { ListMatches } from "@/components/matches";
import React from "react";

const MatchesScreen = () => {
  return (
    <ScreenLayout title="Matches">
      <ListMatches />
    </ScreenLayout>
  );
};

export default MatchesScreen;
