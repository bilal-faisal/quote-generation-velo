import { Permissions, webMethod } from 'wix-web-module';
import { contacts, triggeredEmails } from 'wix-crm-backend';

const ADMIN_CCTV_EMAIL_TEMPLATE_ID = 'Uvk9GF3';
const ADMIN_ALARM_EMAIL_TEMPLATE_ID = 'UvkNh35';
const USER_CCTV_EMAIL_TEMPLATE_ID = 'UvppHxG';
const USER_ALARM_EMAIL_TEMPLATE_ID = 'Uvpqmko';
const ADMIN_CONTACT_EMAIL_TEMPLATE_ID = 'UwJ8UxA';
const USER_CONTACT_EMAIL_TEMPLATE_ID = 'UwJ9mH8';

const ADMIN_EMAIL = 'bookings@powerright.ie';

export const sendAdminCCTVEmail = webMethod(Permissions.Anyone, async (filteredQuoteData) => {
    try {
        let contactId;
        const queryResults = await contacts.queryContacts()
            .eq('info.emails.email', ADMIN_EMAIL)
            .find({ suppressAuth: true });

        const contactsWithEmail = queryResults.items;

        if (contactsWithEmail.length === 1) {
            contactId = contactsWithEmail[0]._id;
        } else if (contactsWithEmail.length > 1) {
            contactId = contactsWithEmail[0]._id;
        } else {
            // Create admin contact if doesn't exist
            const contactInfo = {
                name: {
                    first: "Admin",
                    last: "Team",
                },
                emails: [{
                    email: ADMIN_EMAIL,
                    tag: "MAIN"
                }],
            };

            const options = {
                allowDuplicates: false,
                suppressAuth: true
            };

            const contact = await contacts.createContact(contactInfo, options);
            contactId = contact._id;
        }

        // Format camera locations
        let cameraLocationDetails = "";
        filteredQuoteData.cameraLocations.forEach((camera) => {
            if (camera.locationType !== "N/A") {
                cameraLocationDetails += `${camera.cameraNumber}: ${camera.locationType} - ${camera.location}\n`;
            } else {
                cameraLocationDetails += `${camera.cameraNumber}: ${camera.locationType}\n`;
            }
        });

        // Format installation assessment
        let installationAssessmentDetails = "";
        filteredQuoteData.installationQuestions.forEach((qa) => {
            installationAssessmentDetails += `${qa.question}\nAnswer: ${qa.answer}\n\n`;
        });

        // Prepare email variables
        const adminEmailVariables = {
            // Customer details
            customerName: filteredQuoteData.userDetails.name,
            customerEmail: filteredQuoteData.userDetails.email,
            customerPhone: filteredQuoteData.userDetails.phone,
            streetAddress: filteredQuoteData.userDetails.streetAddress,
            town: filteredQuoteData.userDetails.town,
            country: filteredQuoteData.userDetails.country,
            eircode: filteredQuoteData.userDetails.eircode,

            // Quote details
            selectedPackage: filteredQuoteData.selectedPackage,
            numberOfCameras: filteredQuoteData.numberOfCameras,
            includeMonitor: filteredQuoteData.includeMonitor,
            includeAppView: filteredQuoteData.includeAppView,
            totalPrice: filteredQuoteData.totalPrice,

            // Formatted details
            cameraLocationDetails: cameraLocationDetails.trim(),
            installationAssessmentDetails: installationAssessmentDetails.trim(),
            quoteBreakdown: filteredQuoteData.quoteBreakdown
        };

        // Send email to admin
        const result = await triggeredEmails.emailContact(ADMIN_CCTV_EMAIL_TEMPLATE_ID, contactId, {
            variables: adminEmailVariables
        });

        console.log("Admin CCTV email sent successfully");
        return { success: true, result, contactId };

    } catch (err) {
        console.error("Error sending admin CCTV email:", err);
        return { success: false, error: err.message };
    }
});

