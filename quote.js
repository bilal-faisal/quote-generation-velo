import wixData from 'wix-data';
import wixLocation from "wix-location";
import { sendAdminCCTVEmail, sendAdminAlarmEmail, sendUserCCTVEmail, sendUserAlarmEmail } from 'backend/sendEmail.web';

// Global variable to store form data
let quoteData = {
    selectedCategory: null,
    selectedPackage: null,
    numberOfCameras: null,
    includeMonitor: null,
    includeAppView: null,
    cameraLocations: [],
    installationQuestions: [],
    userDetails: null,
    alarmMonitoring: null,
    appAccessWithAlarm: null,
    intruderComponents: [],
    numberOfAccessDoors: null,
    howManyAreGlazedDoors: null,
    sensorColour: null,
    existingAlarm: null,
    mayBeACostSaving: null,
    atticSpaceAvailable: null,
    levelOfCrime: null,
};

// Global package base prices
const PACKAGE_BASE_PRICES = {
    "1-4_CAMERA_SYSTEM": 1600,
    "4-8_CAMERA_SYSTEM": 3200,
    "INTRUDER_ALARM": 1399
};

// Global intruder alarm component prices
const INTRUDER_COMPONENT_PRICES = {
    "WIRED_WIRELESS_QUAD_PIR": 100.00,
    "WIRED_WIRELESS_WINDOW_DOOR_SENSOR": 85.00,
    "WIRED_WIRELESS_PANIC_ATTACK_BUTTON": 100.00,
    "WIRED_WIRELESS_SMOKE_HEAT_CARBON_MONOXIDE_DETECTOR": 145.00,
    "WIRED_WIRELESS_SLIMLINE_KEYPAD": 200.00,
    "DECOY_BELLBOX": 70.00
};

$w.onReady(function () {

    $w('#multiStateBox').changeState("state1");
    updateProgressBar("state1");
    initializeState1();

});

function initializeState1() {
    // Get existing repeater data to preserve images
    let existingData = $w('#repeaterCategories').data;

    // Re-set the data to ensure proper functionality
    $w('#repeaterCategories').data = existingData;

    $w('#buttonNextState1').disable();

    $w('#repeaterCategories').onItemReady(($item, itemData, index) => {
        $item('#radioGroupCategory').onChange((event) => {
            handleCategorySelection($item('#textCategoryName').text);
        });
    });

    $w('#buttonNextState1').onClick((event) => {
        if (quoteData.selectedCategory) {
            if (quoteData.selectedCategory === "CCTV System") {
                $w('#multiStateBox').changeState("state11");
                updateProgressBar("state11");
                // Scroll To Top
                scrollToStateTop()

                initializeState11()
            } else if (quoteData.selectedCategory === "Intruder Alarm") {
                $w('#multiStateBox').changeState("state12");
                updateProgressBar("state12");
                // Scroll To Top
                scrollToStateTop()

                initializeState12();
            } else if (quoteData.selectedCategory === "Other") {
                wixLocation.to("/domestic-enquiry");
            }
        }
    });
}

function handleCategorySelection(categoryName) {
    quoteData.selectedCategory = categoryName;

    $w('#repeaterCategories').forEachItem(($item, itemData) => {
        if ($item('#textCategoryName').text !== categoryName) {
            $item('#radioGroupCategory').selectedIndex = undefined;
        }
    });

    $w('#buttonNextState1').enable();
}

function initializeState11() {
    // Get existing repeater data to preserve images
    let existingData = $w('#repeaterCCTVPackages').data;

    // Re-set the data to ensure proper functionality
    $w('#repeaterCCTVPackages').data = existingData;

    $w('#buttonNextState11').disable();

    $w('#repeaterCCTVPackages').onItemReady(($item, itemData, index) => {
        $item('#radioGroupPackage').onChange((event) => {
            handlePackageSelection($item('#textPackageName').text);
        });
    });

    $w('#buttonNextState11').onClick((event) => {
        if (quoteData.selectedPackage) {
            if (quoteData.selectedPackage === "1-4 Camera System") {
                $w('#multiStateBox').changeState("state111");
                updateProgressBar("state111");
                // Scroll To Top
                scrollToStateTop()

                initializeState111()
            } else if (quoteData.selectedPackage === "4-8 Camera System") {
                $w('#multiStateBox').changeState("state112");
                updateProgressBar("state112");
                // Scroll To Top
                scrollToStateTop()

                initializeState112()
            }
        }
    });

    $w('#buttonBackState11').onClick((event) => {
        $w('#multiStateBox').changeState("state1");
        updateProgressBar("state1");
        // Scroll To Top
        scrollToStateTop()

    });
}

function handlePackageSelection(packageName) {
    quoteData.selectedPackage = packageName;

    $w('#repeaterCCTVPackages').forEachItem(($item, itemData) => {
        if ($item('#textPackageName').text !== packageName) {
            $item('#radioGroupPackage').selectedIndex = undefined;
        }
    });

    $w('#buttonNextState11').enable();
}

