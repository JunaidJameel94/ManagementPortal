let pageNumber = 1;
const pageSize = 40;
var currentFeedID;
$(document).ready(function () {
    

    GetFeedRecord();
    GetFeedCategory();
    GetFeedSource();
    GetCollectionName();
    $('#searchButton').click(function () {
        GetFeedBySearchKeyword();
    })
    $('#searchbtn').click(function () {
        GetFeedDatabyFilter();
    })
    $('#btnSavecollection').click(function () {
        SaveCollectionName();
    });
    $('.dropdown-item').on('click', function () {
        $('.dropdown-item').removeClass('active');
        $(this).addClass('active');
        $('#allone').text($(this).text());
    });

});


//#region Meta Tags

function FetchAndDisplayTags(currentFeedID) {
    $('#tags-input').val('');
    new APICALL(GetGlobalURL('Base', `GetAllNewsTagEachNews?FeedID=` + currentFeedID), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data && result.data.length > 0) {
                // Extract the TagName from the API response

                let tags = result.data.map(tag => tag.TagName);

                // Set the tags into the input field
                $('#tags-input').val(tags.join(', ')); // Join tags with commas if needed for display

                // Initialize Tagify with the fetched tags
                initializeTagify(tags);
            } else {
                // No tags found, initialize Tagify with an empty array
                initializeTagify([]);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Error fetching tags from the server.',
                footer: ''
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

function initializeTagify(tags) {
    var input = document.querySelector('#tags-input');
    new Tagify(input, {
        whitelist: tags, // Use the tags as whitelist if needed for suggestions
        maxTags: 10,      // Limit the number of tags
        delimiters: ",| " // Specify how tags are separated in the input field
    });
}


//#endregion

//#region Meta Keyword

function FetchAndDisplayMetaKeyword(currentFeedID) {
    $('#MetaKeyword-input').val('');
    new APICALL(GetGlobalURL('Base', `GetAllNewsKeywordEachNews?FeedID=` + currentFeedID), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data && result.data.length > 0) {
                // Extract MetaKeywords from the API response
                let MetaKeywords = result.data.map(Keyword => Keyword.MetaKeyword);

                $('#MetaKeyword-input').val(MetaKeywords.join(', ')); // Join tags with commas if needed for display
                // Initialize Tagify with the fetched tags
                initializeTagifyForKeyword(MetaKeywords);
            } else {
                // Initialize Tagify with an empty array if no keywords are available
                initializeTagifyForKeyword([]);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Error fetching Keyword from the server.',
                footer: ''
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

function initializeTagifyForKeyword(MetaKeyword) {
    var input = document.querySelector('#MetaKeyword-input');  // Select the input field
    if (!input) {
        console.error("Keyword input field not found.");
        return;
    }

    // Check if Tagify is already initialized, and destroy it if so, to avoid duplication
    if (input.tagify) {
        input.tagify.destroy(); // Remove the old Tagify instance
    }

    // Initialize Tagify with the provided keywords
    var tagify = new Tagify(input, {
        whitelist: MetaKeyword,  // List of keywords to allow
        enforceWhitelist: false, // Allow users to enter new tags that are not in the whitelist
        placeholder: MetaKeyword.length === 0 ? 'No Keyword available. Add your own.' : 'Start typing...',
    });

    input.tagify = tagify; // Attach the tagify instance to the input element

    // If no tags are present, add a placeholder text
    if (MetaKeyword.length === 0) {
        input.placeholder = 'No Keyword available. Add your own.';
    }
}


//#endregion


// Main function to get feed records
function GetFeedRecord() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            loadAllNews(pageNumber);
            loadTextNews(pageNumber);
            loadImageNews(pageNumber);
        }
    });

    // Load more functionality
    $('#loadmorefeedall').on('click', function () {
        pageNumber++;
        loadAllNews(pageNumber);
    });
    $('#loadmorefeedtext').on('click', function () {
        pageNumber++;
        loadTextNews(pageNumber);
    });
    $('#loadmorefeedpicture').on('click', function () {
        pageNumber++;
        loadImageNews(pageNumber);
    });
}

