$(document).ready(function () {
    GetNewsDetail();
    $('#btnnewssearch').click(function () {
        SearchNewsDetail();
    });
});
function GetNewsDetail() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'Get_News_DetailForMGPublisher'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    if (result.data != null) {
                        $('#newsContainer').empty();

                        $.each(result.data, function (i, detail) {
                            var Sendtoeditor = (data_[0].AllowUpdate == true)
                                ? '<button class="btn btn-success btn-sm sendtoeditor-btn  w-100"" data-id="' + detail.newsID + '"><i class="fas fa-check-circle"></i> Send Editor</button>'
                                : '';
                            var goingtolive = (data_[0].AllowUpdate == true)
                                ? '<button class="btn btn-danger btn-sm NewsGoingToLive-btn  w-100"" data-id="' + detail.newsID + '"><i class="fas fa-check-circle"></i> Going To Live</button>'
                                : '';
                            if (detail.NewsStatus == 2 && detail.isDeleted == 0) {
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
                }
            });
        }
    });
}
function PublisherSendToEditor(newsID) {
    $('#submit-remarks').off('click').on('click', function () {
        var publisherRemarks = $('#publisher-remarks').val();
        var UpdateStatus = JSON.stringify({
            NewsID: newsID,
            PublisherRemarks: publisherRemarks
        });
        new APICALL(GetGlobalURL('Base', 'PublisherSendToEditor'), 'POST', UpdateStatus, true).FETCH((result, error) => {
            if (result) {
                GetNewsDetail();
                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'News Successfully Send To Editor!',
                    footer: ''
                });
                $('#publisherRemarks').modal('hide'); 
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
    });
}
function NewsGoingToLive(newsID) {
    var UpdateStatus = JSON.stringify({
        NewsID: newsID
    });
    new APICALL(GetGlobalURL('Base', 'PublisherNewsLive'), 'POST', UpdateStatus, true).FETCH((result, error) => {
        if (result) {
            GetNewsDetail();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'News Successfully Live!',
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


function SearchNewsDetail() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            var newsSearch = $('#searchnewsDetail').val();
            new APICALL(GetGlobalURL('Base', `GetNewsDetailBySearchforMGpublisher?SearchKeyword=${encodeURIComponent(newsSearch)}`), 'GET', '', true).FETCH((result, error) => {
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