function initializeState111() {
    $w('#buttonNext111').enable();

    $w('#dropdownNumberOfCameras111').onChange(() => checkState111Completion());
    $w('#dropdownIncludeMonitor111').onChange(() => checkState111Completion());
    $w('#dropdownIncludeAppView111').onChange(() => checkState111Completion());

    $w('#buttonNext111').onClick((event) => {
        saveState111Data();
        $w('#multiStateBox').changeState("state1111");
        updateProgressBar("state1111");
        // Scroll To Top
        scrollToStateTop()

        initializeState1111()
    });

    $w('#buttonBack111').onClick((event) => {
        $w('#multiStateBox').changeState("state11");
        updateProgressBar("state11");
        // Scroll To Top
        scrollToStateTop()

    });
}

function checkState111Completion() {
    const isComplete = $w('#dropdownNumberOfCameras111').value !== undefined &&
        $w('#dropdownIncludeMonitor111').value !== undefined &&
        $w('#dropdownIncludeAppView111').value !== undefined;

    if (isComplete) {
        $w('#buttonNext111').enable();
    } else {
        $w('#buttonNext111').disable();
    }
}

function saveState111Data() {
    quoteData.numberOfCameras = {
        label: $w('#dropdownNumberOfCameras111').selectedIndex !== undefined ?
            $w('#dropdownNumberOfCameras111').options[$w('#dropdownNumberOfCameras111').selectedIndex].label : "",
        value: $w('#dropdownNumberOfCameras111').value
    };
    quoteData.includeMonitor = {
        label: $w('#dropdownIncludeMonitor111').selectedIndex !== undefined ?
            $w('#dropdownIncludeMonitor111').options[$w('#dropdownIncludeMonitor111').selectedIndex].label : "",
        value: $w('#dropdownIncludeMonitor111').value
    };
    quoteData.includeAppView = {
        label: $w('#dropdownIncludeAppView111').selectedIndex !== undefined ?
            $w('#dropdownIncludeAppView111').options[$w('#dropdownIncludeAppView111').selectedIndex].label : "",
        value: $w('#dropdownIncludeAppView111').value
    };
}

function initializeState112() {
    $w('#buttonNext112').enable();

    $w('#dropdownNumberOfCameras112').onChange(() => checkState112Completion());
    $w('#dropdownIncludeMonitor112').onChange(() => checkState112Completion());
    $w('#dropdownIncludeAppView112').onChange(() => checkState112Completion());

    $w('#buttonNext112').onClick((event) => {
        saveState112Data();
        $w('#multiStateBox').changeState("state1111");
        updateProgressBar("state1111");
        // Scroll To Top
        scrollToStateTop()

        initializeState1111()
    });

    $w('#buttonBack112').onClick((event) => {
        $w('#multiStateBox').changeState("state11");
        updateProgressBar("state11");
        // Scroll To Top
        scrollToStateTop()

    });
}

function checkState112Completion() {
    const isComplete = $w('#dropdownNumberOfCameras112').value !== undefined &&
        $w('#dropdownIncludeMonitor112').value !== undefined &&
        $w('#dropdownIncludeAppView112').value !== undefined;

    if (isComplete) {
        $w('#buttonNext112').enable();
    } else {
        $w('#buttonNext112').disable();
    }
}

function saveState112Data() {
    quoteData.numberOfCameras = {
        label: $w('#dropdownNumberOfCameras112').selectedIndex !== undefined ?
            $w('#dropdownNumberOfCameras112').options[$w('#dropdownNumberOfCameras112').selectedIndex].label : "",
        value: $w('#dropdownNumberOfCameras112').value
    };
    quoteData.includeMonitor = {
        label: $w('#dropdownIncludeMonitor112').selectedIndex !== undefined ?
            $w('#dropdownIncludeMonitor112').options[$w('#dropdownIncludeMonitor112').selectedIndex].label : "",
        value: $w('#dropdownIncludeMonitor112').value
    };
    quoteData.includeAppView = {
        label: $w('#dropdownIncludeAppView112').selectedIndex !== undefined ?
            $w('#dropdownIncludeAppView112').options[$w('#dropdownIncludeAppView112').selectedIndex].label : "",
        value: $w('#dropdownIncludeAppView112').value
    };
}

function initializeState1111() {
    setupCameraLocationRepeater();

    $w('#buttonNext1111').disable();

    $w('#buttonNext1111').onClick((event) => {
        saveState1111Data();
        $w('#multiStateBox').changeState("state11111");
        updateProgressBar("state11111");
        // Scroll To Top
        scrollToStateTop()

        initializeState11111();
    });

    $w('#buttonBack1111').onClick((event) => {
        if (quoteData.selectedPackage === "1-4 Camera System") {
            $w('#multiStateBox').changeState("state111");
            updateProgressBar("state111");
            // Scroll To Top
            scrollToStateTop()

        } else if (quoteData.selectedPackage === "4-8 Camera System") {
            $w('#multiStateBox').changeState("state112");
            updateProgressBar("state112");
            // Scroll To Top
            scrollToStateTop()

        }
    });
}

