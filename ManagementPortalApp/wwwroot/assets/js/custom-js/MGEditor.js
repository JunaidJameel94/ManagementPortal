var newsID;
var GlobalTemplateID;
$(document).ready(function () {
    GetNewsDetail();

    $('#btnnewssearch').click(function () {
        SearchNewsDetail();

    });
});


function GetNewsDetail() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'Get_News_DetailForMGEditor'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    if (result.data != null) {
                        $('#newsContainer').empty(); // Clear any existing content

                        $.each(result.data, function (i, detail) {

                            var Edit = (data_[0].AllowUpdate == true)
                                ? '<button class="btn btn-primary btn-sm edit-btn w-100" data-id="' + detail.newsID + ' "data-template-id="' + detail.templateid+'" ><i class="fa fa-edit"></i> Edit</button>'
                                : '';

                            var SendApproval = (data_[0].AllowUpdate == true)
                                ? '<button class="btn btn-success btn-sm sendapproval-btn w-100" data-id="' + detail.newsID + '"><i class="fas fa-check-circle"></i> Send Publisher</button>'
                                : '';

                            var SendCreater = (data_[0].AllowUpdate == true)
                                ? '<button class="btn btn-warning btn-sm sendcreater-btn w-100" data-id="' + detail.newsID + '"><i class="fas fa-check-circle"></i> Send Creator</button>'
                                : '';

                            var remarkscreator = detail.CreatorRemarks ? `<p>${detail.CreatorRemarks}</p>` : 'No Remarks Provided By News Creator';
                            var remarkspublisher = detail.PublisherRemarks ? `<p> ${detail.PublisherRemarks}</p>` : 'No Remarks Provided By News Publisher';

                            if (detail.NewsStatus == 1 && detail.isDeleted == 0) {
                                var newsItem = `
                              
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-md-2 col-12 text-center">
                                                <div class="newsimg-div">
                                                    <img src="${detail.Newsimage}" class="img-fluid rounded-lg shadow-sm" alt="News Image">
                                                </div>
                                            </div>
                                            <div class="col-md-6 col-12">
                                                <div class="news-maintitle">
                                                    <h5 class="font-weight-bold text-dark">${detail.title}</h5>
                                                </div>
                                                <div class="news-description">
                                                    <p class="text-muted small">${detail.newsdescription}</p>
                                                </div>
                                            </div>
                                            <div class="col-md-2 col-12 text-center">
                                                <div class="action-btns">
                                                    <div class="row">
                                                        <div class="col-md-12 mb-2">
                                                            ${Edit}
                                                        </div>
                                                        <div class="col-md-12 mt-2">
                                                            ${SendApproval}
                                                        </div>
                                                        <div class="col-md-12 mt-2">
                                                        </div>
                                                        <div class="col-md-12 mt-2">
                                                            ${SendCreater}
                                                        </div>
                                                        <div class="col-md-12 mt-2">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr class="my-4">
                                        <div class="row">
                                            <div class="col-md-6 mt-2">
                                                <div class="remarks-container">
                                                    <h6 class="text-muted font-weight-bold">Publisher's Remarks</h6>
                                                    ${remarkspublisher}
                                                </div>
                                            </div>
                                            <div class="col-md-6 mt-2">
                                                <div class="remarks-container">
                                                    <h6 class="text-muted font-weight-bold">Creator's Remarks</h6>
                                                    ${remarkscreator}
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;


                                $('#newsContainer').append(newsItem); // Append only if not deleted
                            }
                        });

                        // Attach event handlers to the buttons
                        $('.edit-btn').click(function () {
                            newsID = $(this).data('id');
                            GlobalTemplateID = $(this).data('template-id');
                            if (GlobalTemplateID === 1) {

                                window.location.href = `../Feed/SingleNewsEdit?newsID=${newsID}`;
                            }
                            else {
                                window.location.href = `../Feed/MultipleNewsEdit?newsID=${newsID}`;
                            }
                        });


                        $('.sendapproval-btn').click(function () {
                            newsID = $(this).data('id');
                            EditorSendToPublisher(newsID);
                        });

                        $('.sendcreater-btn').click(function () {
                            var newsID = $(this).data('id');
                            $('#remarks-section').removeClass('d-none'); // Show the remarks section
                            EditorSendToCreater(newsID);
                        });
                    }
                }
            });
        }
    });

}

function EditorSendToPublisher(newsID) {
    var UpdateStatus = JSON.stringify({
        NewsID: newsID
    });
    new APICALL(GetGlobalURL('Base', 'EditorSendToPublisher'), 'POST', UpdateStatus, true).FETCH((result, error) => {
        if (result) {
            GetNewsDetail();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'News Successfully Sent To Publisher!',
            });
            $('#remarksModal').modal('hide'); 
        }
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
            });
        }
    });
}



function EditorSendToCreater(newsID) {
    $('#submit-remarks').data('news-id', newsID);
    $('#editor-remarks').val(''); 
    $('#remarksModal').modal('show'); 
    $('body').removeClass();
    $('#submit-remarks').off('click').on('click', function () {
        var editorRemarks = $('#editor-remarks').val(); 
        var UpdateStatus = JSON.stringify({
            NewsID: newsID,
            EditorRemarks: editorRemarks
        });
        new APICALL(GetGlobalURL('Base', 'EditorSendToCreater'), 'POST', UpdateStatus, true).FETCH((result, error) => {
            if (result) {
                GetNewsDetail();
                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'News successfully sent to the creator!',
                });
                $('#remarksModal').modal('hide'); 
            }
            if (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: error.data.responseText,
                });
            }
        });
    });
}


function SearchNewsDetail() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            var newsSearch = $('#searchnewsDetail').val();
            new APICALL(GetGlobalURL('Base', `GetNewsDetailBySearchforMGEditor?SearchKeyword=${encodeURIComponent(newsSearch)}`), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    var newsContainer = $('#newsContainer');
                    newsContainer.empty();

                    if (result.data != null) {

                        $.each(result.data, function (i, detail) {
                            var Sendtoeditor = (data_[0].AllowUpdate == true)
                                ? '<button class="btn btn-success btn-sm sendtoeditor-btn  w-100"" data-id="' + detail.newsID + '"><i class="fas fa-check-circle"></i> Send Editor</button>'
                                : '';
                            var goingtolive = (data_[0].AllowUpdate == true)
                                ? '<button class="btn btn-danger btn-sm NewsGoingToLive-btn  w-100"" data-id="' + detail.newsID + '"><i class="fas fa-check-circle"></i> Going To Live</button>'
                                : '';
                            if (detail.NewsStatus == 2) {
                                var newsItem = `
                                <div class="row align-items-center">
                                    <div class="col-md-2 col-12 text-center">
                                        <div class="newsimg-div">
                                            <img src="${detail.Newsimage}" class="img-fluid rounded" alt="News Image">
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-12">
                                        <div class="news-maintitle">
                                            <h5 class="font-weight-bold">${detail.title}</h5>
                                        </div>
                                        <div class="news-description">
                                            <p class="text-muted">${detail.newsdescription}</p>
                                        </div>
                                    </div>
                                    <div class="col-md-2 col-12 text-center">
                                        <div class="action-btns">
                                            <div class="row">
                                                <div class="col-md-12 mb-2">
                                                   ${Sendtoeditor}
                                                </div>
                                                <div class="col-md-12 mb-2">
                                                    ${goingtolive}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    </div>`;
                                $('#newsContainer').append(newsItem);
                            }
                        });
                        $('.sendtoeditor-btn').click(function () {
                            newsID = $(this).data('id');
                            $('#publisherRemarks').modal('show');
                            $('body').removeClass();
                            PublisherSendToEditor(newsID);
                        });
                        $('.NewsGoingToLive-btn').click(function () {
                            newsID = $(this).data('id');
                            NewsGoingToLive(newsID);
                        });
                    }
                } else {
                    console.log(error);
                }
            });
        }
    });
}