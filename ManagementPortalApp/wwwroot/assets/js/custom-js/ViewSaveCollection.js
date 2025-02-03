$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const collectionId = urlParams.get('collectionId');

    if (collectionId) {
        fetchCollectionData(collectionId);
    } else {
        console.log('No collectionId parameter found in the URL.');
    }
});

function fetchCollectionData(collectionId) {
    new APICALL(GetGlobalURL('Base', `Get_Feed_By_CollectionForViewSaveCollection?CollectionID=${collectionId}`), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                $.each(result.data, function (i, news) {
                    var imageHTML = news.LocalImagePath ? `<img src="../images/${news.LocalImagePath}" class="card-img-top img-fluid" alt="${news.Title}">` : `</i>`;
                    var newscategory = news.Category ? `<li class="newscategory" id="newscategory">${news.Category}</li>` : '';
                    $('#CollectionName span').text(news.Collection_name);

                    $('#all-tab-container').append(
                        `<div class="col-lg-3 col-sm-6 news-item" data-feed-id="${news.FeedID}">
                            <a href="#" class="DetailNews" data-value="${news.FeedID}" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                <div class="card">
                                    <div class="card-header">
                                        ${new Date(news.AddedDate).toLocaleDateString()}
                                    </div>
                                    <div class="card-header p-0">
                                         ${imageHTML}
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-12 col-12">
                                                <div class="packege-links">
                                                    <ul>
                                                        <li class="active"> Package </li>
                                                       ${newscategory}
                                                    </ul>
                                                </div>
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

                // Bind the click event after appending the news items
                $('.DetailNews').off('click').on('click', function (e) {
                    $('body').removeClass();
                    e.preventDefault();
                    const feedID = $(this).data('value');
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

function DetailFeedDataByID(ID) {
    new APICALL(GetGlobalURL('Base', `Get_Collection_Single_Feed?FeedID=` + ID), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                const news = result.data[0];
                $('#newstitle h3').text(news.Title || 'N/A');
                $('#newdescription p').text(news.Description || 'N/A');
                $('#newcontent p').text(news.Content || 'N/A');
                $('#PublicationDate').text(news.PublicationDate || 'N/A');
                $('#modaldate').text(news.PublicationDate || 'N/A');
                $('#Author').text(news.Author || 'N/A');
                $('#modalsource').text(news.feed_name || 'N/A');
                $('#modalcategory').text(news.Category || 'N/A');
                var imagePath = news.LocalImagePath ? `../images/${news.LocalImagePath}` : '';
                $('#feedimage img').attr('src', imagePath).attr('alt', news.Title || 'Image');
                $('#staticBackdrop').modal('show');
                
                $('#btnremovecollection').off('click').on('click', function (e) {
                    e.preventDefault();
                    var collectionid = news.CollectionFeedID;
                    RemoveAddedCollection(collectionid, ID);
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

function RemoveAddedCollection(collectionid, ID) {
    var DeleteData = JSON.stringify({
        FeedID: ID,
        CollectionFeedID: collectionid
    });

    Swal.fire({
        title: 'Do you want to delete this collection?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'DeleteSaveCollectionFeed'), 'POST', DeleteData, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Collection removed successfully',
                        footer: ''
                    });

                    // Remove the corresponding HTML element
                    $(`.news-item[data-feed-id="${ID}"]`).remove();
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