function setupCameraLocationRepeater() {
    // Get number of cameras from the label (first character)
    const numberOfCameras = Number(quoteData.numberOfCameras.label.charAt(0));

    // Create data for repeater based on number of cameras
    const cameraData = [];
    for (let i = 1; i <= numberOfCameras; i++) {
        cameraData.push({
            _id: i.toString(),
            cameraNumber: `Camera ${i}`
        });
    }

    $w('#repeaterCameraLocations').data = cameraData;

    $w('#repeaterCameraLocations').onItemReady(($item, itemData, index) => {
        $item('#textCameraNumber').text = itemData.cameraNumber;

        // Initially collapse input field
        $item('#inputCameraLocation').collapse();

        $item('#radioGroupLocationType').onChange((event) => {
            handleLocationTypeChange($item, itemData);
        });

        $item('#inputCameraLocation').onInput(() => {
            checkState1111Completion();
        });
    });
}

function handleLocationTypeChange($item, itemData) {
    const selectedValue = $item('#radioGroupLocationType').value;

    if (selectedValue === "External" || selectedValue === "Internal") {
        $item('#inputCameraLocation').expand();
    } else if (selectedValue === "N/A") {
        $item('#inputCameraLocation').collapse();
        $item('#inputCameraLocation').value = ""; // Clear any previous input
    }

    checkState1111Completion();
}

function checkState1111Completion() {
    let allComplete = true;

    $w('#repeaterCameraLocations').forEachItem(($item, itemData) => {
        const locationType = $item('#radioGroupLocationType').value;

        if (!locationType) {
            allComplete = false;
            return;
        }

        if ((locationType === "External" || locationType === "Internal") &&
            !$item('#inputCameraLocation').value) {
            allComplete = false;
            return;
        }
    });

    if (allComplete) {
        $w('#buttonNext1111').enable();
    } else {
        $w('#buttonNext1111').disable();
    }
}

function saveState1111Data() {
    quoteData.cameraLocations = [];

    $w('#repeaterCameraLocations').forEachItem(($item, itemData) => {
        quoteData.cameraLocations.push({
            cameraNumber: itemData.cameraNumber,
            locationType: $item('#radioGroupLocationType').value,
            location: $item('#inputCameraLocation').value || ""
        });
    });
}

function initializeState11111() {
    setupInstallationQuestions();

    $w('#buttonNext11111').disable();

    $w('#buttonNext11111').onClick((event) => {
        saveState11111Data();
        $w('#multiStateBox').changeState("state111111");
        updateProgressBar("state111111");
        // Scroll To Top
        scrollToStateTop()

        initializeState111111()
    });

    $w('#buttonBack11111').onClick((event) => {
        $w('#multiStateBox').changeState("state1111");
        updateProgressBar("state1111");
        // Scroll To Top
        scrollToStateTop()

    });
}

function setupInstallationQuestions() {
    const questionsData = [{
        _id: "1",
        question: "What best describes your needs?",
        options: ["First time CCTV customer", "Upgrading an old system"]
    },
    {
        _id: "2",
        question: "Is your premises wired for a CCTV? (If yes, a cost reduction may be available.)",
        options: ["Yes", "No"]
    },
    {
        _id: "3",
        question: "Is your attic space accessible?",
        options: ["Yes", "No"]
    },
    {
        _id: "4",
        question: "Are you interested in hearing about CCTV Monitoring? This is a 24/7 Intrusion detection service where we can monitor your CCTV.",
        options: ["Yes", "No"]
    }
    ];

    $w('#repeaterInstallationQuestions').data = questionsData;

    $w('#repeaterInstallationQuestions').onItemReady(($item, itemData, index) => {
        $item('#textQuestion').text = itemData.question;

        $item('#radioGroupInstallationQuestionOptions').options = itemData.options.map((option, index) => ({
            label: option,
            value: option
        }));

        $item('#radioGroupInstallationQuestionOptions').onChange((event) => {
            checkState11111Completion();
        });
    });
}

function checkState11111Completion() {
    let allAnswered = true;

    $w('#repeaterInstallationQuestions').forEachItem(($item, itemData) => {
        if ($item('#radioGroupInstallationQuestionOptions').selectedIndex === undefined) {
            allAnswered = false;
            return;
        }
    });

    if (allAnswered) {
        $w('#buttonNext11111').enable();
    } else {
        $w('#buttonNext11111').disable();
    }
}

function saveState11111Data() {
    quoteData.installationQuestions = [];

    $w('#repeaterInstallationQuestions').forEachItem(($item, itemData) => {
        const selectedIndex = $item('#radioGroupInstallationQuestionOptions').selectedIndex;
        quoteData.installationQuestions.push({
            question: itemData.question,
            answer: selectedIndex !== undefined ? itemData.options[selectedIndex] : ""
        });
    });
}

