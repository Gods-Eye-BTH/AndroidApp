"use strict";

(function () {
    //IGNORE: CORDOVA SPECIFIC INIT FOR STATUS BAR
    document.addEventListener("deviceready", () => {
        if (cordova.platformId == 'android') {
            StatusBar.backgroundColorByHexString("#57606f");
        }
    }, false);



    //NOTE: This is the config variable, all default values are stored here
    // this should remain static
    const config = {
        apiBaseURL: 'https://cluster.dystopi.nu/api/',
        streams: [
            {
                id: 0,
                name: "Camera 1: Charlie Chaplin",
                url: 'https://cluster.dystopi.nu/stream/eye.flv'
            },
            {
                id: 1,
                name: "Camera 2: True Survivor Music Video",
                url: 'https://cluster.dystopi.nu/stream/truesurvivor.flv'
            }
        ]
    }

    // This is the root DOM Element - everything should be within this.
    let appElement = document.getElementById("app");
    // AppState tells the app what states are set.
    // state: What view should be displayed to the user
    // SelectedSteam: The selected option in the selected option box
    // selectedStreamUrl: url to stream that the user has selected.
    // selectedRobot: id of the robot the user has selected.
    let appState = {
        state: "home",
        selectedStream: 0,
        selectedStreamUrl: config.streams[0].url,
        showRobotID: 0,
    };

    // General function to create an element
    const createElement = (type, idAttribute = "", classAttribute = "") => {
        let newElement = document.createElement(type);

        if (idAttribute != "") {
            newElement.id = idAttribute;
        }
        if (classAttribute != "") {
            newElement.className = classAttribute;
        }
        return newElement;
    }

    // General function to append an element to the root DOM element (appElement)
    // elementToAppend is the element you wish to push
    // AppendTo is target element, if none is specified it uses the root element
    const appendElementToApp = (elementToAppend, appendTo = appElement) => {
        appendTo.appendChild(elementToAppend);
    }

    // General function that changes the state of the app,
    // usually it means a new view is displayed.
    const updateState = (newState) => {
        appState.state = newState;
        //redraw the view
        display();
    }

    // Function to change the active status on the navbar.
    // Simply send in the navbarobject
    const changeNavbarActive = (newActive) => {
        navbarHome.classList.remove("active");
        navbarStream.classList.remove("active");
        navbarRobots.classList.remove("active");
        navbarBarriers.classList.remove("active");

        newActive.classList.add("active");
    }

    /*
    * --------------------------------------------------------------------------
    * PRE BUILT PARTS OF THE APP
    * header, navbar, footers and such
    * --------------------------------------------------------------------------
    */

    // Navbar html structure
    let navbarElement = createElement("div", "navbar", "nav-wrap");

    // Navbar buttons
    let navbarHome = createElement("a", "home", "link");
    let navbarStream = createElement("a", "stream", "link");
    let navbarRobots = createElement("a", "robots", "link");
    let navbarBarriers = createElement("a", "barriers", "link");

    navbarHome.innerHTML = "<i class='material-icons'>home</i><span>Home</span>";
    navbarStream.innerHTML = "<i class='material-icons'>live_tv</i><span>Stream</span>";
    navbarRobots.innerHTML = "<i class='material-icons'>memory</i><span>Robots</span>";
    navbarBarriers.innerHTML = "<i class='material-icons'>widgets</i><span>Barriers</span>";

    // Add listeners to navbar, this is used to see when user clicks on a button
    navbarHome.addEventListener('click', () => { updateState("home"); });
    navbarStream.addEventListener('click', () => { updateState("stream"); });
    navbarRobots.addEventListener('click', () => { updateState("robots"); });
    navbarBarriers.addEventListener('click', () => { updateState("barriers"); });

    // Add navbar buttons to the actual navbar
    appendElementToApp(navbarHome, navbarElement);
    appendElementToApp(navbarStream, navbarElement);
    appendElementToApp(navbarRobots, navbarElement);
    appendElementToApp(navbarBarriers, navbarElement);

    /*
    * --------------------------------------------------------------------------
    * APP VIEWS
    * This section contains a switch case for the different views/states
    * the app has.
    * --------------------------------------------------------------------------
    */
    const display = () => {
        // Clear the view
        appElement.innerHTML = "";

        // Switch case for what to draw
        switch (appState.state) {
            /*
            * ------------------------------------------------------------------
            * HOME VIEW
            * ------------------------------------------------------------------
            */
            case "home":
                //Set navbar state to Home then draw it
                changeNavbarActive(navbarHome);
                appendElementToApp(navbarElement);

                //Header for H9ome view
                let homeHeader = createElement("div", "", "homeHeader");
                let homeImage = createElement("img", "", "homeBanner");
                let homeText = createElement("p", "", "homeText");


                homeImage.setAttribute("src", "img/banner.png");
                homeText.innerText =
`Welcome to God's Eye, a system for monitoring autonomous robots and obstacles they may face. This app can give you an overview of the scene with help of a live stream from the overhead camera, robot overview, and obstacle positions.

Click an item in the navbar to get started.
`;

                appendElementToApp(homeImage, homeHeader);
                appendElementToApp(homeHeader);
                appendElementToApp(homeText);
                break;
            /*
            * ------------------------------------------------------------------
            * STREAM VIEW
            * ------------------------------------------------------------------
            */
            case "stream":
                //change navbar active state and add the navbar
                changeNavbarActive(navbarStream);
                appendElementToApp(navbarElement);

                let streamElement = createElement("video", "videoElement");
                let dataWrap = createElement("div", "dataBoxWrap", "boxContainer");
                let dataDropdown = createElement("div", "dropdownContainer", "dropdownContainer");
                let dataBoxes = createElement("div", "dataBoxes", "boxWrap");
                let dataBoxRobots = createElement("div", "robotsBox", "databox");
                let dataBoxBarriers = createElement("div", "barriersBox", "databox");

                //Add properties to the stream element
                streamElement.setAttribute("muted", "");
                streamElement.setAttribute("autoplay", "");
                streamElement.setAttribute("poster", "img/loadingStream.png");

                //Fetch amount of robots
                fetch(config.apiBaseURL + "robots")
                .then(function (response) {
                    return response.json();
                }).then(function(data) {
                    dataBoxRobots.innerHTML = "<h2>" + data.length +
                    "</h2><span>Robots</span>";
                    //Add click event to robots box
                    dataBoxRobots.addEventListener("click", () => {
                        updateState("robots");
                    });
                    //Add the box to the wrapper
                    appendElementToApp(dataBoxRobots, dataBoxes);
                }).catch((error) => {
                    // Data could not be fetched, print error message instead
                    let errorMsg = createElement("div", "error", "error");

                    errorMsg.innerText = "Failed to fetch robots from " + config.apiBaseURL;
                    appendElementToApp(errorMsg);
                });



                //Fetch amount of barriers
                fetch(config.apiBaseURL + "barriers")
                .then(function (response) {
                    return response.json();
                }).then(function(data) {
                    dataBoxBarriers.innerHTML = "<h2>" + data.length +
                    "</h2><span>Barriers</span>";
                    //Add click event to barriers box
                    dataBoxBarriers.addEventListener("click", () => {
                        updateState("barriers");
                    });
                    //Add the box to the wrapper
                    appendElementToApp(dataBoxBarriers, dataBoxes);
                }).catch((error) => {
                    // Data could not be fetched, print error message instead
                    let errorMsg = createElement("div", "error", "error");

                    errorMsg.innerText = "Failed to fetch robots from " + config.apiBaseURL;
                    appendElementToApp(errorMsg);
                });

                //Select a camera feed
                let selectMenu = createElement("select");

                //Add Camera feed options
                config.streams.forEach((stream) => {
                    let feedOption = createElement("option");
                    if (appState.selectedStream == stream.id) {
                        feedOption.setAttribute("selected", "selected");
                    }
                    feedOption.innerText = stream.name;
                    feedOption.value = stream.id;
                    //When the user clicks on the option we
                    //re-render the view with updated stream url
                    feedOption.addEventListener("click", () => {
                        appState.selectedStream = stream.id;
                        appState.selectedStreamUrl = stream.url;
                        updateState("stream");
                    });
                    appendElementToApp(feedOption, selectMenu);
                });

                //add trigger for changing stream on a phone
                selectMenu.addEventListener("change", (e) => {
                    console.log(selectMenu.value);
                    selectMenu.options[selectMenu.value].click();
                });

                appendElementToApp(selectMenu, dataDropdown);

                // Add video stream
                appendElementToApp(streamElement);
                //Add items to the data wrap
                appendElementToApp(dataDropdown, dataWrap);
                appendElementToApp(dataBoxes, dataWrap);
                //Append data wrap to the app root element
                appendElementToApp(dataWrap);

                //video player logic
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById('videoElement');
                    var flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        url: appState.selectedStreamUrl
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    // If there is any issue we'll tell the user
                    flvPlayer.on(flvjs.Events.ERROR, () => {
                        streamElement.setAttribute("poster", "img/streamError.png");
                    });
                    flvPlayer.load();
                    flvPlayer.play();
                } else {
                    alert("Error loading video stream player");
                }

                break;
            /*
            * ------------------------------------------------------------------
            * ROBOTS VIEW
            * ------------------------------------------------------------------
            */
            case "robots":
                changeNavbarActive(navbarRobots);
                appendElementToApp(navbarElement);

                //Header for Robots
                let robotsHeader = createElement("div", "", "viewHeader");
                let robotsOneHeader = createElement("h1", "", "robotsOneHeader");

                robotsOneHeader.innerText = "Robots";
                appendElementToApp(robotsOneHeader, robotsHeader);
                appendElementToApp(robotsHeader);

                //Create the list that will contain the robots
                let robotsList = createElement("div", "robotsList", "robotsList");

                //Fetch robots and append them to the list
                fetch(config.apiBaseURL + "robots")
                .then(function (response) {
                    return response.json();
                }).then(function(data) {
                    //loop the list of robots add add click event and html elements
                    data.forEach((aRobot) => {
                        let tmpElement = createElement("div", aRobot.name, "robot");

                        tmpElement.innerHTML = "<h2>" + aRobot.name + "</h2>";
                        tmpElement.innerHTML += "<i class='material-icons'>chevron_right</i>";
                        tmpElement.addEventListener("click", () => {
                            appState.showRobotID = aRobot.id;
                            updateState("robot");
                        })
                        appendElementToApp(tmpElement, robotsList);
                    });
                }).catch((error) => {
                    let errorMsg = createElement("div", "error", "error");

                    errorMsg.innerText = "Failed to fetch robots from " + config.apiBaseURL;
                    appendElementToApp(errorMsg);
                });

                //append list to the app
                appendElementToApp(robotsList);

                break;
            /*
            * ------------------------------------------------------------------
            * ROBOT VIEW
            * ------------------------------------------------------------------
            */
            case "robot":
                changeNavbarActive(navbarRobots);
                appendElementToApp(navbarElement);

                //Create a header for this view
                let robotHeaderElement = createElement("div", "", "robotHeader");
                let headerBackButton = createElement("div", "", "robotBackButton");
                let headerPadding = createElement("div", "", "headerPadding");

                //Back button to go back to robots view
                headerBackButton.innerHTML = "<i class='material-icons'>chevron_left</i>";
                headerBackButton.addEventListener("click", () => {
                    updateState("robots");
                });
                appendElementToApp(headerBackButton, robotHeaderElement);
                //Fetch robot data for robot appState.showRobotID
                fetch(config.apiBaseURL + "/robot/" + appState.showRobotID)
                .then(function (response) {
                    return response.json();
                }).then(function(data) {
                    let robotName = createElement("h1", "", "robotName");
                    robotName.innerText = data.name;

                    //Parse and print data for the robot
                    let robotInformation = createElement("div", "", "robotInformation");
                    robotInformation.innerHTML = "<pre>" +
                    "ID: " + data.id + "<br>" +
                    "name: " + data.name + "<br>" +
                    "x: " + data.coords[0] + "<br>" +
                    "y: " + data.coords[1] + "<br>" +
                    "length: " + data.size[0] + "<br>" +
                    "width: " + data.size[1] + "</pre>";

                    appendElementToApp(robotName, robotHeaderElement);
                    appendElementToApp(robotHeaderElement);
                    appendElementToApp(robotInformation);
                });
                break;
            /*
            * ------------------------------------------------------------------
            * BARRIERS VIEW
            * ------------------------------------------------------------------
            */
            case "barriers":
                changeNavbarActive(navbarBarriers);
                appendElementToApp(navbarElement);

                //Header for Barriers
                let barriersHeader = createElement("div", "", "viewHeader");
                let barriersOneHeader = createElement("h1", "", "SizeOneHeader");

                barriersOneHeader.innerText = "Barriers";
                appendElementToApp(barriersOneHeader, barriersHeader);
                appendElementToApp(barriersHeader);

                //Fetch Barrier data and add them as elements
                fetch(config.apiBaseURL + "barriers")
                .then(function (response) {
                    return response.json();
                }).then(function(data) {
                    //Itterate barriers and add them to the view
                    data.forEach((barrier) => {
                        let barrierElement = createElement("div", "barrier", "barrier");

                        barrierElement.innerHTML =
                            "<h3>ID: " + barrier.id + "</h3>" +
                            "x: " + barrier.coords[0] + "<br>" +
                            " y: " + barrier.coords[1] + "<br>" +
                            "size: " + barrier.size[0] + "x" + barrier.size[1];

                        appendElementToApp(barrierElement);
                    });
                }).catch((error) => {
                    let errorMsg = createElement("div", "error", "error");

                    errorMsg.innerText = "Failed to fetch barriers from " + config.apiBaseURL;
                    appendElementToApp(errorMsg);
                });
                break;
            default:
                updateState("home");
                break;
        }
    }

    // Start with showing the first view. This will be the view set in
    // the appState.state variable
    display();


})();
