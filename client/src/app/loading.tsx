import { LoadingScreen } from "@/components/shared/LoadingScreen";

export default function RootLoading() {
  return (
    <LoadingScreen
      message="Initializing Doctor Tracker"
      subtext="Securing session and establishing clinical database connection..."
    />
  );
}