function initializeState111111() {
    $w('#buttonFinish111111').disable();

    // Add input handlers for validation
    $w('#inputName').onInput(() => checkState111111Completion());
    $w('#inputEmail').onInput(() => checkState111111Completion());
    $w('#inputPhone').onInput(() => checkState111111Completion());
    $w('#inputStreetAddress').onInput(() => checkState111111Completion());
    $w('#inputTown').onInput(() => checkState111111Completion());
    $w('#inputCountry').onInput(() => checkState111111Completion());
    $w('#inputEircode').onInput(() => checkState111111Completion());

    $w('#buttonFinish111111').onClick((event) => {
        saveState111111Data();
        processQuoteData();
    });

    $w('#buttonBack111111').onClick((event) => {
        $w('#multiStateBox').changeState("state11111");
        updateProgressBar("state11111");
        // Scroll To Top
        scrollToStateTop()

    });
}

function checkState111111Completion() {
    const isNameValid = $w('#inputName').value.trim() !== "";
    const isEmailValid = $w('#inputEmail').value.trim() !== "" && $w('#inputEmail').valid;
    const isPhoneValid = $w('#inputPhone').value.trim() !== "" && $w('#inputPhone').valid;
    const isStreetAddressValid = $w('#inputStreetAddress').value.trim() !== "";
    const isTownValid = $w('#inputTown').value.trim() !== "";
    const isCountryValid = $w('#inputCountry').value.trim() !== "";
    const isEircodeValid = $w('#inputEircode').value.trim() !== "";

    const allValid = isNameValid && isEmailValid && isPhoneValid &&
        isStreetAddressValid && isTownValid && isCountryValid && isEircodeValid;

    if (allValid) {
        $w('#buttonFinish111111').enable();
    } else {
        $w('#buttonFinish111111').disable();
    }
}

function saveState111111Data() {
    quoteData.userDetails = {
        name: $w('#inputName').value.trim(),
        email: $w('#inputEmail').value.trim(),
        phone: $w('#inputPhone').value.trim(),
        streetAddress: $w('#inputStreetAddress').value.trim(),
        town: $w('#inputTown').value.trim(),
        country: $w('#inputCountry').value.trim(),
        eircode: $w('#inputEircode').value.trim()
    };
}

function initializeState12() {
    // Get existing repeater data to preserve images
    let existingData = $w('#repeaterIntruderPackages').data;

    // Re-set the data to ensure proper functionality
    $w('#repeaterIntruderPackages').data = existingData;

    $w('#buttonNextState12').disable();

    $w('#repeaterIntruderPackages').onItemReady(($item, itemData, index) => {
        $item('#radioGroupPackage12').onChange((event) => {
            handleIntruderPackageSelection($item('#textPackageName12').text);
        });
    });

    $w('#buttonNextState12').onClick((event) => {
        if (quoteData.selectedPackage) {
            $w('#multiStateBox').changeState("state121");
            updateProgressBar("state121");
            // Scroll To Top
            scrollToStateTop()

            initializeState121()
        }
    });

    $w('#buttonBackState12').onClick((event) => {
        $w('#multiStateBox').changeState("state1");
        updateProgressBar("state1");
        // Scroll To Top
        scrollToStateTop()

    });
}

function handleIntruderPackageSelection(packageName) {
    quoteData.selectedPackage = packageName;

    $w('#repeaterIntruderPackages').forEachItem(($item, itemData) => {
        if ($item('#textPackageName12').text !== packageName) {
            $item('#radioGroupPackage12').selectedIndex = undefined;
        }
    });

    $w('#buttonNextState12').enable();
}

function initializeState121() {
    setupIntruderOptionsRepeater();

    $w('#buttonNext121').disable();

    // Add change handlers for the two main dropdowns
    $w('#dropdownWhatAlarmMonitoring').onChange(() => checkState121Completion());
    $w('#radioGroupAppAccessWithAlarm').onChange(() => checkState121Completion());

    $w('#buttonNext121').onClick((event) => {
        saveState121Data();
        $w('#multiStateBox').changeState("state1211");
        updateProgressBar("state1211");
        // Scroll To Top
        scrollToStateTop()

        initializeState1211()
    });

    $w('#buttonBack121').onClick((event) => {
        $w('#multiStateBox').changeState("state12");
        updateProgressBar("state12");
        // Scroll To Top
        scrollToStateTop()

    });
}

