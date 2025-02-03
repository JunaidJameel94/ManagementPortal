var imagenewspath;
var selectedTemplateID;
var chartData;
var imagepath;
let selectedContainerId = null; // Global variable to track selected container
var selectedImageBoxId = null;
var selectedDataValue = null;
var globalcollectionID = null;
var charts = {};
var newsID = $('#newsId').val();
$(document).ready(function () {
    GetCollectionName();
    DisplayTemplateDesign();

    SelectedPictuesBox();
    //GetNewsByID();
    $('#Content').summernote({
        height: 150
    });

    $('#btnselectchooseimage').on('click', function () {
        SaveResulationImage();
    });

    $('#btnupdatenews').click(function () {
        UpdateNews();
    })

    $('#newProfilePhoto').change(function () {
        SaveNewsImage();
    });
})

function SaveNewsImage() {
    var formData = new FormData();
    var files = $('#newProfilePhoto')[0].files;
    formData.append('file', files[0]);
    new APICALL(GetGlobalURL('FileUpload', 'UploadNewsimage'), 'POST', formData, true, true).FETCH((result, error) => {
        if (result) {

            imagenewspath = result.data;
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Image Upload Successfully!',
                footer: ''
            });
        }
    });
}

function stripHtmlTags(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

function decodeHtmlEntities(encodedString) {
    var textArea = document.createElement('textarea');
    textArea.innerHTML = encodedString;
    return textArea.value;
}

function stripHtmlTags(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}

function GetCollectionName() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            var userID = $('#UserID').val();
            new APICALL(GetGlobalURL('Base', 'GetCollectionNameforMGNewsEdit'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    if (result.data != null) {
                        // Clear existing rows in the accordion
                        $('#accordionPanelsStayOpenExample').empty();

                        // Iterate over each collection and append a new accordion item
                        $.each(result.data, function (i, collection) {
                            var item = `
                                <div class="accordion-item">
                                    <h4 class="accordion-header" id="heading${i}">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-collection-id=${collection.Collection_id} data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                                            ${collection.Collection_name} 
                                        </button>
                                    </h4>
                                    <div id="collapse${i}" class="accordion-collapse collapse" aria-labelledby="heading${i}" data-bs-parent="#accordionPanelsStayOpenExample">
                                        <div class="accordion-body" id="collection-body-${i}">
                                            Loading collection data...
                                        </div>
                                    </div>
                                </div>
                            `;
                            $('#accordionPanelsStayOpenExample').append(item);
                            $(document).on('click', '.accordion-button', function () {
                                // Get the value of the data-collection-id attribute from the clicked button
                                globalcollectionID = $(this).data('collection-id');
                                fetchCollectionData(globalcollectionID, `#collection-body-${i}`);

                                // You can now use globalcollectionID for further processing
                            });
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

function fetchCollectionData(collectionId, containerId) {
    new APICALL(GetGlobalURL('Base', `Get_Feed_By_CollectionForMGNewsEdit?CollectionID=${collectionId}`), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                $(containerId).empty(); // Clear existing content

                // Append the fetched collection data
                $.each(result.data, function (i, news) {
                    var imageHTML = news.LocalImagePath ? `<img src="../images/${news.LocalImagePath}" class="card-img-top img-fluid" alt="${news.Title}">` : '<p>No image available</p>';
                    $(containerId).append(
                        `<div class="news-item">
                            <div class="heading-style">${stripHtmlTags(news.Title)}</div>
                            <div class="collectiondescription">${stripHtmlTags(news.Description)} 
                                <a href="#" class="btnopennewscontent" data-content="${news.Content}">Content</a>
                                <a href="#" class="btnopennewsimage" data-image="${news.LocalImagePath}">Image</a>
                            </div>
                        </div>`
                    );
                });

                // Attach event listener for the content link
                $(document).on('click', '.btnopennewscontent', function (e) {
                    e.preventDefault();

                    // Get the content from the data attribute
                    const content = $(this).data('content');

                    // Set the content in the modal
                    $('#modalContent').html(content);

                    // Show the modal
                    $('#DisplayNewsContent').modal('show');
                });

                $(document).on('click', '.btnopennewsimage', function (e) {
                    e.preventDefault();

                    // Get the image path from the data attribute
                  imagePath = $(this).data('image');

                    // Set the image in the modal
                    const imageHTML = imagePath ? `<img src="../images/${imagePath}" class="img-fluid mb-2" alt="News Image">` : '<p>No image available</p>';
                    $('#modalImage').html(imageHTML);

                    // Show the modal
                    $('#DisplayImageCollection').modal('show');
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

function OpenNewsContentModal(collectionId) {
    // Show a loading spinner or placeholder while content is being fetched
    $('#modalContent').html('<p>Loading content...</p>');

    // Make the API call to fetch content
    new APICALL(GetGlobalURL('Base', `Get_Feed_By_CollectionForNewsEdit?CollectionID=${collectionId}`), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null && result.data.length > 0) {
                // Assuming the content you want to show is inside the first item of the result
                let newsContent = result.data[0].Content || 'No content available';


                // Set the fetched content in the modal
                $('#modalContent').html(newsContent);

                // Open the modal
                $('#DisplayNewsContent').modal('show');
            } else {
                // Handle case when no content is returned
                $('#modalContent').html('<p>No content found.</p>');
            }
        } else if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
                footer: ''
            });
            $('#modalContent').html('<p>Error loading content.</p>');
        }
    });
}

function SelectedPictuesBox() {
    $(document).on('click', '[id^="item-"]', function () {
        // Remove highlighted border from all containers
        $('[id^="item-"]').removeClass('highlighted-border');

        $(this).addClass('highlighted-border');

        // Store the ID of the selected image box
        selectedImageBoxId = $(this).attr('id'); // Get the unique ID of the selected image box

        // Store the value of the selected data attribute (e.g., data-value attribute)
        selectedDataValue = $(this).data('value'); // Change 'value' to your actual data attribute name
    });
}

function OpenCollectionImage(collectionId) {
    $('#modalImage').html('<p>Loading content...</p>');

    new APICALL(GetGlobalURL('Base', `Get_Feed_By_CollectionForNewsEdit?CollectionID=${collectionId}`), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null && result.data.length > 0) {
                $('#modalImage').empty();

                result.data.forEach(news => {
                    let imageHTML = news.LocalImagePath ?
                        `<img src="../images/${news.LocalImagePath}" class="img-fluid mb-2" alt="${news.Title}">` :
                        '<p>No image available</p>';

                    $('#modalImage').append(imageHTML);
                });

                $('#DisplayImageCollection').modal('show');
            } else {
                $('#modalImage').html('<p>No images found.</p>');
            }
        } else if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
                footer: ''
            });
            $('#modalImage').html('<p>Error loading content.</p>');
        }
    });
}

