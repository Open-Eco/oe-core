'use client';

import React, { useState } from 'react';

interface ApprovalActionsProps {
  resourceType: 'reporting_period' | 'activity_data';
  resourceId: string;
  currentStatus: string;
  userRole: string;
  onAction: (action: string, comment?: string) => Promise<void>;
}

export function ApprovalActions({
  resourceType,
  resourceId,
  currentStatus,
  userRole,
  onAction,
}: ApprovalActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComment, setRejectComment] = useState('');

  const handleAction = async (action: string, comment?: string) => {
    setLoading(action);
    try {
      await onAction(action, comment);
    } finally {
      setLoading(null);
      setShowRejectModal(false);
      setRejectComment('');
    }
  };

  const isAdmin = userRole === 'ORG_ADMIN';
  const isPeriod = resourceType === 'reporting_period';

  return (
    <div className="approval-actions">
      {/* Draft/Open -> Submit */}
      {(currentStatus === 'draft' || currentStatus === 'open') && (
        <button
          className="eco-btn eco-btn--primary eco-btn--sm"
          onClick={() => handleAction('submit')}
          disabled={loading !== null}
        >
          {loading === 'submit' ? 'Submitting...' : 'Submit for Approval'}
        </button>
      )}

      {/* Submitted -> Approve (admin only) */}
      {currentStatus === 'submitted' && isAdmin && (
        <>
          <button
            className="eco-btn eco-btn--success eco-btn--sm"
            onClick={() => handleAction('approve')}
            disabled={loading !== null}
          >
            {loading === 'approve' ? 'Approving...' : 'Approve'}
          </button>
          <button
            className="eco-btn eco-btn--danger eco-btn--sm"
            onClick={() => setShowRejectModal(true)}
            disabled={loading !== null}
          >
            Reject
          </button>
        </>
      )}

      {/* Approved -> Lock (admin only, periods only) */}
      {currentStatus === 'approved' && isAdmin && isPeriod && (
        <button
          className="eco-btn eco-btn--secondary eco-btn--sm"
          onClick={() => handleAction('lock')}
          disabled={loading !== null}
        >
          {loading === 'lock' ? 'Locking...' : 'Lock Period'}
        </button>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Reject Submission</h3>
            <p>Please provide a reason for rejection:</p>
            <textarea
              className="eco-textarea"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Enter reason for rejection..."
              rows={4}
            />
            <div className="modal-actions">
              <button
                className="eco-btn eco-btn--secondary eco-btn--sm"
                onClick={() => setShowRejectModal(false)}
              >
                Cancel
              </button>
              <button
                className="eco-btn eco-btn--danger eco-btn--sm"
                onClick={() => handleAction('reject', rejectComment)}
                disabled={!rejectComment.trim() || loading !== null}
              >
                {loading === 'reject' ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .approval-actions {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 1.5rem;
          border-radius: 0.5rem;
          max-width: 400px;
          width: 90%;
        }

        .modal-content h3 {
          margin: 0 0 0.5rem 0;
        }

        .modal-content p {
          margin: 0 0 1rem 0;
          color: var(--neutral-600);
        }

        .modal-content textarea {
          width: 100%;
          margin-bottom: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .eco-btn--success {
          background: var(--success-500, #22c55e);
          color: white;
        }

        .eco-btn--success:hover {
          background: var(--success-600, #16a34a);
        }

        .eco-btn--danger {
          background: var(--error-500, #ef4444);
          color: white;
        }

        .eco-btn--danger:hover {
          background: var(--error-600, #dc2626);
        }
      `}</style>
    </div>
  );
}

