var globalcollectionID;
var news_ids;
var thumbnailimagenewspath;
$(document).ready(function () {
    $('#summernote').summernote({
        height: 300, // Fixed height of 300px
        maxHeight: 300, // Ensures that the height doesn't exceed 300px
        minHeight: 300, // Ensures that the height is never less than 300px
    });
    feather.replace();
    $('.js-select2').select2({
        placeholder: 'Select an option',
        allowClear: true
    });
    $('.js-select2').on('select2:open', function () {
        const icon = $(this).siblings('.dropdown-icon');
        icon.attr('data-feather', 'chevron-up'); // Change to chevron-up
        feather.replace(); // Refresh Feather Icons
    });
    $('.js-select2').on('select2:close', function () {
        const icon = $(this).siblings('.dropdown-icon');
        icon.attr('data-feather', 'chevron-down'); // Change to chevron-down
        feather.replace(); // Refresh Feather Icons
    });
    GetCollectionName();
    SelectNewsslugsDropdown();
    SelectNewsTagDropdown();
    GetGraphType();
    MakeGraph();
    MakeTable();
    readAndDisplayCSVFile();
    readAndDisplayCSVFileForGraph();
    $('#generate-news-ai').on('click', function () {
        AI_NewsGenerated();
    });

    $('#clearhtmltablefile').on('click', function () {
        $('.add-box-table').removeClass('d-none');
        $('.add-box-form').addClass('d-none');
        document.getElementById('addtablefile').value = '';
    });



    $('#btnSaveNews').click(function () {
        SaveNews();
    });

    $('#btngeneratetexttoimage').click(function () {
        TextToImageGenerate();
    });



    $('.drop-zone__input').change(function () {
        SaveNewsImage();
        $('#newscheckratio').removeClass('d-none');
    });

    $('#clearhtmltablefile').hide();
    $('#makeGraph').hide();

});
document.querySelectorAll(".drop-zone__input").forEach((inputElement) => {
    const dropZoneElement = inputElement.closest(".drop-zone");
    dropZoneElement.addEventListener("click", (e) => {
        inputElement.click();
    });
    inputElement.addEventListener("change", (e) => {
        if (inputElement.files.length) {
            updateThumbnailFromPath(dropZoneElement, inputElement.files[0]);
        }
    });
    dropZoneElement.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone--over");
    });
    ["dragleave", "dragend"].forEach((type) => {
        dropZoneElement.addEventListener(type, (e) => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });
    dropZoneElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnailFromPath(dropZoneElement, e.dataTransfer.files[0]);
        }
        dropZoneElement.classList.remove("drop-zone--over");
    });
}); 
  /**
   * Updates the thumbnail on a drop zone element.
   *
   * @param {HTMLElement} dropZoneElement
   * @param {File} file
   */
function updateThumbnailFromPath(dropZoneElement, imagePath) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time - there is no thumbnail element, so let's create it
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");

        // Apply styles to center content and ensure proper layout
        thumbnailElement.style.display = "flex";
        thumbnailElement.style.alignItems = "center";
        thumbnailElement.style.justifyContent = "center";
        thumbnailElement.style.height = "100%"; // Ensure it takes the full height of the container
        thumbnailElement.style.overflow = "hidden"; // Prevent overflowing content
        dropZoneElement.appendChild(thumbnailElement);
    }

    // Create an img element to display the uploaded image
    const imgElement = document.createElement("img");
    imgElement.alt = "Uploaded Image"; // Set alt text
    imgElement.src = imagePath; // Use the image path from the server

    // Style the img element to fit properly
    imgElement.style.width = "489px";
    imgElement.style.maxHeight = "100%";
    imgElement.style.objectFit = "fill"; // Ensures the image fits without distortion

    // Set the formid attribute to 5
    imgElement.setAttribute("formid", "4");

    // Add the 'data' class to the img element
    imgElement.classList.add("data");

    // Remove any existing thumbnail content
    thumbnailElement.innerHTML = '';
    thumbnailElement.appendChild(imgElement);
}

