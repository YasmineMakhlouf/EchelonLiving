/**
 * AdminDesignRequests
 * Frontend pages module for Echelon Living app.
 */
import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axios";
import "../../../styles/AdminDesignRequests.css";
import "../../../styles/AdminDashboard.css";

type DesignRequestStatus = "pending" | "approved" | "rejected";

interface DesignRequestRow {
  id: number;
  user_id: number;
  user_name?: string;
  user_email?: string;
  title: string;
  notes: string | null;
  design_data_url: string;
  status: DesignRequestStatus;
  admin_notes: string | null;
  created_at: string;
  reviewed_at: string | null;
}

export default function AdminDesignRequests() {
  const [requests, setRequests] = useState<DesignRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<DesignRequestStatus | "all">("all");
  const [adminNotesById, setAdminNotesById] = useState<Record<number, string>>({});

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<DesignRequestRow[]>("/design-requests");
      setRequests(response.data);
      setAdminNotesById(
        response.data.reduce<Record<number, string>>((accumulator, designRequest) => {
          accumulator[designRequest.id] = designRequest.admin_notes ?? "";
          return accumulator;
        }, {})
      );
    } catch (requestError) {
      const status = (requestError as { response?: { status?: number } }).response?.status;

      if (status === 401) {
        return;
      }

      setError("Failed to load design requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const visibleRequests = useMemo(() => {
    if (statusFilter === "all") {
      return requests;
    }

    return requests.filter((designRequest) => designRequest.status === statusFilter);
  }, [requests, statusFilter]);

  const updateStatus = async (id: number, status: DesignRequestStatus) => {
    try {
      setSavingId(id);
      setError(null);

      const response = await api.patch<DesignRequestRow>(`/design-requests/${id}`, {
        status,
        adminNotes: adminNotesById[id] ?? "",
      });

      setRequests((prev) => prev.map((item) => (item.id === id ? response.data : item)));
      setAdminNotesById((prev) => ({
        ...prev,
        [id]: response.data.admin_notes ?? "",
      }));
    } catch (requestError) {
      const statusCode = (requestError as { response?: { status?: number } }).response?.status;

      if (statusCode === 401) {
        return;
      }

      setError("Failed to update design request");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <main className="admin-page admin-design-requests page-fade-in">
      <div className="admin-design-requests-header">
        <div>
          <h1>Design Requests</h1>
          <p>Review user sketches and mark them as pending, approved, or rejected.</p>
        </div>

        <div className="admin-design-requests-filters">
          <button
            type="button"
            className={`admin-btn ${statusFilter === "all" ? "" : "admin-btn-secondary"}`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`admin-btn ${statusFilter === "pending" ? "" : "admin-btn-secondary"}`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>
          <button
            type="button"
            className={`admin-btn ${statusFilter === "approved" ? "" : "admin-btn-secondary"}`}
            onClick={() => setStatusFilter("approved")}
          >
            Approved
          </button>
          <button
            type="button"
            className={`admin-btn ${statusFilter === "rejected" ? "" : "admin-btn-secondary"}`}
            onClick={() => setStatusFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {error ? <p className="admin-error">{error}</p> : null}

      {loading ? (
        <div className="admin-panel">
          <p>Loading design requests...</p>
        </div>
      ) : visibleRequests.length === 0 ? (
        <div className="admin-panel">
          <p>No design requests match the current filter.</p>
        </div>
      ) : (
        <div className="admin-design-grid">
          {visibleRequests.map((designRequest) => (
            <article key={designRequest.id} className="admin-design-card admin-panel">
              <div className="admin-design-preview-wrap">
                <img
                  src={designRequest.design_data_url}
                  alt={designRequest.title}
                  className="admin-design-preview"
                />
              </div>

              <div className="admin-design-content">
                <div className="admin-design-topline">
                  <div>
                    <h2>{designRequest.title}</h2>
                    <p>
                      {designRequest.user_name ?? "Unknown user"} · {designRequest.user_email ?? "No email"}
                    </p>
                  </div>

                  <span className={`admin-design-badge is-${designRequest.status}`}>{designRequest.status}</span>
                </div>

                <p className="admin-design-meta">
                  Submitted on {new Date(designRequest.created_at).toLocaleString()}
                </p>

                {designRequest.notes ? <p className="admin-design-notes">{designRequest.notes}</p> : null}

                <label className="admin-design-notes-field">
                  Admin notes
                  <textarea
                    rows={3}
                    value={adminNotesById[designRequest.id] ?? ""}
                    onChange={(event) =>
                      setAdminNotesById((prev) => ({ ...prev, [designRequest.id]: event.target.value }))
                    }
                    placeholder="Add a response, quote, or follow-up notes"
                  />
                </label>

                <div className="admin-design-actions">
                  <button
                    type="button"
                    className="admin-btn"
                    onClick={() => updateStatus(designRequest.id, "approved")}
                    disabled={savingId === designRequest.id}
                  >
                    {savingId === designRequest.id ? "Saving..." : "Approve"}
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={() => updateStatus(designRequest.id, "pending")}
                    disabled={savingId === designRequest.id}
                  >
                    Mark pending
                  </button>
                  <button
                    type="button"
                    className="admin-btn admin-btn-danger"
                    onClick={() => updateStatus(designRequest.id, "rejected")}
                    disabled={savingId === designRequest.id}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