export const sendAdminAlarmEmail = webMethod(Permissions.Anyone, async (filteredQuoteData) => {
    try {
        let contactId;
        const queryResults = await contacts.queryContacts()
            .eq('info.emails.email', ADMIN_EMAIL)
            .find({ suppressAuth: true });

        const contactsWithEmail = queryResults.items;

        if (contactsWithEmail.length === 1) {
            contactId = contactsWithEmail[0]._id;
        } else if (contactsWithEmail.length > 1) {
            contactId = contactsWithEmail[0]._id;
        } else {
            // Create admin contact if doesn't exist
            const contactInfo = {
                name: {
                    first: "Admin",
                    last: "Team",
                },
                emails: [{
                    email: ADMIN_EMAIL,
                    tag: "MAIN"
                }],
            };

            const options = {
                allowDuplicates: false,
                suppressAuth: true
            };

            const contact = await contacts.createContact(contactInfo, options);
            contactId = contact._id;
        }

        // Format selected components
        let selectedComponentsDetails = "";
        filteredQuoteData.intruderComponents.forEach((component) => {
            selectedComponentsDetails += `${component.name}: Qty ${component.quantity}\n`;
        });

        // Prepare email variables
        const adminAlarmEmailVariables = {
            // Customer details
            customerName: filteredQuoteData.userDetails.name,
            customerEmail: filteredQuoteData.userDetails.email,
            customerPhone: filteredQuoteData.userDetails.phone,
            streetAddress: filteredQuoteData.userDetails.streetAddress,
            town: filteredQuoteData.userDetails.town,
            country: filteredQuoteData.userDetails.country,
            eircode: filteredQuoteData.userDetails.eircode,

            // Quote details
            selectedPackage: filteredQuoteData.selectedPackage,
            alarmMonitoring: filteredQuoteData.alarmMonitoring,
            appAccessWithAlarm: filteredQuoteData.appAccessWithAlarm,
            totalPrice: filteredQuoteData.totalPrice,

            // Property details
            numberOfAccessDoors: filteredQuoteData.numberOfAccessDoors,
            howManyAreGlazedDoors: filteredQuoteData.howManyAreGlazedDoors,
            sensorColour: filteredQuoteData.sensorColour,
            levelOfCrime: filteredQuoteData.levelOfCrime,

            // Existing setup
            existingAlarm: filteredQuoteData.existingAlarm,
            mayBeACostSaving: filteredQuoteData.mayBeACostSaving,
            atticSpaceAvailable: filteredQuoteData.atticSpaceAvailable,

            // Formatted details
            selectedComponentsDetails: selectedComponentsDetails.trim(),
            quoteBreakdown: filteredQuoteData.quoteBreakdown
        };

        // Send email to admin
        const result = await triggeredEmails.emailContact(ADMIN_ALARM_EMAIL_TEMPLATE_ID, contactId, {
            variables: adminAlarmEmailVariables
        });

        console.log("Admin Alarm email sent successfully");
        return { success: true, result, contactId };

    } catch (err) {
        console.error("Error sending admin Alarm email:", err);
        return { success: false, error: err.message };
    }
});