function SaveResulationImage() {
    // Get the selected resolution
    let selectedResolution = document.querySelector('input[name="resolution"]:checked').value;

    // Get the selected image from the modal
    let selectedImage = document.querySelector('#modalImage img');

    if (selectedImage) {
        // Use the currentSrc property to get the image URL
        let imageSrc = selectedImage.currentSrc;
        let imageAlt = selectedImage.alt || 'default-image-name'; // Use alt attribute as a fallback for name

        // Extract the original image file name and extension
        let urlParts = imageSrc.split('/');
        let fileNameWithExtension = urlParts[urlParts.length - 1];
        let fileName = fileNameWithExtension.split('.')[0]; // Base name without extension
        let fileExtension = fileNameWithExtension.split('.').pop(); // File extension

        // Check and remove any existing resolution in the file name
        let resolutionPattern = /\d+x\d+/; // Pattern to detect resolutions like 800x600
        if (resolutionPattern.test(fileName)) {
            fileName = fileName.replace(resolutionPattern, '').trim(); // Remove existing resolution
        }

        // Format the new image name (appending resolution only once)
        newFileName = `${fileName}_${selectedResolution}.${fileExtension}`;

        // Convert the image to a base64 string
        let canvas = document.createElement('canvas');
        let dimensions = selectedResolution.split('x');
        canvas.width = dimensions[0];
        canvas.height = dimensions[1];
        let ctx = canvas.getContext('2d');

        // Create an image object to load the currentSrc image
        let img = new Image();
        img.crossOrigin = "Anonymous"; // To handle cross-origin images
        img.onload = function () {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let imageData = canvas.toDataURL('image/png');

            // Prepare the data to be sent to the API
            let data = {
                image: imageData,
                resolution: selectedResolution,
                imageName: newFileName
            };

            // Convert data to JSON format
            let formData = JSON.stringify(data);

            // Use the new APICALL method to make the API call
            new APICALL(GetGlobalURL('Base', 'SaveImageForResulationForMGNewsEdit'), 'POST', formData, true).FETCH((result, error) => {
                if (result) {
                    // Once the image is saved, call SaveRisizeNewsImage
                    SaveRisizeNewsImage();

                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Image Uploaded Successfully!',
                        footer: ''
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: 'Failed to upload image.',
                    });
                }
            });
        };
        img.src = imageSrc; // Set the src to start loading the image
    } else {
        alert('No image selected.');
    }
}

