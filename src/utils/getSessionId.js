export function generateSessionId() {
    return "sess_" + Math.random().toString(36).substr(2, 9) + Date.now();
}


export function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem("sessionId");

    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem("sessionId", sessionId);
    }

    return sessionId;
}