export const sendUserCCTVEmail = webMethod(Permissions.Anyone, async (filteredQuoteData) => {
    try {
        let contactId;
        const customerEmail = filteredQuoteData.userDetails.email;

        const queryResults = await contacts.queryContacts()
            .eq('info.emails.email', customerEmail)
            .find({ suppressAuth: true });

        const contactsWithEmail = queryResults.items;

        if (contactsWithEmail.length === 1) {
            contactId = contactsWithEmail[0]._id;
        } else if (contactsWithEmail.length > 1) {
            contactId = contactsWithEmail[0]._id;
        } else {
            // Create customer contact
            const contactInfo = {
                name: {
                    first: filteredQuoteData.userDetails.name.split(' ')[0] || filteredQuoteData.userDetails.name,
                    last: filteredQuoteData.userDetails.name.split(' ').slice(1).join(' ') || "",
                },
                emails: [{
                    email: customerEmail,
                    tag: "MAIN"
                }],
            };

            const options = {
                allowDuplicates: false,
                suppressAuth: true
            };

            const contact = await contacts.createContact(contactInfo, options);
            contactId = contact._id;
        }

        // Format camera locations for user email
        let cameraLocationDetails = "";
        filteredQuoteData.cameraLocations.forEach((camera) => {
            if (camera.locationType !== "N/A") {
                cameraLocationDetails += `${camera.cameraNumber}: ${camera.locationType} location - ${camera.location}\n`;
            } else {
                cameraLocationDetails += `${camera.cameraNumber}: ${camera.locationType}\n`;
            }
        });

        // Prepare email variables
        const userCCTVEmailVariables = {
            customerName: filteredQuoteData.userDetails.name,
            selectedPackage: filteredQuoteData.selectedPackage,
            numberOfCameras: filteredQuoteData.numberOfCameras,
            includeMonitor: filteredQuoteData.includeMonitor,
            includeAppView: filteredQuoteData.includeAppView,
            totalPrice: filteredQuoteData.totalPrice,
            cameraLocationDetails: cameraLocationDetails.trim(),
            quoteBreakdown: filteredQuoteData.quoteBreakdown
        };

        // Send email to user
        const result = await triggeredEmails.emailContact(USER_CCTV_EMAIL_TEMPLATE_ID, contactId, {
            variables: userCCTVEmailVariables
        });

        console.log("User CCTV email sent successfully");
        return { success: true, result, contactId };

    } catch (err) {
        console.error("Error sending user CCTV email:", err);
        return { success: false, error: err.message };
    }
});

export const sendUserAlarmEmail = webMethod(Permissions.Anyone, async (filteredQuoteData) => {
    try {
        let contactId;
        const customerEmail = filteredQuoteData.userDetails.email;

        const queryResults = await contacts.queryContacts()
            .eq('info.emails.email', customerEmail)
            .find({ suppressAuth: true });

        const contactsWithEmail = queryResults.items;

        if (contactsWithEmail.length === 1) {
            contactId = contactsWithEmail[0]._id;
        } else if (contactsWithEmail.length > 1) {
            contactId = contactsWithEmail[0]._id;
        } else {
            // Create customer contact
            const contactInfo = {
                name: {
                    first: filteredQuoteData.userDetails.name.split(' ')[0] || filteredQuoteData.userDetails.name,
                    last: filteredQuoteData.userDetails.name.split(' ').slice(1).join(' ') || "",
                },
                emails: [{
                    email: customerEmail,
                    tag: "MAIN"
                }],
            };

            const options = {
                allowDuplicates: false,
                suppressAuth: true
            };

            const contact = await contacts.createContact(contactInfo, options);
            contactId = contact._id;
        }

        // Format selected components for user email
        let selectedComponentsDetails = "";
        filteredQuoteData.intruderComponents.forEach((component) => {
            selectedComponentsDetails += `${component.name}: ${component.quantity} units\n`;
        });

        // Prepare email variables
        const userAlarmEmailVariables = {
            customerName: filteredQuoteData.userDetails.name,
            selectedPackage: filteredQuoteData.selectedPackage,
            alarmMonitoring: filteredQuoteData.alarmMonitoring,
            appAccessWithAlarm: filteredQuoteData.appAccessWithAlarm,
            totalPrice: filteredQuoteData.totalPrice,
            selectedComponentsDetails: selectedComponentsDetails.trim(),
            numberOfAccessDoors: filteredQuoteData.numberOfAccessDoors,
            howManyAreGlazedDoors: filteredQuoteData.howManyAreGlazedDoors,
            sensorColour: filteredQuoteData.sensorColour,
            quoteBreakdown: filteredQuoteData.quoteBreakdown
        };

        // Send email to user
        const result = await triggeredEmails.emailContact(USER_ALARM_EMAIL_TEMPLATE_ID, contactId, {
            variables: userAlarmEmailVariables
        });

        console.log("User Alarm email sent successfully");
        return { success: true, result, contactId };

    } catch (err) {
        console.error("Error sending user Alarm email:", err);
        return { success: false, error: err.message };
    }
});