function setupIntruderOptionsRepeater() {
    // Get existing repeater data and add prices
    let existingData = $w('#repeaterIntruderOptions').data;

    // Add unit prices to the data
    existingData = existingData.map((item, index) => {
        const prices = [
            INTRUDER_COMPONENT_PRICES.WIRED_WIRELESS_QUAD_PIR,
            INTRUDER_COMPONENT_PRICES.WIRED_WIRELESS_WINDOW_DOOR_SENSOR,
            INTRUDER_COMPONENT_PRICES.WIRED_WIRELESS_PANIC_ATTACK_BUTTON,
            INTRUDER_COMPONENT_PRICES.WIRED_WIRELESS_SMOKE_HEAT_CARBON_MONOXIDE_DETECTOR,
            INTRUDER_COMPONENT_PRICES.WIRED_WIRELESS_SLIMLINE_KEYPAD,
            INTRUDER_COMPONENT_PRICES.DECOY_BELLBOX
        ];

        return {
            ...item,
            unitPrice: prices[index]
        };
    });

    $w('#repeaterIntruderOptions').data = existingData;

    $w('#repeaterIntruderOptions').onItemReady(($item, itemData, index) => {
        // Setup quantity dropdown with options 0-20
        const quantityOptions = [];
        for (let i = 0; i <= 20; i++) {
            quantityOptions.push({
                label: i.toString(),
                value: i.toString()
            });
        }

        $item('#dropdownQuantity').options = quantityOptions;
        $item('#dropdownQuantity').selectedIndex = 0;

        $item('#dropdownQuantity').onChange(() => {
            checkState121Completion();
        });
    });
}

function checkState121Completion() {
    const isMonitoringSelected = $w('#dropdownWhatAlarmMonitoring').value !== undefined;
    const isAppAccessSelected = $w('#radioGroupAppAccessWithAlarm').selectedIndex !== undefined;

    if (isMonitoringSelected && isAppAccessSelected) {
        $w('#buttonNext121').enable();
    } else {
        $w('#buttonNext121').disable();
    }
}

function saveState121Data() {
    // Save main dropdown selections
    quoteData.alarmMonitoring = {
        label: $w('#dropdownWhatAlarmMonitoring').selectedIndex !== undefined ?
            $w('#dropdownWhatAlarmMonitoring').options[$w('#dropdownWhatAlarmMonitoring').selectedIndex].label : "",
        value: $w('#dropdownWhatAlarmMonitoring').value
    };

    quoteData.appAccessWithAlarm = {
        label: $w('#radioGroupAppAccessWithAlarm').selectedIndex !== undefined ?
            $w('#radioGroupAppAccessWithAlarm').options[$w('#radioGroupAppAccessWithAlarm').selectedIndex].label : "",
        value: $w('#radioGroupAppAccessWithAlarm').value
    };

    // Save all intruder component quantities with unit prices
    quoteData.intruderComponents = [];

    $w('#repeaterIntruderOptions').forEachItem(($item, itemData) => {
        const quantity = parseInt($item('#dropdownQuantity').value);

        // Only save items with quantity > 0
        if (quantity > 0) {
            quoteData.intruderComponents.push({
                name: $item('#textNameIntruderOption').text,
                description: $item('#textDescIntruderOption').text,
                priceDisplay: $item('#textPriceDisplayIntruderOption').text,
                quantity: quantity
            });
        }
        // quoteData.intruderComponents.push({
        //     name: $item('#textNameIntruderOption').text,
        //     quantity: quantity,
        //     unitPrice: itemData.unitPrice
        // });
    });
}

function initializeState1211() {
    // Set initial glazed doors options based on default access doors value (1)
    updateGlazedDoorsOptions();

    $w('#buttonNext1211').disable();

    $w('#dropdownNumberOfAccessDoors').onChange(() => {
        updateGlazedDoorsOptions();
        checkState1211Completion();
    });

    $w('#dropdownHowManyAreGlazedDoors').onChange(() => {
        checkState1211Completion();
    });

    $w('#dropdownSensorColour').onChange(() => {
        checkState1211Completion();
    });

    $w('#buttonNext1211').onClick((event) => {
        saveState1211Data();
        $w('#multiStateBox').changeState("state12111");
        updateProgressBar("state12111");
        // Scroll To Top
        scrollToStateTop()

        initializeState12111();
    });

    $w('#buttonBack1211').onClick((event) => {
        $w('#multiStateBox').changeState("state121");
        updateProgressBar("state121");
        // Scroll To Top
        scrollToStateTop()

    });

    $w('#buttonNext1211').enable();
}

function updateGlazedDoorsOptions() {
    const accessDoorsValue = $w('#dropdownNumberOfAccessDoors').value;
    let maxGlazedDoors = 1; // Default when access doors is 1

    if (accessDoorsValue === "10+") {
        maxGlazedDoors = 10;
    } else {
        maxGlazedDoors = parseInt(accessDoorsValue);
    }

    // Create options from 1 to maxGlazedDoors
    const glazedOptions = [];
    for (let i = 1; i <= maxGlazedDoors; i++) {
        glazedOptions.push({
            label: i.toString(),
            value: i.toString()
        });
    }

    // Add "10+" option if maxGlazedDoors is 10
    if (maxGlazedDoors === 10) {
        glazedOptions.push({
            label: "10+",
            value: "10+"
        });
    }

    $w('#dropdownHowManyAreGlazedDoors').options = glazedOptions;
    $w('#dropdownHowManyAreGlazedDoors').selectedIndex = 0; // Reset to first option (1)
}