function SaveRisizeNewsImage() {
    var imageSizeName = newFileName;
    var divID = selectedImageBoxId;
    var TypeID = selectedDataValue;
    var UserID = $('#UserID').val();
    var CollectionID = globalcollectionID;
    var imagePath = `../UserSaveImage/${imageSizeName}`;

    var data = {
        RisizeImagePath: imagePath,
        DivID: divID,
        TypeID: TypeID,
        UserID: UserID,
        CollectionID: CollectionID
    };

    var formData = JSON.stringify(data);

    // API call to save resized image
    new APICALL(GetGlobalURL('Base', 'Save_News_ImageRisizeForMGNewsEdit'), 'POST', formData, true).FETCH((result, error) => {
        if (result) {
            getimagerisizenews();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: 'Failed to save resized image.',
            });
        }
    });
}

function getimagerisizenews() {
    var targetDivID = $(`div[data-value="2"]`).attr('id');
    // Make GET request to fetch resized image data
    new APICALL(GetGlobalURL('Base', 'GetRisizeNewsImageForMGNewsEdit?DivID=' + targetDivID), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                const news = result.data[0];
                imagepath = news.RisizeImagePath ? news.RisizeImagePath : ''; // Make sure path is correct
                var title = news.title || 'image'; // Use the title as alt text
                var divID = news.DivID; // Fetch the DivID (e.g., 'item-1728276691522')
                var dataValue = news.TypeID; // Fetch the TypeID (e.g., '2')

                // Check if the div with the dynamic ID and matching data-value exists
                var targetDiv = $(`div#${divID}[data-value="${dataValue}"]`);
                if (targetDiv.length > 0) {
                    // Clear the existing content inside the div (remove text box, if any)
                    targetDiv.empty();

                    // Append only the image to the div
                    targetDiv.append('<img>'); // Dynamically add an <img> tag inside the div
                    targetDiv.find('img')
                        .attr('src', imagepath) // Set the image source to the fetched path
                        .attr('alt', title)     // Set the alt text to the fetched title
                        .css({
                            'max-width': '100%',        // Ensure image fits within the container width
                            'max-height': '100%',       // Ensure image fits within the container height
                            'object-fit': 'contain',    // Scale the image and maintain aspect ratio
                            'width': 'auto',            // Let width scale automatically
                            'height': 'auto'            // Let height scale automatically
                        });
                }
            }
        }
    });
}


function GetNewsByID(newsID) {
    new APICALL(GetGlobalURL('Base', 'GetNewsByIDForMGNewsEdit?NewsID=' + newsID), 'GET', '', true).FETCH((result, error) => {
        if (error || !(result && result.data && result.data.length > 0)) {
            console.error('Error fetching data or no data available:', error);
            return;
        }

        // Process news content
        result.data.forEach(detail => {
            let decodedContent = $('<div>').html(detail.NewsContent).text();

            let cleanedContent = decodedContent
                .replace(/\\&quot;/g, '"')  // Replace encoded quotes
                .replace(/\\n/g, '')       // Remove new lines
                .replace(/\\/g, '')        // Remove extra slashes
                .trim();                   // Trim any extra spaces

            // Remove leading/trailing quotes
            cleanedContent = cleanedContent.replace(/^"|"$/g, '');

            const divID = detail.DivID;
            const contentElement = $("#" + divID);

            try {
                const chartData = JSON.parse(cleanedContent);

            } catch (e) {
                // Check if it's an image or text content
                if (cleanedContent.match(/\.(jpg|png|jpeg|gif)$/i)) {
                    // Handle image content

                    imageUrl = cleanedContent;
                    imagepath = imageUrl ? imageUrl : ''; 
                    const imgElem = $('<img>').attr('src', cleanedContent).css({
                        'max-width': '100%',
                        'height': 'auto'
                    });
                    contentElement.html(imgElem);
                } else {
                    // Handle text or HTML content
                    contentElement.html('<div contenteditable="true" class="editable-content">' + cleanedContent + '</div>');
                }
            }
        });
        
    });
}

