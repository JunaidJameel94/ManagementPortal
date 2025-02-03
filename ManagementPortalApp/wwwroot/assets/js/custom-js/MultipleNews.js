let tbl_graph = [];
let chartID = 1;
const tbl_tables = [];
var news_ids;
$(document).ready(function () {
    GetCollectionName();
    SelectNewsslugsDropdown();
    SelectNewsTagDropdown();
    GetGraphType();
    initEventListenersForGraph();
    MakeTable();
    readAndDisplayCSVFile();
    readAndDisplayCSVFileForGraph();
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
        icon.attr('data-feather', 'chevron-up'); 
        feather.replace(); 
    });
    $('.js-select2').on('select2:close', function () {
        const icon = $(this).siblings('.dropdown-icon');
        icon.attr('data-feather', 'chevron-down'); 
        feather.replace(); 
    });
    $('#generate-news-ai').on('click', function () {
        AI_NewsGenerated();
    });
    $('#clearhtmltablefile').on('click', function () {
        $('.add-box-table').removeClass('d-none');
        $('.add-box-form').addClass('d-none');
        $('#SaveTableSettings').addClass('d-none');
        
        document.getElementById('addtablefile').value = '';
        $('#TableName').val('');
        $('#TableRows').val('');
        $('#TableColumns').val('');
    });    
    $('#btn_savemultipleNews').click(function () {
        SaveMultipleNews();
    });

    $('#btngeneratetexttoimage').click(function () {
        TextToImageGenerate();
    });

});

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const uploadContainer = document.getElementById("uploadContainer");
const navigationButtons = document.getElementById("navigationButtons");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

const maxVisible = 5;
let currentIndex = 0;

dropzone.addEventListener("click", () => {
        fileInput.click();
    });

dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });
function updateVisibility() {
        const items = Array.from(uploadContainer.children);
        if (items.length > 0) {
            dropzone.parentElement.classList.add("reduceSize");
        } else {
            dropzone.parentElement.classList.remove("reduceSize");
        }
        items.forEach((item, index) => {
            if (index >= currentIndex && index < currentIndex + maxVisible) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });

        navigationButtons.style.display = items.length > maxVisible ? "flex" : "none";
    }

leftButton.addEventListener("click", () => {
        const items = Array.from(uploadContainer.children);
        if (currentIndex > 0) {
            currentIndex--;
            updateVisibility();
        }
    });

rightButton.addEventListener("click", () => {
        const items = Array.from(uploadContainer.children);
        if (currentIndex + maxVisible < items.length) {
            currentIndex++;
            updateVisibility();
        }
    });

fileInput.addEventListener("change", () => {
    const files = Array.from(fileInput.files); 
    SaveNewsImage();
    handleFiles(files);
});

dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropzone.classList.remove("dragover");
        handleFiles(e.dataTransfer.files);
    });
