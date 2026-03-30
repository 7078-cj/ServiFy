import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

export default function AddUpdateBusinessModal({open, onClose, business=undefined, onSave}) {

    const handleClose = () => {
        onClose();
    };
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="bg-white border shadow-xl max-w-md">
                <DialogHeader>
                <DialogTitle
                    className="text-lg font-bold"
                    style={{ color: "#3182ce" }}
                >
                    Register Business
                </DialogTitle>
                </DialogHeader>
                <div>test</div>

            </DialogContent>
        </Dialog>
    )
}
