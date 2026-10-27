import { LoadingScreen } from "@/components/shared/LoadingScreen";

export default function PortalLoading() {
  return (
    <LoadingScreen
      fullscreen={false}
      message="Loading Portal Workspace"
      subtext="Fetching live clinical data from MongoDB..."
    />
  );
}
