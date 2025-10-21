import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FormSubmission {
  id: string;
  form_data: Record<string, any>;
  files_data: Record<string, string>;
  status: string;
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  reviewed: "bg-yellow-500",
  accepted: "bg-green-500",
  rejected: "bg-red-500",
};

const statusLabels: Record<string, string> = {
  new: "Nouveau",
  reviewed: "En révision",
  accepted: "Accepté",
  rejected: "Rejeté",
};

export function FormSubmissionsSection() {
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [editedStatus, setEditedStatus] = useState<string>("");
  const [editedNotes, setEditedNotes] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["form-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("form_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FormSubmission[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from("form_submissions")
        .update({
          status,
          notes,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Send email notification
      if (status !== 'new' && selectedSubmission?.form_data) {
        const formData = selectedSubmission.form_data;
        try {
          await supabase.functions.invoke('send-status-update-email', {
            body: {
              firstName: formData.firstName || formData.first_name || 'Candidat',
              lastName: formData.lastName || formData.last_name || '',
              email: formData.email || '',
              status,
              notes,
            }
          });
        } catch (emailError) {
          console.error("Error sending status email:", emailError);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form-submissions"] });
      toast.success("Statut mis à jour avec succès");
      setSelectedSubmission(null);
    },
    onError: (error) => {
      console.error("Error updating status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    },
  });

  const handleViewSubmission = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setEditedStatus(submission.status);
    setEditedNotes(submission.notes || "");
  };

  const handleSaveStatus = () => {
    if (!selectedSubmission) return;
    
    updateStatusMutation.mutate({
      id: selectedSubmission.id,
      status: editedStatus,
      notes: editedNotes,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Chargement des candidatures...</p>
        </CardContent>
      </Card>
    );
  }

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Aucune candidature pour le moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Candidatures reçues ({submissions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Candidat</th>
                  <th className="text-left p-3 font-medium">Contact</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Statut</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => {
                  const { form_data, files_data } = submission;
                  const fullName = `${form_data.firstName || ''} ${form_data.lastName || ''}`.trim() || 'N/A';
                  
                  return (
                    <tr key={submission.id} className="border-b hover:bg-accent/50">
                      <td className="p-3">
                        <div className="font-medium">{fullName}</div>
                        {form_data.experienceYears && (
                          <div className="text-sm text-muted-foreground">
                            {form_data.experienceYears} ans d'expérience
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="text-sm">{form_data.email || 'N/A'}</div>
                        {form_data.phone && (
                          <div className="text-sm text-muted-foreground">{form_data.phone}</div>
                        )}
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(submission.created_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="p-3">
                        <Badge className={statusColors[submission.status]}>
                          {statusLabels[submission.status]}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewSubmission(submission)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          {Object.keys(files_data).length > 0 && (
                            <div className="flex gap-1">
                              {Object.entries(files_data).map(([key, url]) => (
                                <Button
                                  key={key}
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => window.open(url, '_blank')}
                                  title={`Voir ${key}`}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Détails de la candidature</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <ScrollArea className="h-full max-h-[60vh] pr-4">
              <div className="space-y-4">
                {/* Status Management Card */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="status">Statut de la candidature</Label>
                      <Select value={editedStatus} onValueChange={setEditedStatus}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">
                            <Badge variant="secondary">Nouveau</Badge>
                          </SelectItem>
                          <SelectItem value="reviewed">
                            <Badge className="bg-blue-500">En révision</Badge>
                          </SelectItem>
                          <SelectItem value="accepted">
                            <Badge className="bg-green-500">Accepté</Badge>
                          </SelectItem>
                          <SelectItem value="rejected">
                            <Badge variant="destructive">Rejeté</Badge>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes internes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Ajouter des notes sur cette candidature..."
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button 
                      onClick={handleSaveStatus}
                      disabled={updateStatusMutation.isPending}
                      className="w-full"
                    >
                      {updateStatusMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enregistrement...
                        </>
                      ) : (
                        'Enregistrer les modifications'
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Statut actuel</h4>
                    <Badge className={statusColors[selectedSubmission.status]}>
                      {statusLabels[selectedSubmission.status]}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Date de soumission</h4>
                    <p>{new Date(selectedSubmission.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Informations du candidat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(selectedSubmission.form_data).map(([key, value]) => (
                      <div key={key}>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm">{value || 'Non renseigné'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.keys(selectedSubmission.files_data).length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Documents</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedSubmission.files_data).map(([key, url]) => (
                        <Button
                          key={key}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.notes && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedSubmission.notes}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