document.addEventListener('DOMContentLoaded', function () {
    const addBox = document.querySelector('.add-box');
    const graphForm = document.getElementById('graphForm');
    const chartOne = document.querySelector('.chartone');
    function resetAddGraphTab() {
        addBox.classList.remove('d-none');
        graphForm.classList.add('d-none');
        chartOne.classList.add('d-none');
    }
    document.getElementById('AddGraph').addEventListener('click', function (event) {
        const target = event.target;
        if (target.id === 'GraphId') {
            addBox.classList.add('d-none');
            graphForm.classList.remove('d-none');
            chartOne.classList.add('d-none');
        } else if (target.id === 'GenerateChart') {
            graphForm.classList.add('d-none');
            chartOne.classList.remove('d-none');
        }
    });
    const addNewGraphTabButton = document.getElementById('addNew-Graph');
    addNewGraphTabButton.addEventListener('click', function () {
        resetAddGraphTab();
    });
    resetAddGraphTab();
});  

document.addEventListener('DOMContentLoaded', function () {
    const addBoxTable = document.querySelector('.add-box-table');
    const tableForm = document.getElementById('tableForm');
    const singleTable = document.querySelector('#single-tbl');
    function resetAddTableTab() {
        addBoxTable.classList.remove('d-none');
        $('#tableForm').removeClass('d-none');
        $('.add-box-form').addClass('d-none');
        $('#clearhtmltablefile').hide();
        $('#makeGraph').hide();


        $('#TableName').val('');
        $('#TableRows').val('');
        $('#TableColumns').val('');
        
    }
    document.getElementById('CreateNewtable').addEventListener('click', function () {
        // Show Table Form
        $('#editable-table').hide();
        $('#customizetable').show();
        addBoxTable.classList.add('d-none');
        tableForm.classList.remove('d-none');
    });
    document.getElementById('AddNewtable').addEventListener('click', function () {
        resetAddTableTab();

    });
    resetAddTableTab();
});  
function SaveNewsImage() {
    var formData = new FormData();
    var files = $('.drop-zone__input')[0].files; // Getting the selected files
    if (files.length > 0) {
        formData.append('file', files[0]); // Appending the first file
        new APICALL(GetGlobalURL('FileUpload', 'UploadNewsimageThumnailimageAspect'), 'POST', formData, true, true).FETCH((result, error) => {
            if (result) {
                // You can use result.data for the paths of all images
                let { defaultImagePath, mobileImagePath, desktopImagePath, socialMediaImagePath } = result.data;

                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'Image uploaded successfully!',
                    footer: ''
                });

                // Update the thumbnail with the saved image path (you can use the default image here)
                const dropZoneElement = document.querySelector(".drop-zone");
                updateThumbnailFromPath(dropZoneElement, defaultImagePath); // Use default image for the thumbnail
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'Failed to upload the image!',
                    footer: ''
                });
            }
        });
    }
}
function GetCollectionName() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            var userID = $('#UserID').val();
            new APICALL(GetGlobalURL('Base', 'GetCollectionNameforSingleNews'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data) {
                    var accordionContainer = $('#NewsCollectionData');
                    accordionContainer.empty();
                    $.each(result.data, function (index, collection) {
                        var collectionId = `collapse${collection.Collection_id}`;
                        const isExpanded = index === 0 ? 'show' : '';
                        const isCollapsed = index === 0 ? '' : 'collapsed';
                        const accordionItem = `
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="heading${collection.Collection_id}">
                                    <button class="accordion-button ${isCollapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#${collectionId}" aria-expanded="${isExpanded ? 'true' : 'false'}" aria-controls="${collectionId}">
                                        ${collection.Collection_name}
                                    </button>
                                </h2>
                                <div id="${collectionId}" class="accordion-collapse collapse ${isExpanded}" aria-labelledby="heading${collection.Collection_id}" data-bs-parent="#NewsCollectionData">
                                    <div class="accordion-body" id="collection-body-${collection.Collection_id}">
                                        <!-- Dynamic content for this collection will be inserted here -->
                                    </div>
                                </div>
                            </div>
                        `;
                        accordionContainer.append(accordionItem);
                        if (isExpanded) {
                            fetchCollectionData(collection.Collection_id, `#collection-body-${collection.Collection_id}`);
                        }
                    });
                    $(document).on('shown.bs.collapse', '.accordion-collapse', function () {
                        var collectionId = $(this).attr('id').replace('collapse', '');
                        fetchCollectionData(collectionId, `#collection-body-${collectionId}`);
                    });
                } else if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data?.responseText || 'Unable to fetch collections.',
                        footer: ''
                    });
                }
            });
        }
    });
}
function fetchCollectionData(collectionId, containerId) {
    new APICALL(GetGlobalURL('Base', `Get_Feed_By_CollectionForSingleNews?CollectionID=${collectionId}`), 'GET', '', true).FETCH((result, error) => {
        if (result && result.data) {
            $(containerId).empty();
            let htmlContent = '';
            $.each(result.data, function (i, news) {
                var imageHTML = news.LocalImagePath ? `<img src="../images/${news.LocalImagePath}" class="card-img-top img-fluid" alt="${news.Title}">` : '<p>No image available</p>';
                htmlContent += `
                    <div class="collectionlists" data-collection-id="${news.CollectionFeedID}">
                        <div class="row my-auto">
                            <div class="col-md-3 col-12 news-img">
                                ${imageHTML}
                            </div>
                            <div class="col-md-9 col-12">
                                <h6>${news.Title}</h6>
                                <p>${news.Description}</p>
                                <div class="row">
                                    <div class="col-12 text-end">
                                        <div class="d-flex justify-content-end">
                                            <button class="btn btn-main-light">
                                                <i class="feather-eye" data-value="${news.CollectionFeedID}" data-title="${news.Title}" data-description="${news.Description}" data-content="${news.Content}" data-image="images/${news.LocalImagePath}" ></i>
                                            </button> &nbsp;
                                            <button class="btn btn-sm btn-main-light">
                                                <i class="feather-copy" data-value="${news.CollectionFeedID}" data-title="${news.Title}" data-description="${news.Description}" data-content="${news.Content}" data-image="images/${news.LocalImagePath}" ></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                 <hr>`;
            });
            $(containerId).append(htmlContent);
            $(document).off("click", ".feather-copy").on("click", ".feather-copy", function () {
                $('#newscheckratio').removeClass('d-none');
                globalcollectionID = $(this).data("value");
                const title = $(this).data("title");
                const description = $(this).data("description");
                const content = $(this).data("content");
                let image = '../' + $(this).data("image");
                const viewurl = GetViewURL();
                var newimage = viewurl + image;
                // Set values for the form fields
                $("#addtitle").val(title);
                $("#adddescription").val(description);
                // Set the content for Summernote
                $("#summernote").summernote("code", content);
                const dropZoneElement = document.querySelector(".drop-zone");
                updateThumbnailFromPath(dropZoneElement, image);
            });
            $(document).off("click", ".feather-eye").on("click", ".feather-eye", function () {
                globalcollectionID = $(this).data("value");
                const title = $(this).data("title");
                const description = $(this).data("description");
                const content = $(this).data("content");
                let image = '../' + $(this).data("image");

                $('.collectionheading').text(title);
                $('.collectiondescription').text(description);
                $('.collectioncontent p').text(content);
                $('.collectionimage').attr('src', image);
                $('#staticBackdrop').modal('show');
                $('body').removeClass();
            });
        }
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
                footer: ''
            });
        }
    });
}
function convertImageToBase64(imageUrl, callback) {
    var img = new Image();
    img.crossOrigin = 'Anonymous'; // Handle cross-origin images
    img.onload = function () {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        var base64Image = canvas.toDataURL("image/jpeg"); // You can change the format here (e.g., png, jpeg)
        callback(base64Image);
    };
    img.src = imageUrl; 
}
function SelectNewsslugsDropdown() {
    new APICALL(GetGlobalURL('Base', 'Get_AllNews_slugs'), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                $('#SlugName').select2({
                    placeholder: "Select News Slugs",
                    allowClear: true,
                    multiple: true,
                    width: '100%'
                });

                $.each(result.data, function (i, option) {
                    // Check if TagTypeName is not null
                    let displayText = option.TypeName
                        ? `${option.SlugName} (${option.TypeName})`
                        : option.SlugName;

                    var newOption = new Option(displayText, option.SlugID, false, false);
                    $('#SlugName').append(newOption).trigger('change');
                });
            }
        } else {
            console.error("Failed to fetch data from the API:", error);
        }
    });
}
function SelectNewsTagDropdown() {
    new APICALL(GetGlobalURL('Base', 'Get_AllNews_TagsFillDropdown'), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                $('#TagName').select2({
                    placeholder: "Select News Tags",
                    allowClear: true,
                    multiple: true,
                    width: '100%'
                });
                $.each(result.data, function (i, option) {
                    // Concatenate TagName and TagType
                    var tagText = option.TagName;
                    if (option.TypeName) {
                        tagText += ' (' + option.TypeName + ')'; // Add the TagType in parentheses
                    }

                    var newOption = new Option(tagText, option.ID, false, false);
                    $('#TagName').append(newOption).trigger('change');
                });
            }
        } else {
            console.error("Failed to fetch data from the API:", error);
        }
    });
}

