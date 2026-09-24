import React from "react";
import { PublicBookingFlow } from "./PublicBookingFlow";

interface PublicEventViewProps {
  onOpenMyTickets?: () => void;
}

export const PublicEventView: React.FC<PublicEventViewProps> = ({ onOpenMyTickets }) => {
  return <PublicBookingFlow onOpenMyTickets={onOpenMyTickets} />;
};

export default PublicEventView;
