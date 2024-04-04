// Hàm để tải ảnh lên Cloudinary
async function uploadImageToCloudinary(file, folderName) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "irpj555r");
  formData.append("folder", folderName);
  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dzyqr3zmd/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}

document
  .querySelector(".file-upload-browse2")
  .addEventListener("click", function () {
    document.getElementById("file-upload").click();
  });

var noData = createNoDataRow();
document.querySelector("#image-table tbody").appendChild(noData);

document
  .getElementById("file-upload")
  .addEventListener("change", async function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = async function (e) {
      var imageName = file.name;

      try {
        if (imageUrls.length === 0) {
          document.querySelector("#image-table tbody").removeChild(noData);
        }

        var loadingRow = createLoadingRow();
        document.querySelector("#image-table tbody").appendChild(loadingRow);

        let folderName = "bethany";

        const imageUrl = await uploadImageToCloudinary(file, folderName);

        document.querySelector("#image-table tbody").removeChild(loadingRow);

        var newRow = document.createElement("tr");

        var imageCell = document.createElement("td");
        var nameCell = document.createElement("td");
        nameCell.className = "display-none";
        var actionCell = document.createElement("td");

        var imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.className = "image-test";
        imageElement.alt = imageName;

        imageCell.appendChild(imageElement);

        nameCell.textContent = imageName;

        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-danger btn-icon-text delete-btn";
        deleteButton.innerHTML =
          '<i class="ti-trash btn-icon-prepend"></i>Delete';

        actionCell.appendChild(deleteButton);

        newRow.appendChild(imageCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(actionCell);

        document.querySelector("#image-table tbody").appendChild(newRow);

        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error handling uploaded image:", error);
      }

      function createLoadingRow() {
        var loadingRow = document.createElement("tr");

        var loadingCell = document.createElement("td");
        loadingCell.colSpan = 3;
        loadingCell.style.textAlign = "center";

        var circleDiv = document.createElement("div");
        circleDiv.classList.add("circle-loader");
        loadingCell.appendChild(circleDiv);

        loadingRow.appendChild(loadingCell);

        return loadingRow;
      }
    };

    reader.readAsDataURL(file);
  });

function createNoDataRow() {
  var noDataRow = document.createElement("tr");

  var noDataCell = document.createElement("td");
  noDataCell.colSpan = 3;
  noDataCell.style.textAlign = "center";

  var noDataContent = document.createElement("span");
  noDataContent.textContent = "No Data";
  noDataContent.style.marginRight = "5px";
  var icon = document.createElement("i");
  icon.className = "ti-package";
  icon.style.color = "#ccc";

  noDataCell.appendChild(noDataContent);
  noDataCell.appendChild(icon);

  noDataRow.appendChild(noDataCell);

  return noDataRow;
}

var imageUrls = [];

document
  .querySelector("#image-table")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      var row = event.target.closest("tr");
      var index = Array.from(row.parentElement.children).indexOf(row);
      imageUrls.splice(index, 1);
      row.remove();
      if (imageUrls.length === 0) {
        document.querySelector("#image-table tbody").appendChild(noData);
      }
    }
  });

async function fetchBrandData() {
  try {
    const response = await fetch(
      "https://bethany-eb426-default-rtdb.firebaseio.com/.json"
    );
    const data = await response.json();

    let positionRow;
    let numberCol;
    let brandItems = [];

    data.brands.forEach((brand) => {
      let locArr = [];
      for (const key in brand) {
        positionRow = brand[key].positonRow - 1;
        numberCol = brand[key].numberCol;
        locArr.push(brand[key].location - 1);
      }
      brandItems.push({
        positionRow: parseInt(positionRow),
        numberCol: numberCol,
        location: locArr,
      });
    });

    return brandItems;
  } catch (error) {
    console.error("Đã xảy ra lỗi khi lấy dữ liệu từ Firebase Database:", error);
  }
}

let urlPostData = "";
let urlPutId = "";
var numberColumnsElement = document.getElementById("number-columns");

const formatLocation3 = ["left", "center", "right"];
const formatLocation2 = ["left", "right"];

async function ConfigLocation() {
  try {
    const locationArr = await fetchBrandData();
    for (let i = 0; i < locationArr.length; i++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = i + 1;
      optionElement.value = i;

      document.getElementById("position-row").appendChild(optionElement);
    }

    document
      .getElementById("position-row")
      .addEventListener("change", function () {
        numberColumnsElement.removeEventListener("change", handleChange);

        var selectedOption = this.value;
        const numberSelect = parseInt(selectedOption);
        let isFullBrand = true;
        if (selectedOption === "New row") {
          newRow();
        } else {
          locationArr.forEach((e) => {
            if (numberSelect === e.positionRow) {
              deleteOptionLocation();
              if (e.numberCol === 2) {
                deleteOptionCol();

                var optionElement = document.createElement("option");
                optionElement.textContent = e.numberCol;

                document
                  .getElementById("number-columns")
                  .appendChild(optionElement);
                for (let i = 0; i < e.numberCol; i++) {
                  if (e.location.indexOf(i) === -1) {
                    deleteOptionLocation();
                    var optionElement = document.createElement("option");
                    optionElement.textContent = formatLocation2[i];
                    optionElement.value = i;

                    document
                      .getElementById("position")
                      .appendChild(optionElement);
                    isFullBrand = false;
                  }
                }
              } else if (e.numberCol === 3) {
                deleteOptionCol();

                var optionElement = document.createElement("option");
                optionElement.textContent = e.numberCol;

                document
                  .getElementById("number-columns")
                  .appendChild(optionElement);
                for (let i = 0; i < e.numberCol; i++) {
                  if (e.location.indexOf(i) === -1) {
                    deleteOptionLocation();
                    var optionElement = document.createElement("option");
                    optionElement.textContent = formatLocation3[i];
                    optionElement.value = i;

                    document
                      .getElementById("position")
                      .appendChild(optionElement);
                    isFullBrand = false;
                  }
                }
              }

              if (isFullBrand) {
                alert("This row is full, please create a new row!");
                const positionRowSelect =
                  document.getElementById("position-row");
                positionRowSelect.value = "New row";
                newRow();
              }
            }
          });
        }
      });
  } catch (error) {
    console.error("Đã xảy ra lỗi khi thực hiện fetch data:", error);
  }
}

