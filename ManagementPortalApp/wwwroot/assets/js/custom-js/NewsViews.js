var newsID;
var GlobalTemplateID;
$(document).ready(function () {
    GetNews();
});

function GetNews() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetVeiwNews'), 'GET', '', true).FETCH((result, error) => {
                if (result && result.data) {
                    if ($.fn.dataTable.isDataTable('#SingleNewsView')) {
                        $('#SingleNewsView').DataTable().destroy();
                    }
                    $('#SingleNewsView tbody').html('');
                    $.each(result.data, function (i, news) {
                        var Edit = (data_[0].AllowUpdate) ?
                            `<button class="btn btn-primary btn-sm edit-btn" data-id="${news.newsid}" data-template-id="${news.templateid}">
                                <i class="fa fa-edit"></i>
                             </button>` : '';
                        var Delete = (data_[0].AllowDelete) ?
                            `<button class="btn btn-danger btn-sm delete-btn" data-id="${news.newsid}">
                                <i class="fa fa-trash"></i>
                             </button>` : '';
                        var SentToEditor = (data_[0].AllowUpdate) ?
                            `<button class="btn btn-success btn-sm sendeditor-btn" data-id="${news.newsid}">
                               <i class="fa fa-paper-plane"></i>
                             </button>` : '';
                        var remarks = news.editorremarks ?
                            `<textarea class="form-control" rows="3" readonly>${news.editorremarks}</textarea>` :
                            'No remarks provided';
                        if (news.isDeleted == 0 && news.NewsStatus == 0) {
                            var newsItem = `
                                <tr>
                                    <td><img src="${news.Newsimage}" class="img-fluid" alt="Image" width="100"></td>
                                    <td>${news.title}</td>             
                                    <td>
                                        <div class="d-flex justify-content-evenly">
                                            ${Edit}   
                                            ${Delete}    
                                            ${SentToEditor}   
                                        </div>
                                    </td>
                                    <td>${remarks}</td>
                                </tr>`;
                            $('#SingleNewsView tbody').append(newsItem);
                        }
                        else if (news.isDeleted == 0 && news.NewsStatus == 1 ) {
                            var newsItem = `
                                <tr>
                                    <td><img src="${news.Newsimage}" class="img-fluid" alt="Image" width="100"></td>
                                    <td>${news.title}</td>             
                                    <td>
                                        <div class="d-flex justify-content-evenly">
                                             This News is With Editor.
                                        </div>
                                    </td>
                                    <td>${remarks}</td>
                                </tr>`;
                            $('#SingleNewsView tbody').append(newsItem);
                        }
                    });
                    $('#SingleNewsView').DataTable({
                        paging: true,
                        searching: true,
                        ordering: true,
                        responsive: true
                    });
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
                    $('.delete-btn').click(function () {
                        newsID = $(this).data('id');
                        DeleteNews();
                    });
                    $('.sendeditor-btn').click(function () {
                        newsID = $(this).data('id');
                        $('#CreaterRemarks').modal('show');
                        $('body').removeClass();
                        NewsSendToEditor(newsID);
                        
                    });
                } else if (error) {
                    console.error("Error fetching news data:", error);
                }
            });
        } else {
            console.error('Session expired or invalid session.');
        }
    });
}

function NewsSendToEditor(newsID) {
    $('#submit-remarks').off('click').on('click', function () {
        var creatorRemarks = $('#creator-remarks').val();
        if (!creatorRemarks) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning...',
                text: 'Please enter remarks before sending back to the editor!',
                footer: ''
            });
            return;
        }
        var UpdateStatus = JSON.stringify({
            NewsID: newsID,
            CreatorRemarks: creatorRemarks
        });
        new APICALL(GetGlobalURL('Base', 'CreaterSendToEditor'), 'POST', UpdateStatus, true).FETCH((result, error) => {
            if (result) {
                GetNews();

                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'News Successfully Sent To Editor!',
                    footer: ''
                });
                $('#CreaterRemarks').modal('hide');
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
function DeleteNews() {
    var DeleteUserID = $('#UserID').val();
    var DeleteNews = JSON.stringify({
        UserID: DeleteUserID,
        NewsID: newsID
    });
    Swal.fire({
        title: 'Do you want to save?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'DeleteNEwsByUserIDMGNews'), 'POST', DeleteNews, true).FETCH((result, error) => {
                if (result) {
                    GetNews();

                    Swal.fire({

                        icon: 'success',
                        title: 'Success...',
                        text: 'News Deleted Saved Successfully!',
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
    });
}