import { LeadType } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const LeadsList = ({
  leads,
  onClaimLead,
}: {
  leads: LeadType[];
  onClaimLead: (id: string, status: LeadType["status"]) => void;
}) => {
  const statusColors = {
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-yellow-100 text-yellow-800",
    qualified: "bg-green-100 text-green-800",
    proposal: "bg-purple-100 text-purple-800",
    closed: "bg-teal-100 text-teal-800",
    lost: "bg-red-100 text-red-800",
  };

  const statusOptions = [
    { value: "contacted", label: "Mark as Contacted" },
    { value: "qualified", label: "Mark as Qualified" },
    { value: "proposal", label: "Mark as Proposal Sent" },
    { value: "closed", label: "Mark as Closed (Won)" },
    { value: "lost", label: "Mark as Lost" },
  ];

  if (leads.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No leads found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {leads.map((lead) => (
        <Card key={lead.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{lead.businessName}</CardTitle>
                <CardDescription>
                  {lead.contactName} • {lead.industry}
                </CardDescription>
              </div>
              <Badge className={statusColors[lead.status]}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Email:</span> {lead.email}
              </p>
              {lead.phone && (
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {lead.phone}
                </p>
              )}
              {lead.notes && (
                <div>
                  <p className="text-sm font-medium">Notes:</p>
                  <p className="text-sm text-muted-foreground">{lead.notes}</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Added on {formatDate(lead.createdAt)}
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Select
              onValueChange={(value) =>
                onClaimLead(lead.id, value as LeadType["status"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions
                  .filter((option) => option.value !== lead.status)
                  .map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default LeadsList;
