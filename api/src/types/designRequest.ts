export type DesignRequestStatus = "pending" | "approved" | "rejected";

export interface DesignRequest {
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
