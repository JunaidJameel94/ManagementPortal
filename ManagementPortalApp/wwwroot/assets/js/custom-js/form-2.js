document.addEventListener("DOMContentLoaded", () => {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const uploadContainer = document.getElementById("uploadContainer");
  const navigationButtons = document.getElementById("navigationButtons");
  const leftButton = document.getElementById("leftButton");
  const rightButton = document.getElementById("rightButton");

  const maxVisible = 5; // Max visible items
  let currentIndex = 0;

  // Open file picker on dropzone click
  dropzone.addEventListener("click", () => {
    fileInput.click();
  });

  // Handle file input change
  fileInput.addEventListener("change", () => {
    handleFiles(fileInput.files);
  });

  // Drag-and-drop functionality
  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  });

  // Process files
  function handleFiles(files) {
    Array.from(files).forEach((file) => {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const previewDiv = document.createElement("div");
        previewDiv.classList.add("upimageone");

        if (file.type.startsWith("image/")) {
          // Image preview
          previewDiv.innerHTML = `
            <img src="${e.target.result}" alt="${file.name}" class="img-fluid">
            <div class="uplods-imgbtns">
              <button class="btn rounded-circle btn-circle-danger" id="deleteFile"><i class="feather-trash fs-5 m-auto"></i></button> 
              <button class="btn rounded-circle btn-main-circle" id="viewFile"><i class="feather-search fs-5 m-auto"></i></button>
            </div>
          `;
        } else if (file.type.startsWith("video/")) {
          // Video preview
          previewDiv.innerHTML = `
            <video controls class="img-fluid">
              <source src="${e.target.result}" type="${file.type}">
              Your browser does not support the video tag.
            </video>
            <div class="uplods-imgbtns">
              <button class="btn rounded-circle btn-circle-danger" id="deleteFile"><i class="feather-trash fs-5 m-auto"></i></button> 
              <button class="btn rounded-circle btn-main-circle" id="viewFile"><i class="feather-search fs-5 m-auto"></i></button>
            </div>
          `;
        }

        // Add remove button functionality
        previewDiv.querySelector(".btn-circle-danger").addEventListener("click", () => {
          previewDiv.remove();
          updateVisibility();
        });

        uploadContainer.appendChild(previewDiv);
        updateVisibility();
      };

      fileReader.readAsDataURL(file);
    });
  }

  // Update visibility and toggle class on parent div
  function updateVisibility() {
    const items = Array.from(uploadContainer.children);
    
    // Add or remove `reduceSize` class
    if (items.length > 0) {
      dropzone.parentElement.classList.add("reduceSize");
    } else {
      dropzone.parentElement.classList.remove("reduceSize");
    }

    // Show or hide items and navigation buttons
    items.forEach((item, index) => {
      if (index >= currentIndex && index < currentIndex + maxVisible) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    navigationButtons.style.display = items.length > maxVisible ? "flex" : "none";
  }

  // Navigate left
  leftButton.addEventListener("click", () => {
    const items = Array.from(uploadContainer.children);
    if (currentIndex > 0) {
      currentIndex--;
      updateVisibility();
    }
  });

  // Navigate right
  rightButton.addEventListener("click", () => {
    const items = Array.from(uploadContainer.children);
    if (currentIndex + maxVisible < items.length) {
      currentIndex++;
      updateVisibility();
    }
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const uploadContainer = document.getElementById("uploadContainer");
  const viewModal = new bootstrap.Modal(document.getElementById("viewModal"));
  const modalImage = document.getElementById("modalImage");
  const modalVideo = document.getElementById("modalVideo");
  const modalVideoSource = document.getElementById("modalVideoSource");

  // Handle delete button click
  uploadContainer.addEventListener("click", (e) => {
    if (e.target.closest("#deleteFile")) {
      const upimageone = e.target.closest(".upimageone");
      if (upimageone) {
        upimageone.remove();
      }
    }
  });

  // Handle view button click
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
      }
    }
  });
});



  $(document).ready(function() {
      $('#summernote').summernote();
      
  
    // Initialize Feather Icons on page load
    feather.replace();
  
    // Initialize Select2
    $('.js-select2').select2({
        placeholder: 'Select an option',
        allowClear: true
    });
  
    // Handle dropdown open and close
    $('.js-select2').on('select2:open', function() {
        const icon = $(this).siblings('.dropdown-icon');
        icon.attr('data-feather', 'chevron-up'); // Change to chevron-up
        feather.replace(); // Refresh Feather Icons
    });
  
    $('.js-select2').on('select2:close', function() {
        const icon = $(this).siblings('.dropdown-icon');
        icon.attr('data-feather', 'chevron-down'); // Change to chevron-down
        feather.replace(); // Refresh Feather Icons
    }); 
      Highcharts.chart('containers', {
          chart: {
              type: 'column'
          },
          title: {
              text: 'Corn vs wheat estimated production for 2023'
          },
          subtitle: {
              text:
                  'Source: <a target="_blank" ' +
                  'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>'
          },
          xAxis: {
              categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
              crosshair: true,
              accessibility: {
                  description: 'Countries'
              }
          },
          yAxis: {
              min: 0,
              title: {
                  text: '1000 metric tons (MT)'
              }
          },
          tooltip: {
              valueSuffix: ' (1000 MT)'
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0
              }
          },
          series: [
              {
                  name: 'Corn',
                  data: [387749, 280000, 129000, 64300, 54000, 34300]
              },
              {
                  name: 'Wheat',
                  data: [45321, 140000, 10000, 140500, 19500, 113500]
              }
          ]
      });

     
  }); 
  
    
  
  document.addEventListener('DOMContentLoaded', function () {
    const addBox = document.querySelector('.add-box');
    const graphForm = document.getElementById('graphForm');
    const MGGraphTable = document.querySelector('.MGGraphTable');

    // Reset to initial state for AddGraph tab
    function resetAddGraphTab() {
        addBox.classList.remove('d-none');
        graphForm.classList.add('d-none');
        MGGraphTable.classList.add('d-none');
    }

    // Event listener for "Add Graph" button
    document.getElementById('AddGraph').addEventListener('click', function (event) {
        const target = event.target;
        if (target.id === 'GraphId') {
            // Show Graph Form
            addBox.classList.add('d-none');
            graphForm.classList.remove('d-none');
            MGGraphTable.classList.add('d-none');
        } else if (target.id === 'GenerateChart') {
            // Show Generated Chart
            graphForm.classList.add('d-none');
            MGGraphTable.classList.remove('d-none');
        }
    });

    // Event listener for Add New Graph tab
    const addNewGraphTabButton = document.getElementById('addNew-Graph');
    addNewGraphTabButton.addEventListener('click', function () {
        resetAddGraphTab();
    });

    // Initial state setup when the page loads
    resetAddGraphTab();
}); 


  
document.addEventListener('DOMContentLoaded', function () {
  const addBoxTable = document.querySelector('.add-box-table');
  const tableForm = document.getElementById('tableForm');
  const MGTable = document.querySelector('#MGTable');

  // Reset to initial state for AddTable tab
  function resetAddTableTab() {
      addBoxTable.classList.remove('d-none');
      tableForm.classList.add('d-none');
      MGTable.classList.add('d-none');
  }

  // Event listener for "Add Table" button inside AddTable tab
  document.getElementById('CreateNewtable').addEventListener('click', function () {
      // Show Table Form
      addBoxTable.classList.add('d-none');
      tableForm.classList.remove('d-none');
      MGTable.classList.add('d-none');
  });

  // Event listener for "Save Table Settings" button
  document.getElementById('SaveTableSettings').addEventListener('click', function () {
      // Show Single Table
      tableForm.classList.add('d-none');
      MGTable.classList.remove('d-none');
  });

  // Event listener for Add New Table tab
  document.getElementById('AddNewtable').addEventListener('click', function () {
      resetAddTableTab();
  });

  // Initial state setup when the page loads
  resetAddTableTab();
});


                          