function checkState1211Completion() {
    const isAccessDoorsSelected = $w('#dropdownNumberOfAccessDoors').value !== undefined;
    const isGlazedDoorsSelected = $w('#dropdownHowManyAreGlazedDoors').value !== undefined;
    const isSensorColourSelected = $w('#dropdownSensorColour').value !== undefined;

    if (isAccessDoorsSelected && isGlazedDoorsSelected && isSensorColourSelected) {
        $w('#buttonNext1211').enable();
    } else {
        $w('#buttonNext1211').disable();
    }
}

function saveState1211Data() {
    quoteData.numberOfAccessDoors = {
        label: $w('#dropdownNumberOfAccessDoors').selectedIndex !== undefined ?
            $w('#dropdownNumberOfAccessDoors').options[$w('#dropdownNumberOfAccessDoors').selectedIndex].label : "",
        value: $w('#dropdownNumberOfAccessDoors').value
    };

    quoteData.howManyAreGlazedDoors = {
        label: $w('#dropdownHowManyAreGlazedDoors').selectedIndex !== undefined ?
            $w('#dropdownHowManyAreGlazedDoors').options[$w('#dropdownHowManyAreGlazedDoors').selectedIndex].label : "",
        value: $w('#dropdownHowManyAreGlazedDoors').value
    };

    quoteData.sensorColour = {
        label: $w('#dropdownSensorColour').selectedIndex !== undefined ?
            $w('#dropdownSensorColour').options[$w('#dropdownSensorColour').selectedIndex].label : "",
        value: $w('#dropdownSensorColour').value
    };
}

function initializeState12111() {
    $w('#buttonNext12111').disable();

    $w('#radioGroupExistingAlarm').onChange(() => checkState12111Completion());
    $w('#radioGroupMayBeACostSaving').onChange(() => checkState12111Completion());
    $w('#radioGroupAtticSpaceAvailable').onChange(() => checkState12111Completion());
    $w('#dropdownLevelOfCrime').onChange(() => checkState12111Completion());

    $w('#buttonNext12111').onClick((event) => {
        saveState12111Data();
        $w('#multiStateBox').changeState("state111111");
        updateProgressBar("state111111");
        // Scroll To Top
        scrollToStateTop()

        initializeState111111();
    });

    $w('#buttonBack12111').onClick((event) => {
        $w('#multiStateBox').changeState("state1211");
        updateProgressBar("state1211");
        // Scroll To Top
        scrollToStateTop()

    });
}

function checkState12111Completion() {
    const isExistingAlarmSelected = $w('#radioGroupExistingAlarm').selectedIndex !== undefined;
    const isCostSavingSelected = $w('#radioGroupMayBeACostSaving').selectedIndex !== undefined;
    const isAtticSpaceSelected = $w('#radioGroupAtticSpaceAvailable').selectedIndex !== undefined;
    const isLevelOfCrimeSelected = $w('#dropdownLevelOfCrime').value !== undefined;

    if (isExistingAlarmSelected && isCostSavingSelected && isAtticSpaceSelected && isLevelOfCrimeSelected) {
        $w('#buttonNext12111').enable();
    } else {
        $w('#buttonNext12111').disable();
    }
}

function saveState12111Data() {
    quoteData.existingAlarm = {
        label: $w('#radioGroupExistingAlarm').selectedIndex !== undefined ?
            $w('#radioGroupExistingAlarm').options[$w('#radioGroupExistingAlarm').selectedIndex].label : "",
        value: $w('#radioGroupExistingAlarm').value
    };

    quoteData.mayBeACostSaving = {
        label: $w('#radioGroupMayBeACostSaving').selectedIndex !== undefined ?
            $w('#radioGroupMayBeACostSaving').options[$w('#radioGroupMayBeACostSaving').selectedIndex].label : "",
        value: $w('#radioGroupMayBeACostSaving').value
    };

    quoteData.atticSpaceAvailable = {
        label: $w('#radioGroupAtticSpaceAvailable').selectedIndex !== undefined ?
            $w('#radioGroupAtticSpaceAvailable').options[$w('#radioGroupAtticSpaceAvailable').selectedIndex].label : "",
        value: $w('#radioGroupAtticSpaceAvailable').value
    };

    quoteData.levelOfCrime = {
        label: $w('#dropdownLevelOfCrime').selectedIndex !== undefined ?
            $w('#dropdownLevelOfCrime').options[$w('#dropdownLevelOfCrime').selectedIndex].label : "",
        value: $w('#dropdownLevelOfCrime').value
    };
}

function scrollToStateTop() {
    $w('#lineTop').scrollTo()
}

