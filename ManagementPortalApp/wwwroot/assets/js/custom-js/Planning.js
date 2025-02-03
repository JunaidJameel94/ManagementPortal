$(document).ready(function () {
    GetPlanningCategory();
    GetPlanning();
    setInterval(GetPlanningNotification, 30000);
    $('#btn_saveplanning').on('click', function () {
        SavePlanning();
    });

    $('#btn_searchplanning').on('click', function () {
        GetPlanningBySearch();
    });

    $('#download-csv').click(function (e) {
        e.preventDefault();
        downloadCSV();
    });

    $('#AddPlanningbtn').click(function () {
        
        $('#AddPlanning').modal('show');
        $('body').removeClass();

    });
});

var notifiedPlanningIds = []; // Store IDs of notified planning entries

function GetPlanning() {
    var UserID = $('#UserID').val();  // Correct selector to get UserID
    UTILITY.CheckSession((data_) => {
        if (data_) {
            const url = GetGlobalURL('Base', 'GetPlanning?UserID=' + UserID);

            new APICALL(url, 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    if (result.data && result.data.length > 0) {
                        $('#planningContainer').empty(); // Clear existing content

                        $.each(result.data, function (i, planningData) {
                            // Check if this planning has already been notified
                            if (!notifiedPlanningIds.includes(planningData.planning_id)) {
                                var planningHTML = `
                                    <div class="col-12 mb-3 planning-item" data-id="${planningData.planning_id}">
                                        <div class="card shadow-sm border-0">
                                            <div class="card-body">
                                                <h5 class="card-title">${planningData.title}</h5>
                                                <p class="card-text">${planningData.p_description}</p>
                                                <small class="text-muted">${new Date(planningData.created_date).toLocaleDateString()}</small>
                                                <span class="badge badge-primary">${planningData.CategoryName}</span>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                $('#planningContainer').append(planningHTML);
                            }

                            // Create the complete date-time string
                            var datePart = planningData.planning_date.split('T')[0];
                            var timePart = planningData.PlanningTime;
                            var completeDateTimeString = datePart + "T" + timePart;

                            // Check if the notification should be shown
                            var planningDateTime = new Date(completeDateTimeString);
                            var now = new Date();

                            // If the current time is after the planning time, show a notification
                            if (planningDateTime <= now && !notifiedPlanningIds.includes(planningData.planning_id)) {
                                showNotification(planningData.title, `You have a meeting titled: "${planningData.title}" scheduled for now.`);
                                notifiedPlanningIds.push(planningData.planning_id);

                                // Remove the planning item from the UI once notified
                                $(`.planning-item[data-id='${planningData.planning_id}']`).remove();
                            }
                        });
                    } else {
                        $('#planningContainer').html('<p class="text-center">No planning data available.</p>');
                    }
                }
            });
        }
    });
}

function GetPlanningNotification() {
    const url = GetGlobalURL('Base', 'GetPlanningNotification');

    new APICALL(url, 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data && result.data.length > 0) {
                $.each(result.data, function (i, notificationData) {
                    // Only show the notification if it hasn't been notified yet
                    if (!notifiedPlanningIds.includes(notificationData.planning_id)) {
                        showNotification(notificationData.title, `You have a meeting titled: "${notificationData.title}" scheduled for now.`);

                        // Mark this planning as notified
                        notifiedPlanningIds.push(notificationData.planning_id);

                        // Remove the planning item from the UI once notified
                        $(`.planning-item[data-id='${notificationData.planning_id}']`).remove();
                    }
                });
            }
        }

    });
}

function showNotification(title, message) {
    if (!("Notification" in window)) {
        console.error("This browser does not support desktop notifications.");
        return;
    }

    // Check for notification permission
    if (Notification.permission === "granted") {
        createNotification(title, message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
                createNotification(title, message);
            }
        });
    }
}

function createNotification(title, message) {
    const notification = new Notification(title, {
        body: message,
    });

    notification.onclick = function () {
        window.focus();
        this.close();
    };

    setTimeout(() => {
        notification.close();
    }, 60000);
}

function GetPlanningCategory() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetPlanningCategory'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    if (result.data != null) {
                        $('#p_categoryid').html('<option value="">Select Category</option>');
                        $.each(result.data, function (i, option) {
                            $('#p_categoryid').append(
                                '<option value="' + option.p_cat_id + '">' + option.CategoryName + '</option>'
                            );
                        });
                    }
                }
               
            });
        }
    });
}

function SavePlanning() {

    var planningTitle = $("#title").val();
    var PlanningDescription = $('#p_description').val();
    var PlanningCategoryid = $('#p_categoryid').val();
    var PlanningDate = $('#planning_date').val();
    var PlanningCountry = $('#country').val();
    var CreatedBy = $('#UserID').val();
    var planningTime = $('#PlanningTime').val();
    var UserID = $('#UserID').val();


    var Model = JSON.stringify({
        title: planningTitle,
        p_description: PlanningDescription,
        p_categoryid: PlanningCategoryid,
        planning_date: PlanningDate,
        country: PlanningCountry,
        createdby: CreatedBy,
        UserID: UserID,
        PlanningTime: planningTime
    });

    Swal.fire({
        title: 'Do you want to save?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('CitiesDiv');
            new APICALL(GetGlobalURL('Base', 'SavePlanning'), 'POST', Model, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Planning Saved Successfully!',
                        footer: ''
                    });
                    Cleartext();
                    GetPlanning();
                }
               
            });
        }
    });
}

function Cleartext() {
    $("#title").val('');
    $('#p_description').val('');
    $('#planning_date').val('');
    $('#country').val('');
}

function GetPlanningBySearch() {
    var searchingPlanning = $('#search_planning').val(); // Get the search keyword from input

    // Make an API call to fetch planning data based on the search keyword
    new APICALL(GetGlobalURL('Base', `GetPlanningBySearch?Search_Keyword=${encodeURIComponent(searchingPlanning)}`), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            var planningContainer = $('#planningContainer'); // Select the container where planning cards will be appended

            // Clear previous content
            planningContainer.empty();

            if (result.data != null && result.data.length > 0) {
                // Iterate through each planning object in the result and append HTML content
                $.each(result.data, function (i, planningData) {
                    var planningHTML = `
                                <div class="col-12 mb-3">
                                    <div class="card">
                                        <div class="card-body p-1">
                                            <div class="row">
                                                <div class="col-md-10 col-12">
                                                    <div class="news-subtile">
                                                        <h6>Category : ${planningData.CategoryName}</h6>
                                                        <hr>
                                                    </div>
                                                    <div class="news-maintile">
                                                        <h5>${planningData.title}</h5>
                                                    </div>
                                                    <div class="news-discrbion">
                                                        <p class="mb-0">${planningData.p_description}</p>
                                                    </div>
                                                    <hr>
                                                    <div class="newsdate">
                                                        <label><strong>${new Date(planningData.created_date).toLocaleDateString()}</strong></label>
                                                    </div>
                                                </div>
                                               
                                                <div class="col-md-2 col-12 my-auto">
                                                    <div class="countrytitles my-auto">
                                                        <label><strong>${planningData.country}</strong></label><br>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                    $('#planningContainer').append(planningHTML);
                });
            } else {
                // Handle case where no data is returned
                planningContainer.append('<p>No results found.</p>');
            }
        } else {
            // Handle error case
            console.error('Error fetching data:', error);
            // Optionally, show an error message to the user
            $('#planningContainer').empty().append('<p>Error fetching data. Please try again later.</p>');
        }
    });
}

function decodeHTMLEntities(text) {
    const element = document.createElement('textarea');
    element.innerHTML = text;
    return element.value;
}

function escapeCSVValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    // Convert value to string
    value = value.toString();
    // Escape double quotes by doubling them
    value = value.replace(/"/g, '""');
    // Wrap the value in double quotes if it contains commas, double quotes, or newlines
    if (value.indexOf(',') > -1 || value.indexOf('"') > -1 || value.indexOf('\n') > -1) {
        value = `"${value}"`;
    }
    return value;
}

function generateCSVData(data) {
    // Extracting headers
    const headers = ['planning_id', 'title', 'p_description', 'created_date', 'country', 'p_categoryid', 'createdby', 'planning_date'];
    // Joining headers with comma
    let csvContent = headers.map(escapeCSVValue).join(',') + '\n';

    // Iterating through data and adding rows to CSV content
    data.forEach(row => {
        const rowContent = headers.map(header => escapeCSVValue(row[header])).join(',');
        csvContent += rowContent + '\n';
    });

    return csvContent;
}

function downloadCSV() {
    // Make API call to fetch data
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetPlanning'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    if (result.data != null && result.data.length > 0) {
                        // Generate CSV content
                        const csvContent = generateCSVData(result.data);

                        // Create a Blob object
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

                        // Check for IE (Internet Explorer) to handle Blob
                        if (navigator.msSaveBlob) {
                            navigator.msSaveBlob(blob, 'planning_data.csv');
                        } else {
                            // Create a temporary anchor element and initiate download
                            const link = document.createElement("a");
                            const url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", "planning_data.csv");
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    } else {
                        // Handle case where no data is returned
                        Swal.fire({
                            icon: 'info',
                            title: 'No Data',
                            text: 'No planning data available to export.',
                            footer: ''
                        });
                    }
                }
               
            });
        }
    });
}

