import { ContestStatus as StatusType } from "@/types/contest";
import { Badge } from "@/components/ui/Badge";

interface ContestStatusProps {
  status: StatusType;
}

export function ContestStatus({ status }: ContestStatusProps) {
  switch (status) {
    case "LIVE":
      return (
        <Badge variant="live" size="md" dot>
          LIVE NOW
        </Badge>
      );
    case "UPCOMING":
      return (
        <Badge variant="secondary" size="md" dot>
          UPCOMING
        </Badge>
      );
    case "ENDED":
      return (
        <Badge variant="default" size="md">
          ENDED
        </Badge>
      );
    default:
      return null;
  }
}
