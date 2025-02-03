var Globalnewsid = $('#newsid').val();
var GraphID;
var TableID;
$(document).ready(function () { 
    $('#summernote').summernote({
        height: 300,
        maxHeight: 300, 
        minHeight: 300, 
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
    show();
    readAndDisplayCSVFile();
    readAndDisplayCSVFileForGraph();
    $('#generate-news-ai').on('click', function () {
        AI_NewsGenerated();
    });
    $('.drop-zone__input').change(function () {
        SaveNewsImage();
        $('#newscheckratio').removeClass('d-none');
    });
    $('#btnupdatenews').click(function () {
        UpdateSingleNews();
    })
    $('#DeleteSaveTable').click(function () {
        DeleteSaveTable();
    });
    $('#DeleteSaveGraph').click(function () {
        DeleteSaveGraphs();
    });
    $('#btnSaveGraph').click(function () {
        SaveNewsGraph();
    });
    $('#btnSaveTable').click(function () {
        SaveNewsTable();
    });
    $('#clearhtmltablefile').on('click', function (event) {
        event.preventDefault(); // Default behavior ko prevent karta hai (e.g., form submission)

        document.getElementById('addtablefile').value = ''; // File input clear karna

        $('#customizetable').removeClass('d-none');
        $('.add-box-table').removeClass('d-none');
        $('.add-box-form').addClass('d-none');
        $('.add-box').removeClass('d-none');

    });
    $('#CreateNewtable').click(function () {
        $('#customizetable').removeClass('d-none');
    });
    $('#DeleteSaveTable').addClass('d-none');
    $('#clearhtmltablefile').addClass('d-none');
    $('#AddNewtable').click(function () {
        if (TableID > 0) {
            $('.add-box-table').addClass('d-none');
            $('#btnSaveTable').addClass('d-none');
        }
        else {
            $('.add-box-table').removeClass('d-none');
            $('.add-box-form').addClass('d-none');
        }
        $('#customizetable').addClass('d-none');
        
    });
    $('.editgraph').click(function () {
        $('#graphForm').removeClass('d-none');
        $('.chartone').addClass('d-none');

    });

    $('#btngeneratetexttoimage').click(function () {
        TextToImageGenerate();
    });

    if (TableID > 0) {
        $('#DeleteSaveTable').removeClass('d-none');
    }
    else {
        $('#DeleteSaveTable').addClass('d-none');

        $('#btnSaveTable').removeClass('d-none');
    }
})

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
function updateThumbnailFromPath(dropZoneElement, imagePath) {
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    // First time - remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__prompt")) {
        dropZoneElement.querySelector(".drop-zone__prompt").remove();
    }

    // First time - create thumbnail element if it doesn't exist
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");

        // Style the thumbnail element
        thumbnailElement.style.display = "flex";
        thumbnailElement.style.alignItems = "center";
        thumbnailElement.style.justifyContent = "center";
        thumbnailElement.style.height = "100%"; // Full height of the container
        thumbnailElement.style.overflow = "hidden";
        dropZoneElement.appendChild(thumbnailElement);
    }

    // Create an img element to display the uploaded image
    const imgElement = document.createElement("img");
    imgElement.alt = "Uploaded Image"; // Set alt text
    //imgElement.src = imagePath; // Use the image path from the server
    imgElement.src = imagePath;

    // Style the img element to fit properly
    imgElement.style.width = "489px";
    imgElement.style.maxHeight = "100%";
    imgElement.style.objectFit = "fill"; // Ensures the image fits without distortion

    // Set custom attributes if needed
    imgElement.setAttribute("formid", "4");
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
        if (GraphID > 0) {
            addBox.classList.addClass('d-none');
            $('.add-box').removeClass('d-none');


        }
        else {
            addBox.classList.addClass('d-none');
            graphForm.classList.removeClass('d-none');
            $('.add-box').removeClass('d-none');

        }
        

        

        


    }
    document.getElementById('AddGraph').addEventListener('click', function (event) {
        const target = event.target;
        if (target.id === 'GraphId') {
            addBox.classList.add('d-none');
            graphForm.classList.remove('d-none');
            chartOne.classList.add('d-none');
            if (GraphID > 0) {
                $('#DeleteSaveGraph').removeClass('d-none');

            }
            else {
                $('#DeleteSaveGraph').addClass('d-none');
            }
        } else if (target.id === 'GenerateChart') {
            graphForm.classList.add('d-none');
            chartOne.classList.remove('d-none');
            $('.editgraph').removeClass('d-none');
            if (GraphID > 0) {
                $('#DeleteSaveGraph').removeClass('d-none');
            }
            else {
                $('#DeleteSaveTable').addClass('d-none');
                $('#btnSaveGraph').removeClass('d-none');

            }
        }
    });
    const addNewGraphTabButton = document.getElementById('addNew-Graph');
    addNewGraphTabButton.addEventListener('click', function () {
        resetAddGraphTab();
    });
    resetAddGraphTab();
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
                //let image = '../' + $(this).data("image");
                let image = $(this).data("image");
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
function typingAnimation(text, targetElement, speed) {
    let index = 0;
    $(targetElement).html('');

    let interval = setInterval(() => {
        if (index < text.length) {
            $(targetElement).html((i, old) => old + text.charAt(index));
            index++;
        } else {
            clearInterval(interval); 
        }
    }, speed);
}
function AI_NewsGenerated() {
    var newsContent = $('#addAiNews').val().trim();
    if (!newsContent) {
        alert("Please add content to generate professional AI-based news.");
        return;
    }
    var encodedNewsContent = encodeURIComponent(newsContent);
    new APICALL(GetGlobalURL('Base', 'GetAIGeneratedMGNews?newsContent=' + encodedNewsContent), 'GET', '', true).FETCH(async (result, error) => {
        if (error) {
            console.error("API Error:", error);
            alert("An error occurred while fetching AI-generated news.");
            return;
        }
        if (result && result.data && result.data.choices && result.data.choices.length > 0) {
            var professionalNews = result.data.choices[0].text.trim();
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

            // Show chart and hide form
            $('#chartContainer').removeClass('d-none');
            $('#graphForm').addClass('d-none');
        } else {
            alert('Invalid chart type selected.');
        }
    });

    // Show graph form when editing


    // Delete the graph and reset form
    //$('.deletegraph').on('click', function () {
    //    $('#chartContainer').addClass('d-none');
    //    $('#graphForm').removeClass('d-none');

    //    // Clear form fields
    //    $('#graphTitle').val('');
    //    $('#graphSubTitle').val('');
    //    $('#LabelOrientation').val('');
    //    $('.series-name').val('');
    //    $('.series-values').val('');
    //    $('.series-color').val('');
    //    $('#rowsContainer').empty(); // Clear all series rows
    //});

    // Add new series row dynamically
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
        $('.add-box-form').removeClass('d-none');
        $('#customizetable').removeClass('d-none');
        $('.add-box-table').addClass('d-none');

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
        $('#editable-table').removeClass('d-none');
    });
}
function readAndDisplayCSVFile() {
    $('#addtablefile').on('change', function (e) {
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
                    $('#editable-table').removeClass('d-none').show();
                    $('.add-box-table').addClass('d-none');
                    $('#clearhtmltablefile').addClass('d-none');
                    $('#tableForm').removeClass('d-none');
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
function show() {
    GetNewsDetail(Globalnewsid)
}
function GetNewsDetail(GlobalNewsID) {
    new APICALL(GetGlobalURL('Base', 'GetSingleNewsDetail?NewsID=' + GlobalNewsID), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data && result.data.length > 0) {
                const data = result.data[0];
                //#region Single News Data Fetch
                GraphID = data.GraphID;
                TableID = data.TableID;
                $('#addtitle').val(data.title || '');
                $('#adddescription').val(data.newsdescription || '');
                $('#summernote').summernote('code', data.newscontent || '');
                $('#ChartType').val(data.GraphTypeID).trigger('change');
                $('#graphTitle').val(data.GraphTitle || '');
                $('#graphSubTitle').val(data.GraphSubTitle || '');
                $('#TableName').val(data.TableName || '');
                $('#TableRows').val(data.RowCounts || '');
                $('#TableColumns').val(data.ColCounts || '');
                const dropZoneElement = document.querySelector(".drop-zone");
                if (dropZoneElement) {
                    updateThumbnailFromPath(dropZoneElement, data.Newsimage || '');
                } else {
                    console.warn("Drop zone element not found.");
                }
                if (data.graph_series_json) {

                    $('#addgraphtab').addClass('d-none');
                    $('.deletegraph').removeClass('d-none');

                    const graphSeries = JSON.parse(data.graph_series_json);

                    // Group series data by series name
                    const groupedData = graphSeries.reduce((acc, series) => {
                        if (!acc[series.seriesname]) {
                            acc[series.seriesname] = {
                                xaxislabels: [],
                                graphvalues: [],
                                color: series.seriescolor,
                            };
                        }
                        acc[series.seriesname].xaxislabels.push(series.xaxislabel);
                        acc[series.seriesname].graphvalues.push(series.graphvalue);
                        return acc;
                    }, {});

                    // Populate X-axis labels
                    $('#LabelOrientation').val(Object.values(groupedData).map(group => group.xaxislabels.join(',')).join(','));

                    // Clear existing series rows
                    $('#rowsContainer .series-row').remove();

                    $('.chartone').removeClass('d-none');

                    // Populate graph series dynamically
                    const seriesData = [];
                    Object.entries(groupedData).forEach(([seriesName, { xaxislabels, graphvalues, color }]) => {
                        const seriesRow = `
                            <div class="row series-row">
                                <div class="col-md-4 col-12 form-group">
                                    <label>Series Name</label>
                                    <input type="text" class="form-control series-name" value="${seriesName}" placeholder="Series Name">
                                </div>
                                <div class="col-md-4 col-12 form-group">
                                    <label>Chart Values</label>
                                    <input type="text" class="form-control series-values" value="${graphvalues.join(',')}" placeholder="Comma-separated values (e.g., 10,20,30)">
                                </div>
                                <div class="col-md-3 col-12 form-group">
                                    <label>Series Color</label>
                                    <input type="text" class="form-control series-color" value="${color}" placeholder="Color (e.g., red)">
                                </div>
                                <div class="col-md-1 col-12 mt-auto text-end">
                                    <button class="btn btn-sm remove-button" type="button">
                                        <i class="feather-minus-square fs-2"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                        $('#rowsContainer').append(seriesRow);

                        seriesData.push({
                            name: seriesName,
                            data: graphvalues.map(value => parseFloat(value)),
                            color: color,
                        });
                    });

                    // Render chart
                    const chartType = $('#ChartType option:selected').text();

                    const chartTitle = $('#graphTitle').val();
                    const chartSubTitle = $('#graphSubTitle').val();
                    const xAxisLabels = Object.values(groupedData)[0]?.xaxislabels || [];

                    Highcharts.chart('chartContainer', {
                        chart: { type: chartType },
                        title: { text: chartTitle },
                        subtitle: { text: chartSubTitle },
                        xAxis: chartType === 'pie' ? undefined : { categories: xAxisLabels },
                        series: chartType === 'pie' ? [{
                            name: chartTitle,
                            data: seriesData.map(s => ({
                                name: s.name,
                                y: s.data.reduce((sum, value) => sum + value, 0),
                                color: s.color,
                            }))
                        }] : seriesData
                    });
                }
                if (data.table_headers_json) {
                    const tableHeaders = JSON.parse(data.table_headers_json);
                    $('#editable-table thead').empty();
                    const headerRow = $('<tr>');
                    tableHeaders.forEach(header => {
                        headerRow.append(`<th>${header.cellcontent}</th>`);
                    });
                    $('#editable-table thead').append(headerRow);
                }
                if (data.table_data_json) {
                    $('.add-box-table').addClass('d-none');
                    $('#DeleteSaveTable').removeClass('d-none');

                    const tableData = JSON.parse(data.table_data_json);
                    $('#editable-table tbody').empty();

                    const groupedRows = {};
                    tableData.forEach(cell => {
                        if (!groupedRows[cell.rownumber]) {
                            groupedRows[cell.rownumber] = [];
                        }
                        groupedRows[cell.rownumber].push(cell);
                    });

                    Object.values(groupedRows).forEach(rowCells => {
                        const tableRow = $('<tr>');
                        rowCells.forEach(cell => {
                            tableRow.append(`<td contenteditable="true">${cell.cellcontent}</td>`);
                        });
                        $('#editable-table tbody').append(tableRow);
                    });
                }
                const slugs = JSON.parse(data.SlugsData);
                slugs.forEach(slug => {
                    $('#SlugName').append(new Option(slug.SlugName, slug.SlugID, true, true));
                });
                $('#SlugName').trigger('change');
                const tags = JSON.parse(data.TagsData);
                tags.forEach(tag => {
                    $('#TagName').append(new Option(tag.TagName, tag.TagID, true, true));
                });
                $('#TagName').trigger('change');
                //#endregion
            }
        } else if (error) {
            console.error('Error fetching news details:', error);
            alert('Failed to fetch news details. Please try again.');
        }
    });
}
function UpdateSingleNews() {
    var UserID = $('#UserID').val();
    var newsidss = $('#newsid').val();
    var TemplateID = 1;
    var TagName = $('#TagName').val() ? $('#TagName').val() : '';
    var SlugName = $('#SlugName').val() ? $('#SlugName').val() : '';
    var NewsStatus = 0;
    var Islive = 0;

    saveToAPI();

    function saveToAPI() {
        // Build the request payload
        var newssave = JSON.stringify({
            NewsID: newsidss,
            UserID: UserID,
            TemplateID: TemplateID,
            TagID: TagName,
            SlugID: SlugName,
            NewsStatus: NewsStatus,
            Islive: Islive
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
                new APICALL(GetGlobalURL('Base', 'MGUpdateSingleNews'), 'POST', newssave, true).FETCH((result, error) => {
                    if (result && result.data) {
                        news_ids = result.data.news_id;
                        $('#newsid').val(news_ids);
                        UpdateNewsContent();
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
function UpdateNewsContent() {
    var contents = [];
    $('.data').each(function () {
        var element = $(this);
        var formId = element.attr('formid');
        var value = element.val();
        if (element.prop('tagName').toLowerCase() === 'img') {
            value = element.attr('src');
        }

        var contentData = {
            //ContentID: ContentID,
            NewsID: news_ids,
            FormID: formId,
            NewsContent: value,
        };

        contents.push(contentData);
    });

    new APICALL(GetGlobalURL('Base', 'Update_SingleNews_Content'), 'POST', JSON.stringify(contents), true).FETCH((result, error) => {
        if (result && result.data) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'News Updated successfully!',
                footer: ''
            });
            clearAllFeild();
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
function DeleteSaveTable() {
    var DeleteHTMLTable = JSON.stringify({
        TableID: TableID
    });
    Swal.fire({
        title: 'Do you want to delete this Table?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'DeleteSingleNewsHTMLTable'), 'POST', DeleteHTMLTable, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Table Delete Successfully',
                        footer: ''
                    });
                    
                    $('.add-box-table').removeClass('d-none');
                    $('.add-box-form').addClass('d-none');
                    $('#graph-container').html('');
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
function DeleteSaveGraphs() {
    Swal.fire({
        title: 'Do you want to delete this Graph?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            var DeleteGraph = JSON.stringify({
                GraphID: GraphID
            });

            new APICALL(GetGlobalURL('Base', 'DeleteSingleNewsGraph'), 'POST', DeleteGraph, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Graph Deleted Successfully',
                        footer: ''
                    }).then(() => {
                        $('#addgraphtab').removeClass('d-none');
                        $('.add-box').removeClass('d-none');
                        $('.editgraph').addClass('d-none');
                        $('.chartone .highcharts-figure').addClass('d-none');
                        $('#btnSaveGraph').addClass('d-none');
                        $('.deletegraph').addClass('d-none');
                        $('#graphForm').addClass('d-none');
                        $('#LabelOrientation').val();
                        window.location.reload();
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
    });
}
function SaveNewsGraph() {
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
        if (seriesName && seriesValues && seriesColor) {
            var values = seriesValues.split(',').map(function (val) { return parseInt(val.trim(), 10); });
            var graphlabel = labelname.split(',').map(function (val) { return parseInt(val.trim(), 10); });
            graphSeries.push({
                XaxisLabel: graphlabel,
                SeriesName: seriesName,
                GraphValue: values,
                SeriesColor: seriesColor
            });
            saveToAPI();
        }
    });
    //#endregion
    function saveToAPI() {
        var newssave = JSON.stringify({
            NewsID: Globalnewsid,
            GraphID: GraphID,
            GraphTypeID: graphtypeid,
            GraphTitle: graphTitle,
            GraphSubtitle: graphSubTitle,
            GraphSeries: graphSeries,
            ShowLegend: 0
        });
        Swal.fire({
            title: 'Do you want to save?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok',
            denyButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                new APICALL(GetGlobalURL('Base', 'MGSaveSingleNewsGraph'), 'POST', newssave, true).FETCH((result, error) => {
                    if (result && result.data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success...',
                            text: 'Graph saved successfully!',
                            footer: ''
                        }).then(() => {
                            location.reload();
                            $('.add-box').addClass('d-none');
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
        });
    }
}
function SaveNewsTable() {
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
            NewsID: Globalnewsid,
            TableID: TableID,
            tablename: tableame,
            columncount: tablerows,
            rowscount: tablecolumns,
            TableDatas: tableData
        });
        Swal.fire({
            title: 'Do you want to save?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: 'Ok',
            denyButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                new APICALL(GetGlobalURL('Base', 'MGSaveSingleNewsTable'), 'POST', newssave, true).FETCH((result, error) => {
                    if (result && result.data) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success...',
                            text: 'Table Save successfully!',
                            footer: ''
                        }).then(() => {
                            location.reload();

                        });;
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

async function TextToImageGenerate() {
    const textPrompt = $("#textPrompt").val();
    if (textPrompt == "") {
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