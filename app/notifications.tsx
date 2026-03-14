import ScreenLayout from "@/components/layout/ScreenLayout";
import { EmptyState } from "@/components/state-full-widgets";
import React from "react";

const Nortifications = () => {
  return (
    <ScreenLayout title="Notifications">
      <EmptyState message="no notifications" />
    </ScreenLayout>
  );
};

export default Nortifications;