// Call GetFeedRecord when the document is ready
$(function () {
    GetFeedRecord(); // This will call the main function
});

function loadNewsData(endpoint, containerID, page) {
    $('.loading').removeClass('d-none'); // Show loader before fetching data
    new APICALL(GetGlobalURL('Base', `${endpoint}?pageNumber=${page}&pageSize=${pageSize}`), 'GET', '', true).FETCH((result, error) => {
        $('.loading').addClass('d-none'); // Hide loader after fetching data

        if (result) {
            if (result.data != null) {
                if (page === 1) {
                    $(`#${containerID}`).empty(); // Clear the container if it's the first page
                }

                $.each(result.data, function (i, news) {
                    var imageHTML = news.LocalImagePath ? `<img src="../images/${news.LocalImagePath}" class="card-img-top img-fluid" alt="${news.Title}">` : `</i>`;
                    var newscategory = news.Category ? `<li class="newscategory" id="newscategory">${news.Category}</li>` : '';

                    $(`#${containerID}`).append(
                        `<div class="col-lg-3 col-md-6 col-sm-6">
                            <a href="#" class="DetailNews" data-feed-id="${news.ID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                <div class="card">
                                    
                                    <div class="card-body">
                                     <div class="">
                                        ${imageHTML}
                                    </div>
                                        <div class="row">
                                            <div class="col-md-12 col-12">
                                              
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <p class="card-text" id="newstitle">${news.Description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="row">
                                            <div class="col-md-6 my-auto">
                                                
                                                      <div class="packege-links">
                                                    <ul>

                                                       ${newscategory}
                                                    </ul>
                                                </div>
                                               
                                            </div>
                                            <div class="col-md-6 mt-auto text-end">
                                                <div class="news-agency-name mt-auto">
                                                    <p class="mb-0">${news.feed_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>`
                    );
                });

                // Handle click event for DetailNews
                $('.DetailNews').off('click').on('click', function (e) {
                    
                    $('body').removeClass();
                    e.preventDefault();
                    const feedID = $(this).data('feed-id');
                    $('.loading').removeClass('d-none'); // Show loader when a news item is clicked
                    DetailFeedDataByID(feedID);
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
// Wrapper functions for each news type
function loadAllNews(page) {
    loadNewsData('GetFeedALLData', 'all-tab-container', page);
}

function loadTextNews(page) {
    loadNewsData('GetFeedTEXTData', 'text-tab-container', page);
}

function loadImageNews(page) {
    loadNewsData('GetFeedImageData', 'picture-tab-container', page);
}
// Function to strip HTML tags from a string
function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

function DetailFeedDataByID(ID) {
    $('#tags-input').val('');
    $('#MetaKeyword-input').val('');
    currentFeedID = ID;
    $('.loading').removeClass('d-none'); // Show loader before fetching data

    new APICALL(GetGlobalURL('Base', `DetailFeedDataByID?FeedID=` + ID), 'GET', '', true).FETCH((result, error) => {
        // Always hide loader after data fetching is complete
        $('.loading').addClass('d-none'); // Hide loader after fetching data

        if (result) {
            if (result.data != null && result.data.length > 0) {
                const news = result.data[0];

                // Use stripHtml to clean HTML content
                $('#newstitle h3').text(stripHtml(news.Title) || 'N/A');
                $('#newdescription p').text(stripHtml(news.Description) || 'N/A');
                $('#newcontent p').text(stripHtml(news.Content) || 'N/A');
                $('#PublicationDate').text(new Date(news.PublicationDate || 'N/A').toLocaleDateString());
                $('#modaldate').text("Published Date " + new Date(news.PublicationDate || 'N/A').toLocaleDateString());
                $('#Author').text(news.Author || 'N/A');
                $('#modalsource').text(news.feed_name || 'N/A');
                $('#modalcategory').text(news.Category || 'N/A');

                // Set image path
                var imagePath = news.LocalImagePath ? `../images/${news.LocalImagePath}` : '';
                $('#feedimage img').attr('src', imagePath).attr('alt', news.Title || 'Image');

                // Show the modal
                $('#staticBackdrop').modal('show');
                $("body").removeClass();
                // Fetch and display tags and meta keywords
                FetchAndDisplayTags(currentFeedID);
                FetchAndDisplayMetaKeyword(currentFeedID);
            } else {
                // Handle case where no data is returned
                Swal.fire({
                    icon: 'warning',
                    title: 'No Data Found',
                    text: 'No news details available for this item.',
                    footer: ''
                });
            }
        }

        if (error) {
            // Display error message using SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
                footer: ''
            });
        }
    });
}

function GetFeedBySearchKeyword() {
    $('#tags-input').val('');
    $('#MetaKeyword-input').val('');
    var searchValue = $('#searchInput').val().trim();
    var selectItem = $('.dropdown-item.active').text();
    if (!searchValue || !selectItem) {
        Swal.fire({
            icon: 'warning',
            title: 'Error...',
            text: "Please Fill All Feild",
            footer: ''
        });
        return;
    }
    new APICALL(GetGlobalURL('Base', `GetFeedDataBySearchKeyWord?SearchKeyword=${searchValue}&SelectItem=${selectItem}`), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            $('#all-tab-container').empty();        // Clear existing content
            $('#text-tab-container').empty();       // Clear text tab content
            $('#picture-tab-container').empty();    // Clear picture tab content

            if (result.data != null) {
                $.each(result.data, function (i, news) {
                    var imageHTML = news.LocalImagePath ? `<img src="../images/${news.LocalImagePath}" class="card-img-top img-fluid" alt="${news.Title}">` : '';
                    var newscategory = news.Category ? `<li class="newscategory" id="newscategory">${news.Category}</li>` : '';

                    $('#all-tab-container').append(
                        `<div class="col-lg-3 col-md-6 col-sm-6">
                            <a href="#" class="DetailNews" data-feed-id="${news.ID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                <div class="card">
                                    
                                    <div class="card-body">
                                    <div class="">
                                        ${imageHTML}
                                    </div>
                                        <div class="row">
                                            <div class="col-md-12 col-12">
                                               
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <p class="card-text" id="newstitle">${news.Description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="row">
                                            <div class="col-md-6 my-auto">
                                                 <div class="packege-links">
                                                    <ul>

                                                        ${newscategory}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mt-auto text-end">
                                                <div class="news-agency-name mt-auto">
                                                    <p class="mb-0">${news.feed_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>`
                    );
                    // Categorize based on CategoryTypeID
                    if (news.CategoryTypeID.toString() == '4') {
                        $('#text-tab-container').append(
                            `<div class="col-lg-3 col-md-6 col-sm-6">
                                <a href="#" class="DetailNews" data-feed-id="${news.ID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <div class="card">
                                         
                                        <div class="card-body">
                                         <div class="">
                                        ${imageHTML}
                                    </div>
                                            <div class="row">
                                                <div class="col-md-12 col-12">
                                                    
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <p class="card-text" id="newstitle">${news.Description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <div class="row">
                                                <div class="col-md-6 my-auto">
                                                    <div class="packege-links">
                                                        <ul>

                                                            ${newscategory}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 mt-auto text-end">
                                                    <div class="news-agency-name mt-auto">
                                                        <p class="mb-0">${news.feed_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>`
                        );
                    } else if (news.CategoryTypeID.toString() == '1') {
                        $('#picture-tab-container').append(
                            `<div class="col-lg-3 col-md-6 col-sm-6">
                                <a href="#" class="DetailNews" data-feed-id="${news.ID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <div class="card">
                                       
                                        <div class="card-body">
                                         <div class="">
                                        ${imageHTML}
                                    </div>
                                            <div class="row">
                                                <div class="col-md-12 col-12">
                                                    
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <p class="card-text" id="newstitle">${news.Description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <div class="row">
                                                <div class="col-md-6 my-auto">
                                                     <div class="packege-links">
                                                        <ul> 
                                                            ${newscategory}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 mt-auto text-end">
                                                    <div class="news-agency-name mt-auto">
                                                        <p class="mb-0">${news.feed_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>`
                        );
                    }
                });
                $('.DetailNews').off('click').on('click', function (e) {
                    e.preventDefault();
                    const feedID = $(this).data('feed-id');
                    DetailFeedDataByID(feedID);
                    //ResetModalFields();
                    FetchAndDisplayTags(currentFeedID);
                    FetchAndDisplayMetaKeyword(currentFeedID);
                });
            } else {
                // Handle case where no data is returned
                $('#all-tab-container').empty(); // Clear container if no data found
                $('#text-tab-container').empty(); // Clear text tab content
                $('#picture-tab-container').empty(); // Clear picture tab content
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

function GetFeedCategory() {
    new APICALL(GetGlobalURL('Base', 'GetAllFeedCategory'), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            const categoryCheckboxes = $('#categoryCheckboxes');
            categoryCheckboxes.empty(); // Clear existing content

            // Create checkbox for "Select all"
            const selectAllCheckbox = `
                <div class="form-check my-auto">
                    <input class="form-check-input" type="checkbox" value="all" id="Selectall">
                    <label class="form-check-label" for="Selectall">Select all</label>
                </div>
            `;
            categoryCheckboxes.append(selectAllCheckbox);

            // Iterate through each category and create checkbox
            $.each(result.data, function (i, category) {
                // Create checkbox HTML
                const checkboxHTML = `
                    <div class="form-check my-auto">
                        <input class="form-check-input category-checkbox" type="checkbox" value="${category.Category}" id="chksearchCategory">
                        <label class="form-check-label" for="${category.Category}">${category.Category}</label>
                    </div>
                `;
                // Append checkbox HTML to container
                categoryCheckboxes.append(checkboxHTML);
            });

            // Handle "Select all" checkbox functionality
            $('#Selectall').change(function () {
                const isChecked = $(this).prop('checked');
                $('.category-checkbox').prop('checked', isChecked);
            });
        } else {
            console.error('Error fetching categories:', error);
        }
    });
}

function GetFeedSource() {
    new APICALL(GetGlobalURL('Base', 'GetAllFeedSources'), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            const sourceCheckboxes = $('#SourceCheckboxes');
            sourceCheckboxes.empty(); // Clear existing content
            const selectAllCheckbox = `
                <div class="form-check my-auto">
                    <input class="form-check-input" type="checkbox" value="all" id="Selectallsource">
                    <label class="form-check-label" for="Selectall">Select all</label>
                </div>
            `;
            sourceCheckboxes.append(selectAllCheckbox);

            $.each(result.data, function (i, source) {
                // Create checkbox HTML
                const checkboxHTML = `
                    <div class="form-check my-auto">
                        <input class="form-check-input source-checkbox" type="checkbox" value="${source.feed_name}" id="chksearchSource">
                        <label class="form-check-label" for="${source.feed_name}">${source.feed_name}</label>
                    </div>
                `;
                // Append checkbox HTML to container
                sourceCheckboxes.append(checkboxHTML);
            });

            // Handle "Select all" checkbox functionality for sources
            $('#Selectallsource').change(function () {
                const isChecked = $(this).prop('checked');
                $('.source-checkbox').prop('checked', isChecked);
            });
        } else {
            console.error('Error fetching sources:', error);
        }
    });
}

function GetCheckedCheckboxCategoryNames() {
    var checkedcategoryNames = [];
    $('#categoryCheckboxes input[type="checkbox"]:not(#Selectall)').each(function () {
        if ($(this).is(':checked')) {
            checkedcategoryNames.push($(this).val().trim());
        }
    });

    return checkedcategoryNames;
}

function GetCheckedCheckboxSourceNames() {
    var checkedsourceNames = [];
    $('#SourceCheckboxes input[type="checkbox"]:not(#Selectallsource)').each(function () {
        if ($(this).is(':checked')) {
            checkedsourceNames.push($(this).val().trim());
        }
    });

    return checkedsourceNames;
}

function GetFeedDatabyFilter() {
    $('#tags-input').val('');
    $('#MetaKeyword-input').val('');
    var searchCategory = GetCheckedCheckboxCategoryNames().join(',');  // Join the categories with comma
    var searchsource = GetCheckedCheckboxSourceNames().join(',');      // Join the sources with comma
    var searchstartdate = $('#startdate').val();
    var searcenddate = $('#enddate').val();

    var url = GetGlobalURL('Base', `GetFeedDataByfilter?Category=${encodeURIComponent(searchCategory)}&StartDate=${encodeURIComponent(searchstartdate)}&EndDate=${encodeURIComponent(searcenddate)}&SourceID=${encodeURIComponent(searchsource)}`);

    $('.loading').removeClass('d-none'); // Show loader when search starts

    new APICALL(url, 'GET', '', true).FETCH((result, error) => {
        if (result) {
            $('#all-tab-container').empty();        // Clear existing content
            $('#text-tab-container').empty();       // Clear text tab content
            $('#picture-tab-container').empty();    // Clear picture tab content

            if (result.data != null) {
                $.each(result.data, function (i, news) {
                    var imageHTML = news.LocalImagePath ? `<img src="../images/${news.LocalImagePath}" class="card-img-top img-fluid" alt="${news.Title}">` : '';
                    var newscategory = news.Category ? `<li class="newscategory" id="newscategory">${news.Category}</li>` : '';

                    $('#all-tab-container').append(
                        `<div class="col-lg-3 col-md-6 col-sm-6">
                            <a href="#" class="DetailNews" data-feed-id="${news.ID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                <div class="card">
                                  
                                    <div class="card-body">
                                     <div class="">
                                        ${imageHTML}
                                    </div>
                                        <div class="row">
                                            <div class="col-md-12 col-12">
                                                
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-12">
                                                <p class="card-text" id="newstitle">${news.Description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer">
                                        <div class="row">
                                            <div class="col-md-6 my-auto">
                                                <div class="packege-links">
                                                    <ul> 
                                                        ${newscategory}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mt-auto text-end">
                                                <div class="news-agency-name mt-auto">
                                                    <p class="mb-0">${news.feed_name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>`
                    );

                    // Categorize based on CategoryTypeID
                    if (news.CategoryTypeID.toString() == '4') {
                        $('#text-tab-container').append(
                            `<div class="col-lg-3 col-md-6 col-sm-6">
                                <a href="#" class="DetailNews" data-feed-id="${news.ID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <div class="card">
                                        
                                        <div class="card-body">
                                         <div class="">
                                        ${imageHTML}
                                    </div>
                                            <div class="row">
                                                <div class="col-md-12 col-12">
                                                    
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <p class="card-text" id="newstitle">${news.Description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <div class="row">
                                                <div class="col-md-6 my-auto">
                                                   <div class="packege-links">
                                                        <ul>

                                                            ${newscategory}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 mt-auto text-end">
                                                    <div class="news-agency-name mt-auto">
                                                        <p class="mb-0">${news.feed_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>`
                        );
                    } else if (news.CategoryTypeID.toString() == '1') {
                        $('#picture-tab-container').append(
                            `<div class="col-lg-3 col-md-6 col-sm-6">
                                <a href="#" class="DetailNews" data-feed-id="${news.ID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <div class="card">
                                       
                                        <div class="card-body">
                                         <div class="">
                                        ${imageHTML}
                                    </div>
                                            <div class="row">
                                                <div class="col-md-12 col-12">
                                                    
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <p class="card-text" id="newstitle">${news.Description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer">
                                            <div class="row">
                                                <div class="col-md-6 my-auto">
                                                   <div class="packege-links">
                                                        <ul>
                                                              
                                                            ${newscategory}
                                                        </ul>
                                                    </div>
                                                </div>
                                                <div class="col-md-6 mt-auto text-end">
                                                    <div class="news-agency-name mt-auto">
                                                        <p class="mb-0">${news.feed_name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>`
                        );
                    }
                });

                $('.DetailNews').off('click').on('click', function (e) {
                    e.preventDefault();
                    const feedID = $(this).data('feed-id');
                    DetailFeedDataByID(feedID);
                    FetchAndDisplayTags(currentFeedID);
                    FetchAndDisplayMetaKeyword(currentFeedID);
                });
            } else {
                // Handle case where no data is returned
                $('#all-tab-container').empty(); // Clear container if no data found
                $('#text-tab-container').empty(); // Clear text tab content
                $('#picture-tab-container').empty(); // Clear picture tab content
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

        $('.loading').addClass('d-none'); // Hide loader after search completes
    });
}


function GetCollectionName() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            var userID = $('#UserID').val();
            new APICALL(GetGlobalURL('Base', 'GetCollectionNameforFeed'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    if (result.data != null) {
                        $('#displaycollection').empty(); // Clear the existing list items
                        $('#displaycollection').append('<li><a class="dropdown-item" href="../Feed/ManageCollection">View all collections</a></li>');
                        $.each(result.data, function (i, option) {
                            $('#displaycollection').append(
                                `<li class="d-flex align-items-center">
                                    <a class="dropdown-item me-2 collection-item" href="#" data-collection-id="${option.Collection_id}">
                                        ${option.Collection_name}
                                    </a>
                                    <span class="fa fa-times text-danger DeleteCollection" 
                                        data-value="${option.Collection_id}" 
                                        data-userid="${option.UserID}" 
                                        role="button">
                                    </span>
                                </li>`
                            );
                        });

                        
                        $('#displaycollection').append(
                            `<li>
                                <a class="dropdown-item text-primary" href="#" id="showcollectiosavemodal">
                                    <i class="fas fa-plus"></i> &nbsp; New collection
                                </a>
                            </li>`
                        );

                        $('#showcollectiosavemodal').click(function () {
                            $('#smodalon').modal('show');
                            $('body').removeClass();
                        })

                        // Attach click event to collection items
                        $('.collection-item').click(function () {
                            var collectionID = $(this).data('collection-id');
                            SaveFeedToCollection(currentFeedID, collectionID);
                        });

                        $('.DeleteCollection').on('click', function () {
                            var CollectionID = this.attributes["data-value"].value;
                            var UserID = this.attributes["data-userid"].value;
                            DeleteCollectionName(CollectionID, UserID);
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
    });
}

function SaveCollectionName() {
    var collectionname = $('#Collection_name').val();
    var Model = JSON.stringify({
        Collection_name: collectionname,
    });

    Swal.fire({
        title: 'Do you want to save?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveCollectionName'), 'POST', Model, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Collection Saved Successfully!',
                        footer: ''
                    }).then(() => {
                        // Hide the modal after success message
                        $('#smodalon').modal('hide');
                        
                    });;;

                    GetCollectionName();
                    ClearcollecitonData();
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

function ClearcollecitonData() {
    $('#Collection_name').val('');
}

function SaveFeedToCollection(feedID, collectionID) {
    var data = {
        FeedID: feedID,
        CollectionID: collectionID,
    };

    new APICALL(GetGlobalURL('Base', 'Added_Feed_To_Collection'), 'POST', JSON.stringify(data), true).FETCH((result, error) => {
        if (result) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Feed added to collection successfully.',
                footer: ''
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


function DeleteCollectionName(CollectionID, UserID) {

    var DeleteData = JSON.stringify({
        CollectionID: CollectionID,
        UserID: UserID
    });

    Swal.fire({
        title: 'Do you want to delete this collection?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'DeleteCollectionName'), 'POST', DeleteData, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Collection deleted successfully',
                        footer: ''
                    });
                    GetCollectionName();
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
