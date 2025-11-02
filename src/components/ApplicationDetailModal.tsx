import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Calendar,
} from "lucide-react";
import { ApplicationWithHistory } from "@/hooks/useApplicationManagement";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ApplicationDetailModalProps {
  application: ApplicationWithHistory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (status: string, notes?: string) => void;
  isUpdating: boolean;
  statusHistory?: any[];
}

const statusConfig = {
  new: { label: "Nouveau", color: "bg-blue-500", icon: Clock },
  reviewed: { label: "Examiné", color: "bg-yellow-500", icon: Clock },
  accepted: { label: "Accepté", color: "bg-green-500", icon: CheckCircle },
  rejected: { label: "Rejeté", color: "bg-red-500", icon: XCircle },
  shortlisted: { label: "Présélectionné", color: "bg-purple-500", icon: Clock },
};

export const ApplicationDetailModal = ({
  application,
  open,
  onOpenChange,
  onStatusUpdate,
  isUpdating,
  statusHistory = [],
}: ApplicationDetailModalProps) => {
  const [notes, setNotes] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  if (!application) return null;

  const currentStatusConfig =
    statusConfig[application.status as keyof typeof statusConfig] ||
    statusConfig.new;
  const StatusIcon = currentStatusConfig.icon;

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  const handleConfirmStatus = () => {
    if (selectedStatus) {
      onStatusUpdate(selectedStatus, notes);
      setSelectedStatus(null);
      setNotes("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>
              {application.first_name} {application.last_name}
            </span>
            <Badge className={currentStatusConfig.color}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {currentStatusConfig.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Candidature soumise le{" "}
            {format(new Date(application.created_at), "PPP", { locale: fr })}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informations de contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={`mailto:${application.email}`}
                    className="text-sm hover:underline"
                  >
                    {application.email}
                  </a>
                </div>
                {application.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={`tel:${application.phone}`}
                      className="text-sm hover:underline"
                    >
                      {application.phone}
                    </a>
                  </div>
                )}
                {application.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{application.location}</span>
                  </div>
                )}
                {application.linkedin && (
                  <div className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={application.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline flex items-center gap-1"
                    >
                      LinkedIn <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {application.github && (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={application.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline flex items-center gap-1"
                    >
                      GitHub <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Experience & Skills */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Expérience et compétences</h3>
              {application.experience_years && (
                <p className="text-sm">
                  <span className="font-medium">Années d'expérience:</span>{" "}
                  {application.experience_years} ans
                </p>
              )}
              {application.technical_skills && (
                <div>
                  <p className="text-sm font-medium mb-2">
                    Compétences techniques:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {application.technical_skills}
                  </p>
                </div>
              )}
              {application.behavioral_skills && (
                <div>
                  <p className="text-sm font-medium mb-2">
                    Compétences comportementales:
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {application.behavioral_skills}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            {/* Documents */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Documents</h3>
              <div className="flex gap-3">
                {application.cv_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(application.cv_url!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Voir le CV
                  </Button>
                )}
                {application.motivation_letter_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(application.motivation_letter_url!, "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Lettre de motivation
                  </Button>
                )}
              </div>
            </div>

            {/* Current Notes */}
            {application.notes && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Notes existantes</h3>
                  <p className="text-sm text-muted-foreground">
                    {application.notes}
                  </p>
                </div>
              </>
            )}

            {/* Status History */}
            {statusHistory.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Historique des statuts</h3>
                  <div className="space-y-2">
                    {statusHistory.map((history) => (
                      <div
                        key={history.id}
                        className="flex items-start gap-3 text-sm border-l-2 border-primary/20 pl-3 py-2"
                      >
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {history.old_status
                                ? `${history.old_status} → ${history.new_status}`
                                : history.new_status}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(history.created_at), "PPp", {
                                locale: fr,
                              })}
                            </span>
                          </div>
                          {history.notes && (
                            <p className="text-muted-foreground mt-1">
                              {history.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            {/* Status Update Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Changer le statut</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const Icon = config.icon;
                  return (
                    <Button
                      key={status}
                      variant={selectedStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(status)}
                      disabled={isUpdating || application.status === status}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {config.label}
                    </Button>
                  );
                })}
              </div>

              {selectedStatus && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <Label htmlFor="notes">
                      Notes (optionnel - visible par le candidat si envoi d'email)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ajoutez des commentaires sur cette décision..."
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleConfirmStatus}
                      disabled={isUpdating}
                      className="flex-1"
                    >
                      Confirmer et envoyer email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedStatus(null);
                        setNotes("");
                      }}
                      disabled={isUpdating}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