// Other
export const sendAdminContactEmail = webMethod(Permissions.Anyone, async (contactData) => {
    try {
        let contactId;
        const queryResults = await contacts.queryContacts()
            .eq('info.emails.email', ADMIN_EMAIL)
            .find({ suppressAuth: true });

        const contactsWithEmail = queryResults.items;

        if (contactsWithEmail.length === 1) {
            contactId = contactsWithEmail[0]._id;
        } else if (contactsWithEmail.length > 1) {
            contactId = contactsWithEmail[0]._id;
        } else {
            // Create admin contact if doesn't exist
            const contactInfo = {
                name: {
                    first: "Admin",
                    last: "Team",
                },
                emails: [{
                    email: ADMIN_EMAIL,
                    tag: "MAIN"
                }],
            };

            const options = {
                allowDuplicates: false,
                suppressAuth: true
            };

            const contact = await contacts.createContact(contactInfo, options);
            contactId = contact._id;
        }

        // Prepare email variables for admin
        const adminContactEmailVariables = {
            // Customer details
            customerName: contactData.name,
            customerEmail: contactData.email,
            customerPhone: contactData.phone,
            streetAddress: contactData.streetAddress,
            town: contactData.town,
            country: contactData.country,
            eircode: contactData.eircode,

            // Inquiry details
            interests: contactData.interests,
            query: contactData.query,
            howDidYouHear: contactData.howDidYouHear,
        };

        // Send email to admin
        const result = await triggeredEmails.emailContact(ADMIN_CONTACT_EMAIL_TEMPLATE_ID, contactId, {
            variables: adminContactEmailVariables
        });

        console.log("Admin contact email sent successfully");
        return { success: true, result, contactId };

    } catch (err) {
        console.error("Error sending admin contact email:", err);
        return { success: false, error: err.message };
    }
});

export const sendUserContactEmail = webMethod(Permissions.Anyone, async (contactData) => {
    try {
        let contactId;
        const customerEmail = contactData.email;

        const queryResults = await contacts.queryContacts()
            .eq('info.emails.email', customerEmail)
            .find({ suppressAuth: true });

        const contactsWithEmail = queryResults.items;

        if (contactsWithEmail.length === 1) {
            contactId = contactsWithEmail[0]._id;
        } else if (contactsWithEmail.length > 1) {
            contactId = contactsWithEmail[0]._id;
        } else {
            // Create customer contact
            const contactInfo = {
                name: {
                    first: contactData.name.split(' ')[0] || contactData.name,
                    last: contactData.name.split(' ').slice(1).join(' ') || "",
                },
                emails: [{
                    email: customerEmail,
                    tag: "MAIN"
                }],
            };

            const options = {
                allowDuplicates: false,
                suppressAuth: true
            };

            const contact = await contacts.createContact(contactInfo, options);
            contactId = contact._id;
        }

        // Prepare email variables for user confirmation
        const userContactEmailVariables = {
            customerName: contactData.name,
            interests: contactData.interests,
            query: contactData.query,
        };

        // Send confirmation email to user
        const result = await triggeredEmails.emailContact(USER_CONTACT_EMAIL_TEMPLATE_ID, contactId, {
            variables: userContactEmailVariables
        });

        console.log("User contact confirmation email sent successfully");
        return { success: true, result, contactId };

    } catch (err) {
        console.error("Error sending user contact email:", err);
        return { success: false, error: err.message };
    }
});