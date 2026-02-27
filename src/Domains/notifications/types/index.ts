// Notification Types
export type NotificationType =
  | 'general'
  | 'quiz_posted'
  | 'grade_released'
  | 'enrollment_status'
  | 'deadline_reminder'
  | 'assignment_submitted';

export type RelatedResourceType = 'Quiz' | 'Course' | 'Attempt' | 'Assignment' | 'Class';

export interface Notification {
  nid: string;
  title: string;
  message: string;
  type: NotificationType;
  is_read: boolean;
  details_json?: any;
  related_type?: RelatedResourceType;
  related_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  recipient_uid: string;
  type?: NotificationType;
  related_type?: RelatedResourceType;
  related_id?: string;
}

export interface CreateBulkNotificationDto {
  recipients: string[];
  title: string;
  message: string;
  type?: NotificationType;
  related_type?: RelatedResourceType;
  related_id?: string;
}

export interface CreateClassNotificationDto {
  title: string;
  message: string;
  type?: NotificationType;
  related_type?: RelatedResourceType;
  related_id?: string;
}

export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  type?: NotificationType;
}

export interface NotificationQueryParams {
  is_read?: boolean;
  type?: NotificationType;
  limit?: number;
  skip?: number;
}