function handleFiles(files) {
    files.forEach((file) => {
        if (typeof file === "string") {
            const previewDiv = document.createElement("div");
            previewDiv.classList.add("upimageone");

            const imgElement = document.createElement("img");
            imgElement.src = '../' + file;
            imgElement.alt = "Preview";
            imgElement.classList.add("img-fluid");
            imgElement.setAttribute("formid", "4");  
            imgElement.classList.add("data"); 

            previewDiv.appendChild(imgElement);

            previewDiv.innerHTML += `
           <div class="uplods-imgbtns">
             <button class="btn rounded-circle btn-circle-danger" id="deleteFile"><i class="feather-trash fs-5 m-auto"></i></button> 
             <button class="btn rounded-circle btn-main-circle" id="viewFile"><i class="feather-search fs-5 m-auto"></i></button>
           </div>
         `;

            previewDiv.querySelector(".btn-circle-danger").addEventListener("click", () => {
                previewDiv.remove();
                updateVisibility();
            });

            uploadContainer.appendChild(previewDiv);
            updateVisibility();
        } else if (file instanceof File) {
            const previewDiv = document.createElement("div");
            previewDiv.classList.add("upimageone");

            const objectURL = URL.createObjectURL(file);

            let mediaElement;
            if (file.type.startsWith("video/")) {
                mediaElement = document.createElement("video");
                mediaElement.controls = true;
                const sourceElement = document.createElement("source");
                sourceElement.src = objectURL;
                sourceElement.type = file.type;
                mediaElement.appendChild(sourceElement);
            } 

            previewDiv.appendChild(mediaElement);

            previewDiv.innerHTML += `
            <div class="uplods-imgbtns">
              <button class="btn rounded-circle btn-circle-danger" id="deleteFile"><i class="feather-trash fs-5 m-auto"></i></button> 
              <button class="btn rounded-circle btn-main-circle" id="viewFile"><i class="feather-search fs-5 m-auto"></i></button>
            </div>
          `;

            previewDiv.querySelector(".btn-circle-danger").addEventListener("click", () => {
                previewDiv.remove();
                updateVisibility();
            });

            uploadContainer.appendChild(previewDiv);
            updateVisibility();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const uploadContainer = document.getElementById("uploadContainer");
    const viewModal = new bootstrap.Modal(document.getElementById("viewModal"));
    const modalImage = document.getElementById("modalImage");
    const modalVideo = document.getElementById("modalVideo");
    const modalVideoSource = document.getElementById("modalVideoSource");
    uploadContainer.addEventListener("click", (e) => {
        if (e.target.closest("#deleteFile")) {
            const upimageone = e.target.closest(".upimageone");
            if (upimageone) {
                upimageone.remove();
            }
        }
    });
    uploadContainer.addEventListener("click", (e) => {
        if (e.target.closest("#viewFile")) {
            const upimageone = e.target.closest(".upimageone");
            if (upimageone) {
                const image = upimageone.querySelector("img");
                const video = upimageone.querySelector("video");

                if (image) {
                    modalImage.src = image.src;
                    modalImage.classList.remove("d-none");
                    modalVideo.classList.add("d-none");
                } else if (video) {
                    modalVideoSource.src = video.querySelector("source").src;
                    modalVideo.load();
                    modalVideo.classList.remove("d-none");
                    modalImage.classList.add("d-none");
                }

                viewModal.show();
                $('body').removeClass();
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addBox = document.querySelector('.add-box');
    const graphForm = document.getElementById('graphForm');
    const MGGraphTable = document.querySelector('.MGGraphTable');
    function resetAddGraphTab() {
        addBox.classList.remove('d-none');
        graphForm.classList.add('d-none');
        MGGraphTable.classList.add('d-none');
    }
    document.getElementById('AddGraph').addEventListener('click', function (event) {
        const target = event.target;
        if (target.id === 'GraphId') {
            addBox.classList.add('d-none');
            graphForm.classList.remove('d-none');
            MGGraphTable.classList.add('d-none');
        } else if (target.id === 'GenerateChart') {
            graphForm.classList.add('d-none');
            MGGraphTable.classList.remove('d-none');
        }
    });
    const addNewGraphTabButton = document.getElementById('addNew-Graph');
    addNewGraphTabButton.addEventListener('click', function () {
        $('#ChartType').val('');
        $('#graphTitle').val('');
        $('#graphSubTitle').val('');
        $('#LabelOrientation').val('');
        $('.series-name').val('');
        $('.series-values').val('');
        $('.series-color').val('');

        resetAddGraphTab();
    });
    resetAddGraphTab();
});

document.addEventListener('DOMContentLoaded', function () {
    const addBoxTable = document.querySelector('.add-box-table');
    const tableForm = document.getElementById('tableForm');
    const MGTable = document.querySelector('#MGTable');
    function resetAddTableTab() {
        addBoxTable.classList.remove('d-none');
        tableForm.classList.add('d-none');
        MGTable.classList.add('d-none');
    }
    document.getElementById('CreateNewtable').addEventListener('click', function () {
        addBoxTable.classList.add('d-none');
        tableForm.classList.remove('d-none');
        MGTable.classList.add('d-none');
        $('#clearhtmltablefile').addClass('d-none');
        $('#SaveTableSettings').addClass('d-none');
    

        $('.add-box-form').removeClass('d-none');

    });
    document.getElementById('SaveTableSettings').addEventListener('click', function () {
        tableForm.classList.add('d-none');
        MGTable.classList.remove('d-none');
    });
    document.getElementById('AddNewtable').addEventListener('click', function () {
        resetAddTableTab();
    });
    resetAddTableTab();
});
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
                /*     let image = '../' + $(this).data("image");*/
                let image = $(this).data("image");
                $("#titleone").val(title);
                $("#addDescription").val(description);
                $("#summernote").summernote("code", content);
                handleFiles([image]);
            });

            $(document).off("click", ".feather-eye").on("click", ".feather-eye", function () {
                globalcollectionID = $(this).data("value");
                const title = $(this).data("title");
                const description = $(this).data("description");
                const content = $(this).data("content");
                let image = $(this).data("image");

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
function SaveNewsImage() {
    var formData = new FormData();
    var files = $('#fileInput')[0].files;
    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }
        new APICALL(GetGlobalURL('FileUpload', 'UploadNewsimageThumnailimageAspectMultipleSelect'), 'POST', formData, true, true).FETCH((result, error) => {
            if (result) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'Images uploaded successfully!',
                    footer: ''
                });
                handleFiles(result.data.imagePaths);

            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'Failed to upload the images!',
                    footer: ''
                });
            }
        });
    }
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
            typingAnimation(professionalNews, '.note-editable[contenteditable="true"]', 10);
        } else {
            alert("Failed to retrieve professional news from AI.");
        }
    });
}
function initEventListenersForGraph() {
    $('#addSeries').click(addSeriesRow);
    $('#GenerateChart').click(generateChart);
    $(document).on('click', '.remove-series', removeSeriesRow);
    $(document).on('click', '.view-chart', viewChart);
    $(document).on('click', '.delete-chart', deleteChart);
    $(document).on('click', '.edit-chart', editChart);
}
function addSeriesRow() {
    let newRow = `<div class="row mt-3">
        <div class="col-md-4 col-12 form-group">
            <input type="text" class="form-control series-name" placeholder="Series Name">
        </div>
        <div class="col-md-4 col-12 form-group">
            <input type="text" class="form-control series-values" placeholder="Comma-separated values (e.g., 10,20,30)">
        </div>
        <div class="col-md-3 col-12 form-group">
            <input type="text" class="form-control series-color" placeholder="Color (e.g., red)">
        </div>
        <div class="col-md-1 col-12 mt-auto text-end">
            <button class="btn btn-sm add-button ms-auto remove-series"> <i class="feather-minus-square fs-2"></i></button>
        </div>
    </div>`;
    $('#rowsContainer').append(newRow);
}
function removeSeriesRow() {
    $(this).closest('.row').remove();
}
function generateChart() {
    let charttypeid = $('#ChartType').val();
    let type = $('#ChartType option:selected').text();
    let title = $('#graphTitle').val();
    let subtitle = $('#graphSubTitle').val();
    let labelOrientation = $('#LabelOrientation').val();
    let series = getSeriesData();

    let chartInfo = {
        id: chartID,
        type,
        title,
        charttypeid,
        subtitle,
        labelOrientation,
        series,
        status: 'Active'
    };

    tbl_graph.push(chartInfo);

    addChartToTable(chartInfo);
    $('#MGGraphTable').removeClass('d-none');
    chartID++;
}
function getSeriesData() {
    let series = [];
    $('.series-name').each(function () {
        let name = $(this).val();
        let values = $(this).closest('.row').find('.series-values').val();
        let color = $(this).closest('.row').find('.series-color').val();

        if (name && values) {
            series.push({
                name: name,
                data: values.split(',').map(Number),
                color: color || undefined
            });
        }
    });
    return series;
}
function addChartToTable(chartInfo) {
    let hiddenSeries = JSON.stringify(chartInfo.series);
    let labelOrientation = chartInfo.labelOrientation || 'Default';


    let charttypeid = chartInfo.charttypeid || 'Unknown';

    let newRow = `<tr data-id="${chartInfo.id}">
        <td>${chartInfo.id}</td>
        <td data-type-id="${charttypeid}">${chartInfo.type}</td> <!-- Store the typeId in a data attribute -->
        <td>${chartInfo.title}</td>
        <td>${chartInfo.subtitle}</td>
        <td>${labelOrientation}</td>
        
        <td class="d-flex justify-content-center">
            <button class="btn btn-success-square edit-chart"><i class="feather feather-edit-3 fs-6"></i></button> &nbsp;
            <button class="btn btn-info-square view-chart"><i class="feather feather-monitor fs-6"></i></button> &nbsp;
            <button class="btn btn-danger-square delete-chart"><i class="feather feather-trash fs-6"></i></button>
        </td>
    </tr>`;

    $('#MGGraphList tbody').append(newRow);
}
function viewChart() {
    let id = $(this).closest('tr').data('id');
    let seriesData = $(this).closest('tr').find('.series-data').text(); 
    let chart = tbl_graph.find(c => c.id === id);

    if (seriesData) {
        chart.series = JSON.parse(seriesData); 
    }

    let labels = $('#LabelOrientation').val();
    let categories = labels ? labels.split(',') : []; 

    $('#chartContainer').empty();

    Highcharts.chart('chartContainer', {
        chart: {
            type: chart.type
        },
        title: {
            text: chart.title
        },
        subtitle: {
            text: chart.subtitle
        },
        xAxis: {
            categories: categories 
        },
        yAxis: {
            title: {
                text: 'Values'
            }
        },
        series: chart.type === 'pie' ? [{
            name: chart.title,
            data: chart.series.map(s => ({
                name: s.name,
                y: s.data.reduce((a, b) => a + b, 0),
                color: s.color
            }))
        }] : chart.series
    });

    $('#modalgraphshow').modal('show');
    $('body').removeClass();
}
function deleteChart() {
    let id = $(this).closest('tr').data('id');
    tbl_graph = tbl_graph.filter(c => c.id !== id);
    $(this).closest('tr').remove();
}
function editChart() {
    let id = $(this).closest('tr').data('id');
    let chart = tbl_graph.find(c => c.id === id);

    $('#graphTitle').val(chart.title);
    $('#graphSubTitle').val(chart.subtitle);
    $('#LabelOrientation').val(chart.labelOrientation);
    $('#rowsContainer').empty();

    chart.series.forEach(s => {
        let newRow = `<div class="row mt-3">
            <div class="col-md-4 col-12 form-group">
                <input type="text" class="form-control series-name" value="${s.name}" placeholder="Series Name">
            </div>
            <div class="col-md-4 col-12 form-group">
                <input type="text" class="form-control series-values" value="${s.data.join(',')}" placeholder="Comma-separated values (e.g., 10,20,30)">
            </div>
            <div class="col-md-3 col-12 form-group">
                <input type="text" class="form-control series-color" value="${s.color || ''}" placeholder="Color (e.g., red)">
            </div>
            <div class="col-md-1 col-12 mt-auto text-end">
                <button class="btn btn-sm btn-danger remove-series">-</button>
            </div>
        </div>`;
        $('#rowsContainer').append(newRow);
    });
    if ($('#rowsContainer').children('.row').length === chart.series.length) {
        $('#rowsContainer').append(`
            <div class="row mt-3">
                <div class="col-12 text-end">
                    <button class="btn btn-sm add-button ms-auto" type="button" id="addSeries">
                        <i class="feather-plus-square fs-2"></i> Add Series
                    </button>
                </div>
            </div>
        `);
    }

    $('#graphForm').removeClass('d-none');
    $('#MGGraphTable').addClass('d-none');

    $('#GenerateChart').off('click').on('click', function () {
        chart.title = $('#graphTitle').val();
        chart.subtitle = $('#graphSubTitle').val();
        chart.labelOrientation = $('#LabelOrientation').val();
        chart.series = getSeriesData();

        $(`#MGGraphList tbody tr[data-id="${chart.id}"]`).remove();
        addChartToTable(chart);
        $('#MGGraphTable').removeClass('d-none');
        $('#graphForm').addClass('d-none');
    });
    $(document).on('click', '#addSeries', addSeriesRow);
}
function MakeTable() {
   
    $('#CreateNewtable').on('click', function () {
        $('#editable-table').hide(); 
        $('.add-box-form').removeClass('d-none'); 
        $('#customizetable').removeClass('d-none'); 
    });
    $('#GenerateTable').on('click', function () {
        $("#SaveTableSettings").removeClass('d-none');
        $('#clearhtmltablefile').removeClass('d-none');
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
        tableHTML += '</tbody></table></div>';
        $('#editable-table').html(tableHTML);
        $('#editable-table').show();

        $('#SaveTableSettings').off('click').on('click', function () {
            var updatedTableHTML = $('#editable-table').html();
            saveTable(tableName, updatedTableHTML);
        });
    });
}
function saveTable(name, content) {
    tbl_tables.push({ name, content }); 
    updateTableList(); 
    $('#MGTable').removeClass('d-none');
}
function updateTableList() {
    const tableBody = $('#tableBody');
    tableBody.empty(); 

    tbl_tables.forEach((table, index) => {
        tableBody.append(`
            <tr>
                <td>${index + 1}</td>
                <td>${table.name}</td>
                <td class="d-flex justify-content-center">
                    <button class="btn btn-infos-squere viewTable" data-index="${index}"><i class="fa-solid fa-eye"></i></button> &nbsp;
                    <button class="btn btn-dangers--squere deleteTable" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `);
    });
    $('.viewTable').click(function () {
        const index = $(this).data('index');
        $('#viewTableContent').html(tbl_tables[index].content);
        $('#viewTableModal').modal('show');
        $('body').removeClass();
    });
    $('.deleteTable').click(function () {
        const index = $(this).data('index');
        tbl_tables.splice(index, 1);
        updateTableList(); 
        if (tbl_tables.length === 0) {
            $('#MGTable').addClass('d-none');
        }
    });
}
function readAndDisplayCSVFile() {
    $('#addtablefile').on('change', function (e) {
        $("#SaveTableSettings").removeClass('d-none');
        $('#clearhtmltablefile').removeClass('d-none');
        $('#editable-table').hide();
        $('.add-box-form').removeClass('d-none');
        var file = e.target.files[0];

        if (!file) {
            alert('Please select a CSV file!');
            return;
        }
        var fileName = file.name.split('.')[0];
        $('#TableName').val(fileName);

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
                    $('#tableForm').removeClass('d-none');
                    $('#customizetable').addClass('d-none');
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
    $('#SaveTableSettings').off('click').on('click', function () {
        var tableName = $('#TableName').val();
        var tableHTML = $('#editable-table').html();
        if (!tableName) {
            alert('Table name is required to save!');
            return;
        }
        saveTable(tableName, `<table>${tableHTML}</table>`);
    });
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
function SaveMultipleNews() {
    var UserID = $('#UserID').val();
    var TemplateID = 2;
    var TagName = $('#TagName').val() || '';
    var SlugName = $('#SlugName').val() || '';
    var NewsStatus = 0;
    var Islive = 0;

    //#region Collect Graph Data
    var graphsData = tbl_graph.map(graph => ({
        GraphTypeID: graph.charttypeid || "",
        GraphTitle: graph.title || "",
        GraphSubtitle: graph.subtitle || "",
        ShowLegend: graph.status === "active" ? "true" : "false",
        GraphSeries: (graph.series || []).map(series => ({
            XaxisLabel: graph.labelOrientation || [],
            SeriesName: series.name || "",
            GraphValue: series.data || [],
            SeriesColor: series.color || ""
        }))
    }));

    //#endregion

    //#region Collect Table Data
    var tablesData = tbl_tables.map((table) => {
        var tableRows = [];
        var $table = $(table.content);

        // Process table header (thead)
        $table.find('thead tr').each(function (rowIndex) {
            $(this).find('th').each(function (colIndex) {
                var headerContent = $(this).text().trim(); // Ensure text content is captured
                if (headerContent) { // Only push if content is not empty
                    tableRows.push({
                        rownumber: rowIndex + 1,
                        columnnumber: colIndex + 1,
                        cellcontent: headerContent,  // Store the exact header content
                        isheader: "1" // Header cells
                    });
                }
            });
        });

        // Process table body (tbody)
        $table.find('tbody tr').each(function (rowIndex) {
            $(this).find('td').each(function (colIndex) {
                var bodyContent = $(this).text().trim(); // Ensure text content is captured
                if (bodyContent) { // Only push if content is not empty
                    tableRows.push({
                        rownumber: rowIndex + 1,
                        columnnumber: colIndex + 1,
                        cellcontent: bodyContent,  // Store the exact body content
                        isheader: "0" // Body cells
                    });
                }
            });
        });

        return {
            tableName: table.name || "Unnamed Table",
            columnCount: $table.find('thead th').length || 0,
            rowCount: $table.find('tbody tr').length || 0,
            data: tableRows
        };
    });

    //#endregion


    // Build API Payload
    var apiPayload = {
        UserID: UserID,
        TemplateID: TemplateID,
        TagID: TagName,
        SlugID: SlugName,
        NewsStatus: NewsStatus.toString(),
        Islive: Islive.toString()
    };

    if (graphsData.length > 0) {
        apiPayload.GraphSeries = graphsData;
    }

    if (tablesData.length > 0) {
        apiPayload.TablesData = tablesData;
    }


    Swal.fire({
        title: 'Do you want to save?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            
            new APICALL(GetGlobalURL('Base', 'MGSaveMultipleNews'), 'POST', JSON.stringify(apiPayload), true).FETCH((response, error) => {
                if (response && response.data) {
                    news_ids = response.data.news_id;
                    $('#newsid').val(news_ids);
                    SaveNewsContent();
                } else if (error) {
                    var errorMessage = error?.data?.responseText || 'An error occurred while saving the news.';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: errorMessage,
                        footer: ''
                    });
                }
            });
        }
    });
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
    new APICALL(GetGlobalURL('Base', 'Save_MultipleNews_Content'), 'POST', JSON.stringify(contents), true).FETCH((result, error) => {
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
    $('#titleone').val('');
    $('#titleTwo').val('');
    $('#titleThree').val('');
    $('#addDescription').val('');
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
        handleFiles([data.imagePath]);

    } catch (error) {
        // Handle fetch or network errors
        $("#generateImageBtn").prop("disabled", false).text("Generate Image");
        $("#loading").hide();
        alert("Failed to send request. Please try again.");
    }
}