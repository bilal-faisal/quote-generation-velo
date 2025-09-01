import wixLocation from "wix-location"

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
                initializeState11()
            } else if (quoteData.selectedCategory === "Intruder Alarm") {
                $w('#multiStateBox').changeState("state12");
                initializeState12();
            } else if (quoteData.selectedCategory === "Other") {
                wixLocation.to("https://google.com");
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
                initializeState111()
            } else if (quoteData.selectedPackage === "4-8 Camera System") {
                $w('#multiStateBox').changeState("state112");
                initializeState112()
            }
        }
    });

    $w('#buttonBackState11').onClick((event) => {
        $w('#multiStateBox').changeState("state1");
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
        initializeState1111()
    });

    $w('#buttonBack111').onClick((event) => {
        $w('#multiStateBox').changeState("state11");
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
        initializeState1111()
    });

    $w('#buttonBack112').onClick((event) => {
        $w('#multiStateBox').changeState("state11");
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
        initializeState11111();
    });

    $w('#buttonBack1111').onClick((event) => {
        if (quoteData.selectedPackage === "1-4 Camera System") {
            $w('#multiStateBox').changeState("state111");
        } else if (quoteData.selectedPackage === "4-8 Camera System") {
            $w('#multiStateBox').changeState("state112");
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
        initializeState111111()
    });

    $w('#buttonBack11111').onClick((event) => {
        $w('#multiStateBox').changeState("state1111");
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
            initializeState121()
        }
    });

    $w('#buttonBackState12').onClick((event) => {
        $w('#multiStateBox').changeState("state1");
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
        initializeState1211()
    });

    $w('#buttonBack121').onClick((event) => {
        $w('#multiStateBox').changeState("state12");
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

        quoteData.intruderComponents.push({
            name: $item('#textNameIntruderOption').text,
            quantity: quantity,
            unitPrice: itemData.unitPrice
        });
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
        initializeState12111();
    });

    $w('#buttonBack1211').onClick((event) => {
        $w('#multiStateBox').changeState("state121");
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
        initializeState111111();
    });

    $w('#buttonBack12111').onClick((event) => {
        $w('#multiStateBox').changeState("state1211");
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

        // Intruder components
        if (quoteData.intruderComponents && quoteData.intruderComponents.length > 0) {
            quoteBreakdown += "\nAdditional Components:\n";
            quoteData.intruderComponents.forEach(component => {
                if (component.quantity > 0) {
                    const componentTotal = component.unitPrice * component.quantity;
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

function processQuoteData() {
    let filteredQuoteData = {};

    if (quoteData.selectedCategory === "CCTV System") {
        filteredQuoteData = {
            selectedCategory: quoteData.selectedCategory,
            selectedPackage: quoteData.selectedPackage,
            numberOfCameras: quoteData.numberOfCameras,
            includeMonitor: quoteData.includeMonitor,
            includeAppView: quoteData.includeAppView,
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
            alarmMonitoring: quoteData.alarmMonitoring,
            appAccessWithAlarm: quoteData.appAccessWithAlarm,
            intruderComponents: quoteData.intruderComponents,
            numberOfAccessDoors: quoteData.numberOfAccessDoors,
            howManyAreGlazedDoors: quoteData.howManyAreGlazedDoors,
            sensorColour: quoteData.sensorColour,
            existingAlarm: quoteData.existingAlarm,
            mayBeACostSaving: quoteData.mayBeACostSaving,
            atticSpaceAvailable: quoteData.atticSpaceAvailable,
            levelOfCrime: quoteData.levelOfCrime,
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

    console.log("Final Quote Data:", filteredQuoteData);
    console.log("Quote Breakdown:\n", priceCalculation.breakdown);

    // Here you can add further processing like:
    // - Send to database
}