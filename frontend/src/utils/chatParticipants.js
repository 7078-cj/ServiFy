/** Prefer the other participant in a DM; otherwise first participant. */
export function getConversationAvatarParticipant(participants) {
    if (!participants?.length) return null;
    const currentUserId = JSON.parse(localStorage.getItem("user"))?.id;
    const others = participants.filter((p) => p.id !== currentUserId);
    return others[0] || participants[0];
}
