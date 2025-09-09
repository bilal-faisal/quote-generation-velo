import wixData from 'wix-data';
import { sendAdminContactEmail, sendUserContactEmail } from 'backend/sendEmail.web';

let messageTimer = null;

// Dropdown options data
const interestsOptions = [
    { label: "Intruder Alarm", value: "Intruder Alarm" },
    { label: "CCTV", value: "CCTV" },
    { label: "EV Charger", value: "EV Charger" },
    { label: "Automation", value: "Automation" },
    { label: "Customer Service", value: "Customer Service" },
    { label: "Other", value: "Other" }
];

const howDidYouHearOptions = [
    { label: "Facebook", value: "Facebook" },
    { label: "LinkedIn", value: "LinkedIn" },
    { label: "Word of mouth", value: "Word of mouth" },
    { label: "Seen our van or bellbox", value: "Seen our van or bellbox" },
    { label: "Current customer", value: "Current customer" },
    { label: "Google Search", value: "Google Search" },
    { label: "Adrian Feeney", value: "Adrian Feeney" },
    { label: "Newspaper", value: "Newspaper" },
    { label: "Cian Love", value: "Cian Love" },
    { label: "Colin Connolly", value: "Colin Connolly" },
    { label: "Cormac Flynn", value: "Cormac Flynn" },
    { label: "Dan Hillman", value: "Dan Hillman" },
    { label: "Darragh Feehily", value: "Darragh Feehily" },
    { label: "Ross O'Boyle", value: "Ross O'Boyle" },
    { label: "Gerry Mc Loughlin", value: "Gerry Mc Loughlin" },
    { label: "Gerry Ryan", value: "Gerry Ryan" },
    { label: "Gerry Walsh", value: "Gerry Walsh" },
    { label: "Jamie Bowes", value: "Jamie Bowes" },
    { label: "Jason Mills", value: "Jason Mills" },
    { label: "Jimmy Duncan", value: "Jimmy Duncan" },
    { label: "Jonathan Porter", value: "Jonathan Porter" },
    { label: "Ken Carthy", value: "Ken Carthy" },
    { label: "Luke Bannon", value: "Luke Bannon" },
    { label: "Office", value: "Office" },
    { label: "Noel Hynes", value: "Noel Hynes" },
    { label: "Paul Brooks", value: "Paul Brooks" },
    { label: "Ryan Burns", value: "Ryan Burns" },
    { label: "Raymond O'Boyle", value: "Raymond O'Boyle" },
    { label: "Renaldas Antanavicus", value: "Renaldas Antanavicus" },
    { label: "Richard O'Boyle", value: "Richard O'Boyle" },
    { label: "Ross Carr", value: "Ross Carr" }
];

$w.onReady(function () {
    initializeForm();
});

function initializeForm() {
    populateDropdowns();

    $w('#buttonSubmit').onClick(() => {
        handleFormSubmission()
    })
}

function populateDropdowns() {
    // Populate interests dropdown
    $w('#dropdownInterests').options = interestsOptions;

    // Populate how did you hear dropdown
    $w('#dropdownHowDidYouHear').options = howDidYouHearOptions;
}

function clearFormFields() {
    $w('#inputName').value = '';
    $w('#inputEmail').value = '';
    $w('#inputPhone').value = '';
    $w('#inputStreetAddress').value = '';
    $w('#inputTown').value = '';
    $w('#inputCountry').value = '';
    $w('#inputEircode').value = '';
    $w('#textBoxQuery').value = '';

    // Reset dropdowns to no selection
    $w('#dropdownInterests').selectedIndex = undefined;
    $w('#dropdownHowDidYouHear').selectedIndex = undefined;
}

function handleFormSubmission() {
    const validationResult = validateForm();

    if (!validationResult.isValid) {
        showMessage(validationResult.message, 'error');
        return;
    }

    saveToCollection();
}