function calculateTotalPrice() {
    let totalPrice = 0;
    let quoteBreakdown = "";

    if (quoteData.selectedCategory === "CCTV System") {
        // Base package price
        let basePrice = 0;
        if (quoteData.selectedPackage === "1-4 Camera System") {
            basePrice = PACKAGE_BASE_PRICES["1-4_CAMERA_SYSTEM"];
        } else if (quoteData.selectedPackage === "4-8 Camera System") {
            basePrice = PACKAGE_BASE_PRICES["4-8_CAMERA_SYSTEM"];
        }

        totalPrice += basePrice;
        quoteBreakdown += `${quoteData.selectedPackage}: €${basePrice.toFixed(2)}\n`;

        // Add camera quantity cost
        if (quoteData.numberOfCameras && quoteData.numberOfCameras.value) {
            const cameraPrice = parseFloat(quoteData.numberOfCameras.value);
            totalPrice += cameraPrice;
            quoteBreakdown += `${quoteData.numberOfCameras.label}: €${cameraPrice.toFixed(2)}\n`;
        }

        // Add monitor cost
        if (quoteData.includeMonitor && quoteData.includeMonitor.value) {
            const monitorPrice = parseFloat(quoteData.includeMonitor.value);
            totalPrice += monitorPrice;
            quoteBreakdown += `${quoteData.includeMonitor.label}: €${monitorPrice.toFixed(2)}\n`;
        }

        // Add app view cost
        if (quoteData.includeAppView && quoteData.includeAppView.value) {
            const appViewPrice = parseFloat(quoteData.includeAppView.value);
            totalPrice += appViewPrice;
            quoteBreakdown += `${quoteData.includeAppView.label}: €${appViewPrice.toFixed(2)}\n`;
        }
    } else if (quoteData.selectedCategory === "Intruder Alarm") {
        // Base package price
        const basePrice = PACKAGE_BASE_PRICES.INTRUDER_ALARM;
        totalPrice += basePrice;
        quoteBreakdown += `${quoteData.selectedPackage}: €${basePrice.toFixed(2)}\n`;

        // Add-ons
        if (quoteData.alarmMonitoring && quoteData.alarmMonitoring.value) {
            const monitoringPrice = parseFloat(quoteData.alarmMonitoring.value);
            totalPrice += monitoringPrice;
            quoteBreakdown += `${quoteData.alarmMonitoring.label}: €${monitoringPrice.toFixed(2)}\n`;
        }

        if (quoteData.appAccessWithAlarm && quoteData.appAccessWithAlarm.value) {
            const appAccessPrice = parseFloat(quoteData.appAccessWithAlarm.value);
            totalPrice += appAccessPrice;
            quoteBreakdown += `${quoteData.appAccessWithAlarm.label}: €${appAccessPrice.toFixed(2)}\n`;
        }

        // Intruder components - FIXED SECTION
        if (quoteData.intruderComponents && quoteData.intruderComponents.length > 0) {
            quoteBreakdown += "\nAdditional Components:\n";
            quoteData.intruderComponents.forEach(component => {
                if (component.quantity > 0) {
                    // Extract price from priceDisplay string like "€100.00 inc VAT"
                    const priceMatch = component.priceDisplay.match(/€(\d+\.?\d*)/);
                    const unitPrice = priceMatch ? parseFloat(priceMatch[1]) : 0;

                    const componentTotal = unitPrice * component.quantity;
                    totalPrice += componentTotal;
                    quoteBreakdown += `${component.name} (${component.quantity}x): €${componentTotal.toFixed(2)}\n`;
                }
            });
        }
    }

    quoteBreakdown += `\nTotal Price: €${totalPrice.toFixed(2)}`;

    return {
        totalPrice: totalPrice,
        breakdown: quoteBreakdown
    };
}

async function processQuoteData() {
    let filteredQuoteData = {};

    if (quoteData.selectedCategory === "CCTV System") {
        filteredQuoteData = {
            selectedCategory: quoteData.selectedCategory,
            selectedPackage: quoteData.selectedPackage,
            numberOfCameras: quoteData.numberOfCameras["label"].split(" ")[0],
            includeMonitor: quoteData.includeMonitor["label"],
            includeAppView: quoteData.includeAppView["label"],
            cameraLocations: quoteData.cameraLocations,
            installationQuestions: quoteData.installationQuestions,
            userDetails: quoteData.userDetails,
            totalPrice: 0,
            quoteBreakdown: ""
        };
    } else if (quoteData.selectedCategory === "Intruder Alarm") {
        filteredQuoteData = {
            selectedCategory: quoteData.selectedCategory,
            selectedPackage: quoteData.selectedPackage,
            intruderComponents: quoteData.intruderComponents,
            alarmMonitoring: quoteData.alarmMonitoring["label"],
            appAccessWithAlarm: quoteData.appAccessWithAlarm["label"],
            numberOfAccessDoors: quoteData.numberOfAccessDoors["label"],
            howManyAreGlazedDoors: quoteData.howManyAreGlazedDoors["label"],
            sensorColour: quoteData.sensorColour["label"],
            existingAlarm: quoteData.existingAlarm["label"],
            mayBeACostSaving: quoteData.mayBeACostSaving["label"],
            atticSpaceAvailable: quoteData.atticSpaceAvailable["label"],
            levelOfCrime: quoteData.levelOfCrime["label"],
            userDetails: quoteData.userDetails,
            totalPrice: 0,
            quoteBreakdown: ""
        };
    }

    console.log("Filtered Quote Data:", filteredQuoteData);

    // Calculate pricing
    const priceCalculation = calculateTotalPrice();
    filteredQuoteData.totalPrice = priceCalculation.totalPrice;
    filteredQuoteData.quoteBreakdown = priceCalculation.breakdown;

    // Initialize final quote state and Navigate to it
    initializeFinalState(priceCalculation);
    $w('#multiStateBox').changeState("stateQuote");
    updateProgressBar("stateQuote");
    // Scroll To Top
    scrollToStateTop()

    try {
        // Save to database
        await saveToDatabase(filteredQuoteData);

        // Send email to admin
        await sendEmailToAdmin(filteredQuoteData);

        // Send email to admin
        await sendEmailToUser(filteredQuoteData)

    } catch (error) {
        console.error("Error in processQuoteData:", error);
    }

    // - Send email to customer
}

