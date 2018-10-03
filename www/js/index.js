"use strict";

(function () {
    //NOTE: This is the config variable, all default values are stored here
    // this should remain static
    const config = {
        defaultStream: 'http://localhost:8000/live/eye.flv'
    }
    // This is the root DOM Element - everything should be within this.
    let appElement = document.getElementById("app");
    // AppState tells the app what states are set.
    // state: What view should be displayed to the user
    // selectedStream: url to stream that the user has selected.
    // selectedRobot: id of the robot the user has selected.
    let appState = {
        state: "home",
        selectedStream: config.defaultStream,
        selectedRobot: "",
    };

    // General function to create an element
    const createElement = (type, idAttribute, classAttribute = "") => {
        let newElement = document.createElement(type);

        newElement.id = idAttribute;
        newElement.className = classAttribute;
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
        console.log("want: ", newState);
        appState.state = newState;
        console.log(appState);
        //redraw the view
        display();
    }

    // Function to change the active status on the navbar.
    // Simply send in the navbarobject
    const changeNavbarActive = (newActive) => {
        navbarHome.classList.remove("active");
        navbarStream.classList.remove("active");
        navbarRobots.classList.remove("active");
        navbarControl.classList.remove("active");

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
    let navbarControl = createElement("a", "control", "link");

    navbarHome.innerHTML = "<i class='material-icons'>home</i><span>Home</span>";
    navbarStream.innerHTML = "<i class='material-icons'>live_tv</i><span>Stream</span>";
    navbarRobots.innerHTML = "<i class='material-icons'>memory</i><span>Robots</span>";
    navbarControl.innerHTML = "<i class='material-icons'>gamepad</i><span>Control</span>";

    // Add listeners to navbar, this is used to see when user clicks on a button
    navbarHome.addEventListener('click', () => { updateState("home"); });
    navbarStream.addEventListener('click', () => { updateState("stream"); });
    navbarRobots.addEventListener('click', () => { updateState("robots"); });
    navbarControl.addEventListener('click', () => { updateState("control"); });

    // Add navbar buttons to the actual navbar
    appendElementToApp(navbarHome, navbarElement);
    appendElementToApp(navbarStream, navbarElement);
    appendElementToApp(navbarRobots, navbarElement);
    appendElementToApp(navbarControl, navbarElement);

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
            // HOME VIEW
            case "home":
                let homeHeader = createElement("h1", "testheader");

                changeNavbarActive(navbarHome);
                homeHeader.innerHTML = "Home view";
                appendElementToApp(homeHeader);
                appendElementToApp(navbarElement);
                break;
            // STREAM VIEW
            case "stream":
                let streamHeader = createElement("h1", "testheader");
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

                //add data to databoxes
                dataBoxRobots.innerHTML = "<h2>3</h2><span>Robots</span>";
                dataBoxBarriers.innerHTML = "<h2>4</h2><span>Barriers</span>";
                dataDropdown.innerHTML = "<select><option>Camera 1</option></select>";

                //change navbar active state and add the navbar
                changeNavbarActive(navbarStream);
                appendElementToApp(navbarElement);
                // Add video stream
                appendElementToApp(streamElement);
                //Add items to the data wrap
                appendElementToApp(dataDropdown, dataWrap);
                appendElementToApp(dataBoxes, dataWrap);
                //add two boxes to dataBoxes
                appendElementToApp(dataBoxRobots, dataBoxes);
                appendElementToApp(dataBoxBarriers, dataBoxes);
                //Append data wrap to the app root element
                appendElementToApp(dataWrap);

                //video player logic
                if (flvjs.isSupported()) {
                    var videoElement = document.getElementById('videoElement');
                    var flvPlayer = flvjs.createPlayer({
                        type: 'flv',
                        url: appState.selectedStream
                    });
                    flvPlayer.attachMediaElement(videoElement);
                    flvPlayer.load();
                    flvPlayer.play();
                } else {
                    alert("Error loading video stream player");
                }

                break;
            // ROBOTS VIEW
            case "robots":
                let robotsHeader = createElement("h1", "testheader");

                changeNavbarActive(navbarRobots);
                robotsHeader.innerHTML = "Robots view";
                appendElementToApp(robotsHeader);
                appendElementToApp(navbarElement);
                break;
            // ABOUT VIEW
            case "control":
                let aboutHeader = createElement("h1", "testheader");

                changeNavbarActive(navbarControl);
                aboutHeader.innerHTML = "Control view";
                appendElementToApp(aboutHeader);
                appendElementToApp(navbarElement);
                break;
            default:
                break;
        }
    }

    // Start with showing the first view. This will be the view set in
    // the appState.state variable
    display();


})();
