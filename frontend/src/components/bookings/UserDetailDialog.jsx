import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Mail, Phone, Hash, ShieldCheck, User } from "lucide-react";
import { 
    getCustomerName, 
    getCustomerEmail, 
    getCustomerPhone, 
    getCustomerRole 
} from "./utils/booking";

const media_url = import.meta.env.VITE_MEDIA_URL;


export default function UserDetailDialog({ isOpen, onClose, booking }) {
    if (!booking) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[380px] p-0 rounded-[2rem] overflow-hidden border-none shadow-2xl bg-white">
                <div className="bg-slate-900 p-8 text-white relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                    >
                        <X size={18} />
                    </button>
                    <div className="flex flex-col items-center text-center gap-3">
                        {
                            booking.user.profile.profile_image ? (
                                <img
                                    src={media_url + booking.user.profile.profile_image}
                                    alt="Profile"
                                    className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-white"
                                />
                            ):
                            (
                                <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black shadow-lg">
                                    {getCustomerName(booking).charAt(0)}
                                </div>
                            )
                        }
                        


                        <div>
                            <h2 className="text-xl font-bold tracking-tight">{getCustomerName(booking)}</h2>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-widest mt-1">
                                <ShieldCheck size={12} /> {getCustomerRole(booking)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    <DetailItem icon={<Mail size={16}/>} label="Email Address" value={getCustomerEmail(booking)} />
                    <DetailItem icon={<Phone size={16}/>} label="Phone" value={getCustomerPhone(booking)} />
                    <DetailItem icon={<Hash size={16}/>} label="User ID" value={`#${booking.user?.id || 'N/A'}`} />
                    
                    <div className="pt-4">
                        <button 
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function DetailItem({ icon, label, value }) {
    return (
        <div className="flex items-start gap-4">
            <div className="mt-1 p-2 rounded-lg bg-slate-50 text-slate-400">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
                <p className="text-sm font-semibold text-slate-700">{value}</p>
            </div>
        </div>
    );
}