function initializeFinalState(priceCalculation) {
    // Set heading based on category
    if (quoteData.selectedCategory === "CCTV System") {
        $w('#textHeading').text = "CCTV System Quote";
    } else if (quoteData.selectedCategory === "Intruder Alarm") {
        $w('#textHeading').text = "Intruder Alarm Quote";
    }

    // Set quote total
    $w('#textQuote').text = `Your Estimate = €${priceCalculation.totalPrice.toFixed(2)} inc VAT`;

    // Set info with user's email
    $w('#textInfo').text = `We have emailed your quote to ${quoteData.userDetails.email} and a customer rep will be in touch shortly.`;
}

async function saveToDatabase(filteredQuoteData) {
    try {
        const result = await wixData.save("Submissions", filteredQuoteData);
        console.log("Quote saved successfully:", result);
        return result;
    } catch (error) {
        console.error("Error saving quote:", error);
        throw error; // Re-throw so calling function can handle it if needed
    }
}

async function sendEmailToAdmin(filteredQuoteData) {
    try {
        if (quoteData.selectedCategory === "CCTV System") {
            // Send admin email for CCTV
            const result = await sendAdminCCTVEmail(filteredQuoteData);
            if (result.success) {
                console.log("Admin CCTV email sent successfully");
            } else {
                console.error("Failed to send admin CCTV email:", result.error);
            }
        } else if (quoteData.selectedCategory === "Intruder Alarm") {
            // Send admin email for Alarm
            const result = await sendAdminAlarmEmail(filteredQuoteData);
            if (result.success) {
                console.log("Admin Alarm email sent successfully");
            } else {
                console.error("Failed to send admin Alarm email:", result.error);
            }
        }
    } catch (error) {
        console.error("Error sending admin email:", error);
    }
}

async function sendEmailToUser(filteredQuoteData) {
    try {
        if (quoteData.selectedCategory === "CCTV System") {
            // Send user email for CCTV
            const result = await sendUserCCTVEmail(filteredQuoteData);
            if (result.success) {
                console.log("User CCTV email sent successfully");
            } else {
                console.error("Failed to send user CCTV email:", result.error);
            }
        } else if (quoteData.selectedCategory === "Intruder Alarm") {
            // Send user email for Alarm
            const result = await sendUserAlarmEmail(filteredQuoteData);
            if (result.success) {
                console.log("User Alarm email sent successfully");
            } else {
                console.error("Failed to send user Alarm email:", result.error);
            }
        }
    } catch (error) {
        console.error("Error sending user email:", error);
    }
}

function updateProgressBar(currentState) {
    let progressPercentage = 0;

    switch (currentState) {
        // Initial states
        case "state1":
            progressPercentage = 10;
            break;

        // CCTV package selection
        case "state11":
            progressPercentage = 20;
            break;

        // Intruder Alarm package selection
        case "state12":
            progressPercentage = 20;
            break;

        // CCTV configuration states
        case "state111": // 1-4 Camera System config
        case "state112": // 4-8 Camera System config
            progressPercentage = 35;
            break;

        // Intruder Alarm configuration
        case "state121":
            progressPercentage = 35;
            break;

        // Camera locations (shared by both CCTV flows)
        case "state1111":
            progressPercentage = 50;
            break;

        // Intruder Alarm property details
        case "state1211":
            progressPercentage = 50;
            break;

        // CCTV installation questions
        case "state11111":
            progressPercentage = 65;
            break;

        // Intruder Alarm additional details
        case "state12111":
            progressPercentage = 65;
            break;

        // User details (shared by all flows)
        case "state111111":
            progressPercentage = 80;
            break;

        // Final quote state
        case "stateQuote":
            progressPercentage = 100;
            break;

        default:
            progressPercentage = 0;
            break;
    }

    // Update the progress bar element
    $w('#progressBar').value = progressPercentage;

    // Optional: Update progress text
    $w('#textProgressBar').text = `${progressPercentage}% complete`;

    console.log(`Progress updated: ${currentState} = ${progressPercentage}%`);
}