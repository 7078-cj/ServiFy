import ConfirmDialog from "../ui/ConfirmDialog";

export function DeleteConfirmModal({ businessName, onConfirm, onCancel, loading }) {
    return (
        <ConfirmDialog
            open
            onClose={onCancel}
            title="Delete business"
            description={
                <>
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-700">&quot;{businessName}&quot;</span>? This
                    cannot be undone.
                </>
            }
            confirmText="Delete"
            cancelText="Cancel"
            onConfirm={onConfirm}
            loading={loading}
            danger
        />
    );
}