ConfigLocation();

function deleteOptionCol() {
  var selectElement = document.getElementById("number-columns");
  var options = selectElement.options;

  var i = 0;
  while (i < options.length) {
    if (options[i].classList.contains("disabled")) {
      i++;
    } else {
      selectElement.remove(i);
    }
  }
}

function deleteOptionLocation() {
  var selectElement = document.getElementById("position");
  var options = selectElement.options;

  var i = 0;
  while (i < options.length) {
    if (options[i].classList.contains("disabled")) {
      i++;
    } else {
      selectElement.remove(i);
    }
  }
}

function handleChange(event) {
  var selectedOption = this.value;
  const numberSelect = parseInt(selectedOption);

  if (numberSelect === 2) {
    console.log("Bạn đã chọn 2");
    deleteOptionLocation();
    for (let i = 0; i < formatLocation2.length; i++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = formatLocation2[i];
      optionElement.value = i;

      document.getElementById("position").appendChild(optionElement);
    }
  } else if (numberSelect === 3) {
    console.log("Bạn đã chọn 3");
    deleteOptionLocation();
    for (let i = 0; i < formatLocation3.length; i++) {
      var optionElement = document.createElement("option");
      optionElement.textContent = formatLocation3[i];
      optionElement.value = i;

      document.getElementById("position").appendChild(optionElement);
    }
  }
}

function newRow() {
  isFullBrand = false;
  deleteOptionCol();
  deleteOptionLocation();
  var optionElement2 = document.createElement("option");
  optionElement2.textContent = 2;
  optionElement2.value = 2;

  var optionElement3 = document.createElement("option");
  optionElement3.textContent = 3;
  optionElement3.value = 3;

  document.getElementById("number-columns").appendChild(optionElement2);
  document.getElementById("number-columns").appendChild(optionElement3);

  numberColumnsElement.addEventListener("change", handleChange);
}

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("myForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const brands = await fetchBrandData();
      console.log("brandskajshkasdj", brands.length);
      var brandName = document.getElementById("brand-name").value;
      var name = document.getElementById("name").value;
      var year = document.getElementById("year").value;
      var type = document.getElementById("type").value;
      var positonRow = document.getElementById("position-row").value;
      var positonRowPart = "";
      if (positonRow === "New row") {
        positonRowPart = "New row";
      } else if (positonRow === "-- Line selection --") {
        positonRowPart = "-- Line selection --";
      } else {
        positonRowPart = parseInt(positonRow) + 1;
      }
      var numberColumns = document.getElementById("number-columns").value;
      var position = document.getElementById("position").value;

      var studio = document.getElementById("studio").value;
      var role = document.getElementById("role").value;
      var responsibilities = document.getElementById("responsibilities").value;
      var describe = document.getElementById("describe").value;
      var images = [];
      for (var i = 0; i < imageUrls.length; i++) {
        var obj = {
          alt: brandName,
          url: imageUrls[i],
        };
        images.push(obj);
      }

      var formData = {
        alt: brandName,
        brandName: brandName,
        detail: {
          studio: studio,
          role: role,
          Responsibilities: responsibilities,
          images: images,
          describe: describe,
          name: name,
          year: year,
        },
        id: "",
        image: imageUrls[0],
        positonRow: positonRowPart.toString(),
        numberCol: parseInt(numberColumns),
        location: parseInt(position) + 1,
        name: name,
        year: year,
        type: type,
      };

      if (
        (isNaN(formData.positonRow) &&
          formData.positonRow === "-- Line selection --") ||
        isNaN(formData.numberCol) ||
        isNaN(formData.location)
      ) {
        alert("Please select the full range of brand locations");
      } else {
        console.log("truong hop dien day du thong tin");
        if (formData.positonRow === "New row") {
          positonRow = brands.length.toString();
          urlPostData = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${brands.length}.json`;
          urlPutId = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${brands.length}/`;
          formData.positonRow = positonRow;
        } else {
          const idBrand = parseInt(formData.positonRow) - 1;
          urlPostData = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${idBrand}.json`;
          urlPutId = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${idBrand}/`;
        }

        fetch(urlPostData, {
          method: "POST",
          body: JSON.stringify(formData),
        })
          .then((response) => response.json())
          .then((data) => {
            fetch(urlPutId + data.name + ".json", {
              method: "PATCH",
              body: JSON.stringify({ id: data.name }),
            })
              .then((response) => response.json())
              .then((data) => {})
              .catch((error) => {
                console.error(
                  "Đã xảy ra lỗi khi cập nhật dữ liệu trên Firebase:",
                  error
                );
              });
            alert("Add Brand Success!!!");
            window.location.href = "/index.html";
          })
          .catch((error) => {
            console.error("Đã xảy ra lỗi khi gửi dữ liệu lên Firebase:", error);
            // Xử lý lỗi nếu cần
          });
      }
    });
});