function validateForm() {
    // Get all form values
    const formData = getFormData();

    // Check required fields
    if (!formData.name.trim()) {
        return { isValid: false, message: 'Please enter your name.' };
    }

    if (!formData.email.trim()) {
        return { isValid: false, message: 'Please enter your email address.' };
    }

    // Validate email format using Wix built-in validation
    if (!$w('#inputEmail').valid) {
        return { isValid: false, message: 'Please enter a valid email address.' };
    }

    if (!formData.phone.trim()) {
        return { isValid: false, message: 'Please enter your phone number.' };
    }

    // Validate phone format using Wix built-in validation
    if (!$w('#inputPhone').valid) {
        return { isValid: false, message: 'Please enter a valid phone number.' };
    }

    if (!formData.streetAddress.trim()) {
        return { isValid: false, message: 'Please enter your street address.' };
    }

    if (!formData.town.trim()) {
        return { isValid: false, message: 'Please enter your town.' };
    }

    if (!formData.country.trim()) {
        return { isValid: false, message: 'Please enter your country.' };
    }

    if (!formData.interests) {
        return { isValid: false, message: 'Please select what you are interested in.' };
    }

    if (!formData.query) {
        return { isValid: false, message: 'Please tell us your query.' };
    }

    if (!formData.howDidYouHear) {
        return { isValid: false, message: 'Please select how you heard about us.' };
    }

    return { isValid: true };
}

function getFormData() {
    return {
        name: $w('#inputName').value,
        email: $w('#inputEmail').value,
        phone: $w('#inputPhone').value,
        streetAddress: $w('#inputStreetAddress').value,
        town: $w('#inputTown').value,
        country: $w('#inputCountry').value,
        eircode: $w('#inputEircode').value,
        interests: $w('#dropdownInterests').value,
        query: $w('#textBoxQuery').value,
        howDidYouHear: $w('#dropdownHowDidYouHear').value
    };
}

function saveToCollection() {
    $w('#buttonSubmit').disable();
    const formData = getFormData();

    // Prepare data object for collection
    const dataToInsert = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        streetAddress: formData.streetAddress,
        town: formData.town,
        country: formData.country,
        eircode: formData.eircode,
        interests: formData.interests,
        query: formData.query,
        howDidYouHear: formData.howDidYouHear,
        submittedDate: new Date(),
    };

    // Insert data into collection
    wixData.insert('QuerySubmissions', dataToInsert)
        .then(() => {
            showMessage('Thank you! Your inquiry has been submitted successfully. We will contact you soon.', 'success');
            sendContactEmails(dataToInsert)
            clearFormFields();
            $w('#buttonSubmit').enable();
        })
        .catch((error) => {
            console.error('Error saving to collection:', error);
            showMessage('Sorry, there was an error submitting your form. Please try again.', 'error');
            $w('#buttonSubmit').enable();
        });

}

/**
 * Show message with auto-collapse functionality
 */
function showMessage(message, type) {
    // Clear existing timer
    if (messageTimer) {
        clearTimeout(messageTimer);
    }

    // Update message text and style
    $w('#textMessage').text = message;

    // Apply styling based on message type
    if (type === 'success') {
        $w('#textMessage').style.backgroundColor = '#d4edda';
        $w('#textMessage').style.color = '#155724';
        $w('#textMessage').style.borderColor = '#c3e6cb';
    } else {
        $w('#textMessage').style.backgroundColor = '#f8d7da';
        $w('#textMessage').style.color = '#721c24';
        $w('#textMessage').style.borderColor = '#f5c6cb';
    }

    // Show message
    $w('#textMessage').expand();

    // Set timer to collapse after 5 seconds
    messageTimer = setTimeout(() => {
        $w('#textMessage').collapse();
        messageTimer = null;
    }, 5000);
}

async function sendContactEmails(contactData) {
    try {
        // Send admin notification email
        await sendEmailToAdmin(contactData);

        // Send user confirmation email
        await sendEmailToUser(contactData);
    } catch (error) {
        console.error("Error in sendContactEmails:", error);
        // Don't show error to user since form was already saved successfully
    }
}

async function sendEmailToAdmin(contactData) {
    try {
        const result = await sendAdminContactEmail(contactData);
        if (result.success) {
            console.log("Admin contact email sent successfully");
        } else {
            console.error("Failed to send admin contact email:", result.error);
        }
    } catch (error) {
        console.error("Error sending admin contact email:", error);
    }
}

async function sendEmailToUser(contactData) {
    try {
        const result = await sendUserContactEmail(contactData);
        if (result.success) {
            console.log("User confirmation email sent successfully");
        } else {
            console.error("Failed to send user confirmation email:", result.error);
        }
    } catch (error) {
        console.error("Error sending user confirmation email:", error);
    }
}