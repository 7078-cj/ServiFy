const trim = (v) => (v == null ? "" : String(v)).trim();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginFields(username, password) {
    const errors = {};
    if (!trim(username)) errors.username = "Username is required.";
    if (!trim(password)) errors.password = "Password is required.";
    return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterFields({
    username,
    email,
    password,
    first_name,
    last_name,
}) {
    const errors = {};
    if (!trim(username)) errors.username = "Username is required.";
    if (!trim(first_name)) errors.first_name = "First name is required.";
    if (!trim(last_name)) errors.last_name = "Last name is required.";
    if (!trim(email)) errors.email = "Email is required.";
    else if (!EMAIL_RE.test(trim(email))) errors.email = "Enter a valid email address.";
    if (!trim(password)) errors.password = "Password is required.";
    else if (trim(password).length < 8)
        errors.password = "Password must be at least 8 characters.";
    return { valid: Object.keys(errors).length === 0, errors };
}

export function validateProfileFields({ first_name, last_name, username, email }) {
    const errors = {};
    if (!trim(first_name)) errors.first_name = "First name is required.";
    if (!trim(last_name)) errors.last_name = "Last name is required.";
    if (!trim(username)) errors.username = "Username is required.";
    if (!trim(email)) errors.email = "Email is required.";
    else if (!EMAIL_RE.test(trim(email))) errors.email = "Enter a valid email address.";
    return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBookingFields({ date, latitude, longitude }) {
    const errors = {};
    if (!trim(date)) errors.date = "Please choose a date and time.";
    if (!trim(latitude) || !trim(longitude)) errors.location = "Please pick a location on the map.";
    return { valid: Object.keys(errors).length === 0, errors };
}

export function validateBusinessBasics({ name, latitude, longitude }) {
    const errors = {};
    if (!trim(name)) errors.name = "Business name is required.";
    if (!trim(latitude) || !trim(longitude)) errors.location = "Pick a location on the map.";
    return { valid: Object.keys(errors).length === 0, errors };
}

export function validateServiceBasics({ name, price }) {
    const errors = {};
    if (!trim(name)) errors.name = "Service name is required.";
    const p = parseFloat(price);
    if (price === "" || price == null || Number.isNaN(p) || p < 0) {
        errors.price = "Enter a valid price (0 or more).";
    }
    return { valid: Object.keys(errors).length === 0, errors };
}