function UpdateNews() {
    // Fetch the input values
    var UserID = $('#UserID').val();
    var Langauges = $('#Language').val() ? $('#Language').val(): '' ;
    var Shortcontent = $('#Shortcontent').val() ? $('#Shortcontent').val() : '' || '';
    var Metadescription = $('#Metadescription').val() ? $('#Metadescription').val():'';
    var Metakeyword = $('#MetaKeyword-input').val() ? $('#MetaKeyword-input').val():'';
    var Features = $('#Features').prop('checked') ? '1' : '0';
    var Popular = $('#Popular').prop('checked') ? '1' : '0';
    var Allowcomment = $('#Allowcomment').prop('checked') ? '1' : '0';
    var Thumbnail = imagepath; // Assuming this is set elsewhere in your code
    var CategoryID = $('.category-checkbox:checked').map(function () { return this.value; }).get().join(',');
    var TagName = $('#TagName').val() ? $('#TagName').val():'';
    var IsActive = '1';
    var guid = $('#guid').val() || '';
    var to_ping = $('#to_ping').val() || '';
    var pinged = $('#pinged').val() || '';
    var ping_status = $('#ping_status').val() || '';
    var Islive = $('#Islive').prop('checked') ? '1' : '0';


    // Prepare the news update payload
    var newsUpdatePayload = JSON.stringify({
        NewsID: newsID, // Ensure this variable is defined globally or passed to the function
        UserID: UserID,
        Langauge: Langauges,
        Shortcontent: Shortcontent,
        Metadescription: Metadescription,
        Metakeyword: Metakeyword,
        Features: Features,
        Popular: Popular,
        Thumbnail: imagepath,
        CategoryID: CategoryID,
        TagName: TagName,
        Allowcomment: Allowcomment,
        IsActive: IsActive,
        guid: guid,
        to_ping: to_ping,
        pinged: pinged,
        Createdby: UserID,
        Author: UserID,
        ping_status: ping_status,
        Islive: Islive
    });

    // Prepare for updating news content
    var contents = [];

    // Iterate through dynamic content divs and gather content for update
    $('[id^="item-"]').each(function () {
        var divID = $(this).attr('id'); // Capture the correct DivID here
        var dataValue = $(this).data('value'); // Capture the TypeID (data-value)

        var contentValue = ''; // Default empty content

        // Handle text or HTML content inside div
        if ($(this).find('.editable-content').length > 0) {
            contentValue = $(this).find('.editable-content').html();
        }
        // Handle image inside div
        else if ($(this).find('img').length > 0) {
            var imgElement = $(this).find('img');
            var src = imgElement.attr('src');


            //var style = imgElement.attr('style') || ''; // Default to empty style if not found

            contentValue = src
        }
 
        // Push the content and DivID to the array
        contents.push({
            NewsID: newsID, // Pass the ContentID for the update
            DivID: divID,
            TypeID: dataValue,
            NewsContent: contentValue
        });
    });

    // Show confirmation before saving
    Swal.fire({
        title: 'Do you want to save the news?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            // API call to update news details
            new APICALL(GetGlobalURL('Base', 'MGUpdate_News'), 'POST', newsUpdatePayload, true)
                .FETCH((response, error) => {
                    if (response && response.data) {
                        // If the news update is successful, update the content
                        var contentData = JSON.stringify(contents);
                        new APICALL(GetGlobalURL('Base', 'MGUpdate_News_Content'), 'POST', contentData, true)
                            .FETCH((res, err) => {
                                if (res && res.data) {
                                    // Refresh the news list or details after successful content update
                                    GetNewsByID();
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Success...',
                                        text: 'News updated successfully!',
                                    });
                                } else if (err) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error...',
                                        text: err.data.responseText,
                                    });
                                }
                            });
                    } else if (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error...',
                            text: error.data.responseText,
                        });
                    }
                });
        }
    });
}