function typingAnimation(text, targetElement, speed) {
    let index = 0;
    // Clear the content of the target element
    $(targetElement).html('');

    let interval = setInterval(() => {
        if (index < text.length) {
            // Append characters one by one
            $(targetElement).html((i, old) => old + text.charAt(index));
            index++;
        } else {
            clearInterval(interval); // Stop animation when done
        }
    }, speed);
}
function AI_NewsGenerated() {
    // Get content from the `addAiNews` textarea
    var newsContent = $('#addAiNews').val().trim();
    if (!newsContent) {
        alert("Please add content to generate professional AI-based news.");
        return;
    }

    // Encode the news content for use in the API query
    var encodedNewsContent = encodeURIComponent(newsContent);

    // Make the API call to generate professional AI-based news
    new APICALL(GetGlobalURL('Base', 'GetAIGeneratedMGNews?newsContent=' + encodedNewsContent), 'GET', '', true).FETCH(async (result, error) => {
        if (error) {
            console.error("API Error:", error);
            alert("An error occurred while fetching AI-generated news.");
            return;
        }

        // Validate the API response
        if (result && result.data && result.data.choices && result.data.choices.length > 0) {
            var professionalNews = result.data.choices[0].text.trim();

            // Animate typing in the `#summernote` element
            typingAnimation(professionalNews, '.note-editable[contenteditable="true"]', 10); // Adjust speed as needed
        } else {
            alert("Failed to retrieve professional news from AI.");
        }
    });
}
function GetGraphType() {
    new APICALL(GetGlobalURL('Base', 'GetGraphTypeName'), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                $.each(result.data, function (i, option) {
                    $('#ChartType').append(
                        '<option value="' + option.typeid + '">' + option.typename + '</option>'
                    );
                });
            }
        }
        if (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
                footer: ''
            });
        }
    });
}
function MakeGraph() {
    $('#GenerateChart').on('click', function () {
        $('.editgraph').removeClass('d-none');
        var chartTitle = $('#graphTitle').val();
        var chartSubTitle = $('#graphSubTitle').val();
        var chartType = $('#ChartType option:selected').text();

        var labelOrientation = $('#LabelOrientation').val();
        var xAxisLabels = labelOrientation.split(',');
        console.log("Selected chart type: " + chartType);
        var seriesData = [];
        $('#rowsContainer .row').each(function () {
            var seriesName = $(this).find('.series-name').val();
            var seriesValues = $(this).find('.series-values').val();
            var seriesColor = $(this).find('.series-color').val();
            var seriesDataValues = seriesValues.split(',').map(Number);
            if (seriesName && seriesValues) {
                if (chartType === 'pie') {
                    seriesData.push({
                        name: seriesName,
                        y: seriesDataValues[0],
                        color: seriesColor
                    });
                } else {
                    seriesData.push({
                        name: seriesName,
                        data: seriesDataValues,
                        color: seriesColor
                    });
                }
            }
        });

        // Check if chart type is valid
        if (['line', 'bar', 'column', 'pie', 'scatter'].includes(chartType)) {
            // Generate the chart
            Highcharts.chart('chartContainer', {
                chart: {
                    type: chartType
                },
                title: {
                    text: chartTitle
                },
                subtitle: {
                    text: chartSubTitle
                },
                xAxis: chartType === 'pie' ? undefined : { 
                    categories: xAxisLabels
                },
                series: chartType === 'pie' ? [{ 
                    name: chartTitle,
                    data: seriesData
                }] : seriesData
            });

            $('#chartContainer').removeClass('d-none');
            $('#graphForm').addClass('d-none');
        } else {
            alert('Invalid chart type selected.');
        }
    });
    $('.editgraph').on('click', function () {
        $('.editgraph').addClass('d-none');
        $('#graphForm').removeClass('d-none');
        $('#chartContainer').addClass('d-none');
    });

    $('.deletegraph').on('click', function () {
        $('#chartContainer').addClass('d-none');
        $('#graphForm').removeClass('d-none');

        $('#graphTitle').val('');
        $('#graphSubTitle').val('');
        $('#LabelOrientation').val('');
        $('.series-name').val('');
        $('.series-values').val('');
        $('.series-color').val('');
        $('#rowsContainer').empty();
    });

    $('#addSeries').on('click', function () {
        var newSeriesRow = `
            <div class="row">
                <div class="col-md-4 col-12 form-group">
                    <label for="SeriesName">Series Name</label>
                    <input type="text" class="form-control series-name" placeholder="Series Name">
                </div>
                <div class="col-md-4 col-12 form-group">
                    <label for="ChartValue">Enter Comma Separated Chart Values</label>
                    <input type="text" class="form-control series-values" placeholder="Comma-separated values (e.g., 10,20,30)">
                </div>
                <div class="col-md-3 col-12 form-group">
                    <label for="SeriesColor">Series Color</label>
                    <input type="text" class="form-control series-color" placeholder="Color (e.g., red)">
                </div>
                <div class="col-md-1 col-12 mt-auto text-end">
                    <button class="btn btn-sm remove-button ms-auto" type="button" onclick="removeSeries(this)">
                        <i class="feather-minus-square fs-2"></i>
                    </button>
                </div>
            </div>
        `;
        $('#rowsContainer').append(newSeriesRow);
    });
}
function removeSeries(button) {
    $(button).closest('.row').remove();
}
function MakeTable() {
    $('#CreateNewtable').on('click', function () {
       
        $('#editable-table').hide();  
        $('.add-box-form').removeClass('d-none');
        $('#clearhtmltablefile').hide();  
        $('#makeGraph').hide();  
    });

    $('#GenerateTable').on('click', function () {
        
        var tableName = $('#TableName').val();
        var tableRows = $('#TableRows').val();
        var tableColumns = $('#TableColumns').val();

        if (!tableName || !tableRows || !tableColumns) {
            alert('Please enter all the details!');
            return;
        }
        var tableHTML = '<div class="table-responsive"><table class="table table-bordered table-striped data" formid="5">';
        tableHTML += '<thead><tr>';

        tableHTML += '<th colspan="' + tableColumns + '" contenteditable="true">' + tableName + '</th>';
        tableHTML += '</tr><tr>';

        for (var i = 0; i < tableColumns; i++) {
            tableHTML += '<th contenteditable="true">Header ' + (i + 1) + '</th>';
        }
        tableHTML += '</tr></thead><tbody>';
        for (var i = 0; i < tableRows; i++) {
            tableHTML += '<tr>';
            for (var j = 0; j < tableColumns; j++) {
                tableHTML += '<td contenteditable="true">Row ' + (i + 1) + ', Col ' + (j + 1) + '</td>';
            }
            tableHTML += '</tr>';
        }
        tableHTML += '</tbody>';
        $('#editable-table').html(tableHTML);
        $('#editable-table').show();

    });
}
function readAndDisplayCSVFile() {
    $('#addtablefile').on('change', function (e) {
        $('#clearhtmltablefile').show();
        $('#makeGraph').show();
        $('#editable-table').hide();
        $('.add-box-form').removeClass('d-none');

        var file = e.target.files[0];

        if (!file) {
            alert('Please select a CSV file!');
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            try {
                var csvContent = e.target.result;
                var rows = csvContent.split('\n').map(function (row) {
                    return row.split(',');
                });

                if (rows.length > 0) {
                    populateTable(rows);
                    // Attach event listener to checkbox for dynamic graph generation
                    $('#makeGraph').off('change').on('change', function () {
                        if ($(this).is(':checked')) {
                            populateGraphForm(rows); // Generate graph when checked
                        } else {
                            $('#rowsContainer').empty(); // Clear graph form when unchecked
                        }
                    });

                    // Trigger graph population if checkbox is already checked
                    if ($('#makeGraph').is(':checked')) {
                        populateGraphForm(rows);
                    }
                    $('#editable-table').removeClass('d-none').show();
                    $('.add-box-table').addClass('d-none');
                    $('#tableForm').removeClass('d-none');
                    $('#customizetable').hide();
                } else {
                    alert('The uploaded CSV file is empty.');
                }
            } catch (error) {
                console.error('Error parsing CSV file:', error);
                alert('Failed to process the CSV file. Please ensure it is correctly formatted.');
            }
        };
        reader.readAsText(file);
    });
}
function readAndDisplayCSVFileForGraph() {
    $('#GraphIdforcsv').on('change', function (e) {
        var file = e.target.files[0];
        if (!file) {
            alert('Please select a CSV file!');
            return;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
            try {
                var csvContent = e.target.result;
                var rows = csvContent.split('\n').map(function (row) {
                    return row.split(',');
                });
                if (rows.length > 1) {
                    $('#graphForm').removeClass('d-none');
                    $('.add-box').addClass('d-none');

                    populateGraphForm(rows); 
                } else {
                    alert('The uploaded CSV file is empty or improperly formatted.');
                }
            } catch (error) {
                console.error('Error reading CSV file:', error);
                alert('Failed to process the CSV file. Please ensure it is correctly formatted.');
            }
        };

        reader.readAsText(file);
    });
}
function populateTable(rows) {
    var tableHeader = '';
    var tableBody = '';
    tableHeader += '<tr>';
    rows[0].forEach(function (header) {
        tableHeader += `<th>${header || 'Header'}</th>`;
    });
    tableHeader += '</tr>';

    rows.slice(1).forEach(function (row) {
        tableBody += '<tr>';
        row.forEach(function (cell) {
            tableBody += `<td>${cell || ''}</td>`;
        });
        tableBody += '</tr>';
    });

    $('#editable-table thead').html(tableHeader);
    $('#editable-table tbody').html(tableBody);
    console.log('Table successfully populated with CSV data.');
}
function populateGraphForm(rows) {
    $('#rowsContainer').empty();
    var stockData = {};
    rows.slice(1).forEach(function (row) {
        var seriesName = row[0];
        var seriesValue = row[1];
        var xaxis = row[2];
        var seriesColor = row[3] || "#000000";
        if (!stockData[seriesName]) {
            stockData[seriesName] = { values: [], color: seriesColor };
        }
        stockData[seriesName].values.push(seriesValue);
    });

    Object.keys(stockData).forEach(function (seriesName) {
        if (stockData[seriesName].values.length === 0) return;

        var seriesValues = stockData[seriesName].values.join(',');
        var seriesColor = stockData[seriesName].color;

        var newRow = `
            <div class="row series-row">
                <div class="col-md-4 col-12 form-group">
                    <label for="SeriesName">Series Name</label>
                    <input type="text" class="form-control series-name" placeholder="Series Name" value="${seriesName}">
                </div>
                <div class="col-md-4 col-12 form-group">
                    <label for="ChartValue">Enter Comma Separated Chart Values</label>
                    <input type="text" class="form-control series-values" placeholder="Comma-separated values" value="${seriesValues}">
                </div>
                <div class="col-md-3 col-12 form-group">
                    <label for="SeriesColor">Select or Enter Color</label>
                    <div class="d-flex align-items-center">
                        <input type="color" class="form-control-color series-color-picker" value="${seriesColor}" style="width: 50px; height: 38px; margin-right: 10px;">
                        <input type="text" class="form-control series-color" placeholder="Color (e.g., #ff0000)" value="${seriesColor}">
                    </div>
                </div>
                <div class="col-md-1 col-12 mt-auto text-end">
                    <button type="button" class="btn btn-sm remove-button ms-auto remove-series"><i class="feather-minus-square fs-2"></i></button>
                </div>
            </div>`;
        $('#rowsContainer').append(newRow);
    });

    // Add event listener for Remove buttons
    $('#rowsContainer').on('click', '.remove-series', function () {
        $(this).closest('.series-row').remove();
    });

    // Add a unique Add button for adding new series
    if ($('#addSeriesButton').length === 0) {
        $('#rowsContainer').after(`
            <div class="text-end mt-3">
                <button type="button" id="addSeriesButton" class="btn btn-sm btn-success"><i class="feather-plus-square fs-3"></i> Add Series</button>
            </div>
        `);

        $('#addSeriesButton').on('click', function () {
            var newRow = `
                <div class="row series-row">
                    <div class="col-md-4 col-12 form-group">
                        <label for="SeriesName">Series Name</label>
                        <input type="text" class="form-control series-name" placeholder="Series Name" value="">
                    </div>
                    <div class="col-md-4 col-12 form-group">
                        <label for="ChartValue">Enter Comma Separated Chart Values</label>
                        <input type="text" class="form-control series-values" placeholder="Comma-separated values" value="">
                    </div>
                    <div class="col-md-3 col-12 form-group">
                        <label for="SeriesColor">Select or Enter Color</label>
                        <div class="d-flex align-items-center">
                            <input type="color" class="form-control-color series-color-picker" value="#000000" style="width: 50px; height: 38px; margin-right: 10px;">
                            <input type="text" class="form-control series-color" placeholder="Color (e.g., #ff0000)" value="#000000">
                        </div>
                    </div>
                    <div class="col-md-1 col-12 mt-auto text-end">
                        <button type="button" class="btn btn-sm remove-button ms-auto remove-series"><i class="feather-minus-square fs-2"></i></button>
                    </div>
                </div>`;
            $('#rowsContainer').append(newRow);
        });
    }

    // Sync color picker and text input
    $('#rowsContainer').on('input', '.series-color-picker', function () {
        $(this).siblings('.series-color').val($(this).val());
    });

    $('#rowsContainer').on('input', '.series-color', function () {
        $(this).siblings('.series-color-picker').val($(this).val());
    });

    // Collect all the unique x-axis (dates) and assign to the LabelOrientation field
    var uniqueDates = [];
    rows.slice(1).forEach(function (row) {
        var xaxis = row[2]; // x-axis (Date)
        if (!uniqueDates.includes(xaxis)) {
            uniqueDates.push(xaxis);
        }
    });

    $('#LabelOrientation').val(uniqueDates.join(', ')); // Set the LabelOrientation with all the dates
}


