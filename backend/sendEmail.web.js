import { Permissions, webMethod } from 'wix-web-module';
import { contacts, triggeredEmails } from 'wix-crm-backend';

const ADMIN_CCTV_EMAIL_TEMPLATE_ID = 'Uvk9GF3';
const ADMIN_ALARM_EMAIL_TEMPLATE_ID = 'UvkNh35';
const ADMIN_EMAIL = 'bilal.faisal31@gmail.com';

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