function DisplayTemplateDesign() {
    new APICALL(GetGlobalURL('Base', 'GetTemplateDesignInEditforMGNewsEdit?NewsID=' + newsID), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null && result.data.length > 0) {
                $('#showtemplate').empty();  // Clear existing content in the div

                var container = $('<div>').addClass('sortable-container');
                var rows = {};

                // Group template data by Row_ID
                $.each(result.data, function (i, templatedata) {
                    var rowID = templatedata.Row_ID;
                    if (!rows[rowID]) {
                        rows[rowID] = [];
                    }
                    rows[rowID].push(templatedata);
                });

                // Loop through rows and populate the container
                $.each(rows, function (rowID, items) {
                    var row_elem = $('<div>').addClass('row').attr('id', 'row_' + rowID);

                    $.each(items, function (i, item) {
                        var column_elem = $('<div>')
                            .addClass(item.Class_ATTR) // Set class for the column
                            .attr('id', item.id)
                            .attr('data-value', item.typeid)
                            .css({
                                'height': item.Height + 'px',
                                'width': item.Width + 'px',
                                'overflow': 'hidden',
                                'border': 'none' // Remove any borders
                            });

                        // Process NewsContent
                        if (item.NewsContent) {
                            var content_elem = $('<div>').addClass('news-content');
                            var decodedContent = $.parseHTML(item.NewsContent);
                            content_elem.append(decodedContent);
                            column_elem.append(content_elem);
                        }

                        // Explicitly remove border classes if they exist
                        column_elem.removeClass('border border-secondary');

                        row_elem.append(column_elem);

                        // Apply dynamic CSS (if any) once per template, not per item
                        if (item.Inline_Style && i === 0) {
                            const cssFilePath = '../' + item.Inline_Style; // Adjust path as needed
                            applyDynamicCSS(cssFilePath);
                        }

                        // Add highlight functionality
                        column_elem.on('click', function () {
                            // Remove highlight from all elements
                            $('[id^="item-"]').removeClass('highlighted-border');
                            // Add highlight to the clicked element
                            $(this).addClass('highlighted-border');

                            const canvas = $(this).find('canvas');
                            const chartNameValue = canvas.attr('chart-name-value');
                            const chartDataValue = canvas.attr('chart-data-value');
                            const chartSeriesValue = canvas.attr('chart-series-value');
                            var chartname = canvas.attr('chart-name');

                            // Ensure default values are provided for form fields
                            $('#chartType').val(chartNameValue || '');
                            $('#userchartname').val(chartname || '');
                            $('#userValues').val((chartDataValue ? JSON.parse(chartDataValue).join(', ') : ''));
                            $('#userSeriesValue').val((chartSeriesValue ? JSON.parse(chartSeriesValue).map(s => s.replace(/&quot;/g, '')).join(', ') : ''));

                            selectedContainerId = item.id; // Store the selected container ID
                        });
                    });

                    container.append(row_elem);
                });

                $('#showtemplate').append(container);
            } else {
                $('#showtemplate').html('<p>No template data available.</p>');
            }

            GetNewsByID(newsID); // Fetch news data after template display
        } else if (error) {
            console.error('API call error:', error);
            $('#showtemplate').html('<p>Error retrieving template data. Please try again later.</p>');
        }
    });
}

function applyDynamicCSS(cssPath) {
    if (!document.querySelector(`link[href="${cssPath}"]`)) {  // Prevent duplicate CSS loading
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = cssPath; // Set the path to the generated CSS file
        document.head.appendChild(link);
    }
}


async function downloadAndDisplayImage(imageUrl, articleTitle) {
    try {

        let response = await fetch('/api/Image/save-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Url: imageUrl })
        });

        if (response.ok) {
            let result = await response.json();
            let localImagePath = result.FilePath;

            // Return the local image path to display it in the content using Bootstrap class
            return `<img src="${localImagePath}" alt="${articleTitle}" class="img-fluid  newsAIimage"><hr/>`;
        } else {
            console.error('Failed to download image:', response.statusText);
            return `<p>Image could not be loaded for ${articleTitle}</p>`;
        }
    } catch (error) {
        console.error('Error while downloading image:', error);
        return `<p>Image could not be loaded for ${articleTitle}</p>`;
    }
}

async function GenerateNewsAI() {
    var keyword = $('#NewsKeyword').val();
    var numberOfArticles = 6;

    new APICALL(GetGlobalURL('Base', 'GetAIGeneratedNews?keyword=' + keyword + "&numberOfArticles=" + numberOfArticles), 'GET', '', true).FETCH(async (result, error) => {
        if (result) {
            try {
                var parsedResult = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;

                if (parsedResult.status !== "ok") {
                    throw new Error("API response status is not successful");
                }

                if (Array.isArray(parsedResult.articles)) {
                    var articles = parsedResult.articles;
                    var newsContent = "";

                    for (var i = 0; i < articles.length; i++) {
                        var article = articles[i];
                        newsContent += `<h3>${article.title}</h3>`;
                        newsContent += `<p>${article.description}</p>`;
                        newsContent += `<a href="${article.url}" target="_blank">Read more</a><br/>`;

                        // Call the downloadAndDisplayImage function and wait for the image to be processed
                        var imageContent = await downloadAndDisplayImage(article.urlToImage, article.title);
                        newsContent += imageContent;
                    }

                    // Finally, update Summernote content
                    $('#Content').summernote('code', newsContent);
                } else {
                    throw new Error("Articles data is not in expected format");
                }
            } catch (e) {
                alert('Error parsing news data: ' + e.message);
                console.error('Error parsing news data:', e);
            }
        } else {
            alert('Error fetching news: ' + JSON.stringify(error));
            console.error('Error fetching news:', error);
        }
    });
}