$('#GenerateChart').on('click', function () {
    var seriesNames = [];
    var chartValues = [];
    var seriesColors = [];

    var charttypes = $('#ChartType option:selected').text();

    $('.series-name').each(function () {
        seriesNames.push($(this).val());
    });

    $('.series-values').each(function () {
        chartValues.push($(this).val().split(',').map(Number)); // Convert CSV to array of numbers
    });

    $('.series-color').each(function () {
        seriesColors.push($(this).val());
    });

    var chartData = seriesNames.map(function (name, index) {
        return {
            name: name,
            data: chartValues[index],
            color: seriesColors[index]
        };
    });

    // Set up chart options
    Highcharts.chart('chartContainer', {
        chart: {
            type: charttypes
        },
        title: {
            text: $('#graphTitle').val()
        },
        subtitle: {
            text: $('#graphSubTitle').val()
        },
        xAxis: {
            categories: $('#LabelOrientation').val().split(',')
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        },
        series: chartData
    });

    // Show the graph container
    $('.chartone').removeClass('d-none');
});
function SaveNews() {
    var ntitle = $("#addtitle").val().trim();
    var nadddescription = $("#adddescription").val().trim();


    if (ntitle === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a Title.',
            footer: ''
        });
        return;
    }

    if (nadddescription === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a Description.',
            footer: ''
        });
        return;
    }


    var UserID = $('#UserID').val();
    var TemplateID = 1;
    var TagName = $('#TagName').val() ? $('#TagName').val() : '';
    var SlugName = $('#SlugName').val() ? $('#SlugName').val() : '';
    var NewsStatus = 0;
    var Islive = 0;

    //#region Graph data
    var graphtypeid = $('#ChartType').val();
    var graphTitle = $('#graphTitle').val();
    var graphSubTitle = $('#graphSubTitle').val();
    var labelname = $('#LabelOrientation').val();
    var graphSeries = [];

    $('#rowsContainer .row').each(function () {
        var seriesName = $(this).find('.series-name').val();
        var seriesValues = $(this).find('.series-values').val();
        var seriesColor = $(this).find('.series-color').val();

        // If seriesColor is undefined or empty, set a default color (e.g., black)
        if (!seriesColor) {
            seriesColor = "#000000"; // Default to black color
        }

        if (seriesName && seriesValues) {
            var values = seriesValues.split(',').map(function (val) { return parseInt(val.trim(), 10); });
            var graphlabel = labelname.split(',').map(function (val) { return val.trim() });

            graphSeries.push({
                XaxisLabel: graphlabel, // Directly use the array of labels
                SeriesName: seriesName,
                GraphValue: values, // Use an array for values
                SeriesColor: seriesColor // Use the default color if no color was found
            });
        }
    });

    //#region CustomizedTable or CSV Upload
    var tableame, tablerows, tablecolumns, tableData = [];
    var fileInput = document.getElementById('addtablefile');
    if (fileInput.files.length > 0) {
        var file = fileInput.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            var csvData = e.target.result;
            var rows = csvData.split('\n').filter(row => row.trim() !== '');
            tableame = file.name.replace('.csv', '');
            tablerows = rows.length - 1; 
            tablecolumns = rows[0].split(',').length; 
            rows.forEach((row, rowIndex) => {
                var cells = row.split(',');
                cells.forEach((cellContent, colIndex) => {
                    tableData.push({
                        rownumber: rowIndex + 1,
                        columnnumber: colIndex + 1,
                        cellcontent: cellContent.trim(),
                        isheader: rowIndex === 0 ? '1' : '0'
                    });
                });
            });
            saveToAPI();
        };
        reader.readAsText(file); 
        return; 
    } else {
        tableame = $('#TableName').val();
        tablerows = $('#TableRows').val();
        tablecolumns = $('#TableColumns').val();
        $('#editable-table thead tr').each(function (rowIndex) {
            $(this).find('th').each(function (colIndex) {
                var cellContent = $(this).text().trim();
                tableData.push({
                    rownumber: rowIndex + 1,
                    columnnumber: colIndex + 1,
                    cellcontent: cellContent,
                    isheader: '1'
                });
            });
        });
        $('#editable-table tbody tr').each(function (rowIndex) {
            var isRowEmpty = $(this).find('td').toArray().every(td => $(td).text().trim() === '');
            if (!isRowEmpty) {
                $(this).find('td').each(function (colIndex) {
                    var cellContent = $(this).text().trim();
                    tableData.push({
                        rownumber: rowIndex + 1,
                        columnnumber: colIndex + 1,
                        cellcontent: cellContent,
                        isheader: '0'
                    });
                });
            }
        });
        saveToAPI(); 
    }
    //#endregion
    function saveToAPI() {
        // Build the request payload
        var newssave = JSON.stringify({
            UserID: UserID,
            TemplateID: TemplateID,
            TagID: TagName,
            SlugID: SlugName,
            NewsStatus: NewsStatus,
            Islive: Islive,
            GraphTypeID: graphtypeid,
            GraphTitle: graphTitle,
            GraphSubtitle: graphSubTitle,
            GraphSeries: graphSeries,
            ShowLegend: 0,
            tablename: tableame,
            columncount: tablerows,
            rowscount: tablecolumns,
            TableDatas: tableData
        });

        // Confirmation and API call
        Swal.fire({
            title: 'Do you want to save?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok',
            denyButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                new APICALL(GetGlobalURL('Base', 'MGSaveSingleNews'), 'POST', newssave, true).FETCH((result, error) => {
                    if (result && result.data) {
                        news_ids = result.data.news_id;
                        $('#newsid').val(news_ids);
                        SaveNewsContent();
                    }
                    if (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            text: error.data.responseText,
                            footer: ''
                        });
                    }
                });
            }
        });
    }
}
function SaveNewsContent() {
    var contents = [];
    $('.data').each(function () {
        var element = $(this);
        var formId = element.attr('formid'); 
        var value = element.val();  
        if (element.prop('tagName').toLowerCase() === 'img') {
            value = element.attr('src'); 
        }

        var contentData = {
            NewsID: news_ids,  
            FormID: formId,
            NewsContent: value,
        };

        contents.push(contentData);
    });

    new APICALL(GetGlobalURL('Base', 'Save_SingleNews_Content'), 'POST', JSON.stringify(contents), true).FETCH((result, error) => {
        if (result && result.data) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'News saved successfully!',
                footer: ''
            }).then(() => {
                window.location.reload();
                clearAllFeild();
            });
        } else if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Failed to save news content. ' + error.data.responseText,
                footer: ''
            });
        }
    });
}
function clearAllFeild() {
    $('#addtitle').val('');
    $('#adddescription').val('');
    $('.note-editable').html('');
    $('#SlugName').val(null).trigger('change');
    $('#TagName').val(null).trigger('change');
    $('#ChartType').val('');
    $('#graphTitle').val('');
    $('#graphSubTitle').val('');
    $('#TableName').val('');
    $('#TableRows').val('');
    $('#TableColumns').val('');
    $('#LabelOrientation').val('');
    $('.series-name').val('');
    $('.series-values').val('');
    $('.series-color').val('');
    $('#newscheckratio').addClass('d-none');
    $('#imagepath').src = '~/assets/images/upload.png';
    $('.add-box-form').addClass('d-none');
    $('.add-box-table').removeClass('d-none');
}


async function TextToImageGenerate() {
    const textPrompt = $("#textPrompt").val();
    if (textPrompt =="") {
        Swal.fire({
            icon: 'warning',
            title: 'warning...',
            text: 'First you write some text to generate image!',
            footer: ''
        });
        return;
    }
    const requestData = {
        prompt: textPrompt
    };

    try {
        const url = GetGlobalURL('Base', 'GenerateImage');
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        // Parse the JSON response
        const data = await response.json();
        const dropZoneElement = document.querySelector(".drop-zone");
        updateThumbnailFromPath(dropZoneElement, data.imagePath);

    } catch (error) {
        // Handle fetch or network errors
        $("#generateImageBtn").prop("disabled", false).text("Generate Image");
        $("#loading").hide();
        alert("Failed to send request. Please try again.");
    }
}