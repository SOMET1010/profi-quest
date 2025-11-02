import { useState } from "react";
import { ModernLayout } from "@/components/ModernLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useApplicationManagement,
  ApplicationWithHistory,
} from "@/hooks/useApplicationManagement";
import { ApplicationDetailModal } from "@/components/ApplicationDetailModal";
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Mail,
  Phone,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const statusConfig = {
  new: { label: "Nouveau", color: "bg-blue-500", icon: Clock },
  reviewed: { label: "Examiné", color: "bg-yellow-500", icon: Clock },
  accepted: { label: "Accepté", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejeté", color: "bg-red-500", icon: XCircle },
  shortlisted: { label: "Présélectionné", color: "bg-purple-500", icon: Clock },
};

const ApplicationManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationWithHistory | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { applications, isLoading, updateStatus, bulkUpdate, isUpdating, historyQuery } =
    useApplicationManagement({
      status: statusFilter,
      search: searchTerm,
    });

  const { data: statusHistory } = historyQuery(selectedApplication?.id || "");

  const handleViewDetails = (application: ApplicationWithHistory) => {
    setSelectedApplication(application);
    setModalOpen(true);
  };

  const handleStatusUpdate = (status: string, notes?: string) => {
    if (selectedApplication) {
      updateStatus(
        {
          applicationId: selectedApplication.id,
          newStatus: status,
          notes,
          sendEmail: true,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setSelectedApplication(null);
          },
        }
      );
    }
  };

  const handleBulkUpdate = (status: string) => {
    if (selectedIds.length > 0) {
      bulkUpdate(
        { applicationIds: selectedIds, newStatus: status },
        {
          onSuccess: () => {
            setSelectedIds([]);
          },
        }
      );
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === applications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(applications.map((a) => a.id));
    }
  };

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "new").length,
    reviewed: applications.filter((a) => a.status === "reviewed").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return (
    <ModernLayout>
      <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Gestion des Candidatures</h1>
          <p className="text-muted-foreground mt-2">
            Gérez et suivez toutes les candidatures reçues
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-blue-500">{stats.new}</div>
            <div className="text-sm text-muted-foreground">Nouvelles</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-yellow-500">
              {stats.reviewed}
            </div>
            <div className="text-sm text-muted-foreground">Examinées</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-green-500">
              {stats.accepted}
            </div>
            <div className="text-sm text-muted-foreground">Acceptées</div>
          </Card>
          <Card className="p-4">
            <div className="text-2xl font-bold text-red-500">
              {stats.rejected}
            </div>
            <div className="text-sm text-muted-foreground">Rejetées</div>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="new">Nouveau</SelectItem>
                <SelectItem value="reviewed">Examiné</SelectItem>
                <SelectItem value="accepted">Accepté</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
                <SelectItem value="shortlisted">Présélectionné</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="mt-4 flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedIds.length} sélectionné(s)
              </span>
              <div className="flex gap-2 ml-auto">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdate("reviewed")}
                  disabled={isUpdating}
                >
                  Marquer examiné
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdate("accepted")}
                  disabled={isUpdating}
                >
                  Accepter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkUpdate("rejected")}
                  disabled={isUpdating}
                >
                  Rejeter
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Applications Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      applications.length > 0 &&
                      selectedIds.length === applications.length
                    }
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Candidat</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Expérience</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-12 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-muted-foreground">
                      Aucune candidature trouvée
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((application) => {
                  const statusInfo =
                    statusConfig[application.status as keyof typeof statusConfig] ||
                    statusConfig.new;
                  const StatusIcon = statusInfo.icon;

                  return (
                    <TableRow key={application.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(application.id)}
                          onCheckedChange={() => toggleSelection(application.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {application.first_name} {application.last_name}
                        </div>
                        {application.location && (
                          <div className="text-sm text-muted-foreground">
                            {application.location}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {application.email}
                          </div>
                          {application.phone && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {application.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {application.experience_years
                          ? `${application.experience_years} ans`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(application.created_at), "dd/MM/yyyy", {
                            locale: fr,
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Detail Modal */}
        <ApplicationDetailModal
          application={selectedApplication}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={isUpdating}
          statusHistory={statusHistory}
        />
      </div>
    </ModernLayout>
  );
};

export default ApplicationManagement;
