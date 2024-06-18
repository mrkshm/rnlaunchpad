import { useToastStore } from "~/stores/toaster-store";

type NotificationProps = {
  message: string;
  title?: string;
};
export function notifyUser({
  message,
  title = "Notification 4 u",
}: NotificationProps) {
  useToastStore.setState({ open: true, message, title });
  console.log("NOTIFICATION: ", message);
}
