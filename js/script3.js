fetch("https://bethany-eb426-default-rtdb.firebaseio.com/brands.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    let brandItem = {};
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    data.forEach((brand) => {
      for (const key in brand) {
        if (id === key) {
          brandItem = brand[key];
          break;
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
        console.log("fetch api ", brandItems);
        return brandItems;
      } catch (error) {
        console.error(
          "Đã xảy ra lỗi khi lấy dữ liệu từ Firebase Database:",
          error
        );
      }
    }

    let urlPostData = "";
    let urlPutId = "";
    const titleBrand = document.getElementById("title-brand");
    const brandNameInput = document.getElementById("brand-name");
    const nameInput = document.getElementById("name");
    const yearSelect = document.getElementById("year");
    const typeInput = document.getElementById("type");
    const positionRowSelect = document.getElementById("position-row");
    const numberColSelect = document.getElementById("number-columns");
    const positionSelect = document.getElementById("position");
    const studioInput = document.getElementById("studio");
    const responsibilitiesInput = document.getElementById("responsibilities");
    const roleInput = document.getElementById("role");
    const describeInput = document.getElementById("describe");

    var numberColumnsElement = document.getElementById("number-columns");
    var locationElement = document.getElementById("position");

    const formatLocation3 = ["left", "center", "right"];
    const formatLocation2 = ["left", "right"];

    async function ConfigLocation() {
      try {
        const locationArr = await fetchBrandData();

        var optionElement = document.createElement("option");
        optionElement.textContent = brandItem.positonRow;
        optionElement.value = parseInt(brandItem.positonRow) - 1;
        console.log("value row", optionElement.value);
        document.getElementById("position-row").appendChild(optionElement);

        var optionElement2 = document.createElement("option");
        optionElement2.textContent = 2;
        optionElement2.value = 2;

        var optionElement3 = document.createElement("option");
        optionElement3.textContent = 3;
        optionElement3.value = 3;

        document.getElementById("number-columns").appendChild(optionElement2);
        document.getElementById("number-columns").appendChild(optionElement3);

        console.log("number col", brandItem.numberCol);

        if (brandItem.numberCol === 2) {
          deleteOptionLocation();
          for (let i = 0; i < brandItem.numberCol; i++) {
            var optionElement = document.createElement("option");
            optionElement.textContent = formatLocation2[i];

            optionElement.value = i;

            document.getElementById("position").appendChild(optionElement);
          }
        } else if (brandItem.numberCol === 3) {
          deleteOptionLocation();
          for (let i = 0; i < brandItem.numberCol; i++) {
            var optionElement = document.createElement("option");
            optionElement.textContent = formatLocation3[i];
            optionElement.value = i;

            document.getElementById("position").appendChild(optionElement);
          }
        }
        //gan gia tri cho input

        titleBrand.innerText = "Edit Brand: " + brandItem.name;

        brandNameInput.value = brandItem.brandName;

        nameInput.value = brandItem.name;

        yearSelect.value = brandItem.year;

        typeInput.value = brandItem.type;

        positionRowSelect.value = parseInt(brandItem.positonRow) - 1;

        numberColSelect.value = brandItem.numberCol;

        positionSelect.value = brandItem.location - 1;

        studioInput.value = brandItem.detail.studio || "";

        roleInput.value = brandItem.detail.role || "";

        responsibilitiesInput.value = brandItem.detail.Responsibilities || "";

        describeInput.value = brandItem.detail.describe || "";

        numberColumnsElement.addEventListener("change", handleChangeCol);
        locationElement.addEventListener("change", handleChangeLoc);
        let changeCol = false;
        let changeLoc = false;
        let changeBrand = false;

        function logicChange(posRow, numCol, loc, formData) {
          const posRowOld = parseInt(brandItem.positonRow);

          if (posRow === posRowOld) {
            //truong hop chuyen tu 2 sang 3 col
            if (numCol === 3 && brandItem.numberCol === 2) {
              changeCol = true;
              //truong hop chuyen location

              if (loc !== brandItem.location - 1) {
                let isSearch = false;
                //kiem tra xem vi tri moi co cho chiem khong
                for (
                  let i = 0;
                  i < locationArr[posRowOld - 1].location.length;
                  i++
                ) {
                  if (locationArr[posRowOld - 1].location[i] === loc) {
                    isSearch = true;

                    break;
                  }
                }
                //neu co brad chiem thi doi cho nguoc lai thi chi doi location
                if (isSearch) {
                  console.log(
                    "change col tu 2 sang 3 va location cua brand hien tai voi bran chiem cho"
                  );
                  fetchdata3(formData);
                } else {
                  console.log("change col tu 2 sang 3 voi location moi");
                  fetchdata3(formData);
                }
              } else {
                console.log("gia tri hop le");
                fetchdata3(formData);
                changeLoc = false;
              }
            } else if (numCol === 2 && brandItem.numberCol === 3) {
              //truong hop chuyen tu 3 sang 2
              if (locationArr[posRowOld - 1].location.length < 3) {
                //if co 2 brand thi if loc = 0, brand con lai = 1, nguoc lai

                console.log(
                  "change cot 3 sang 2, 2 brand doi voi location 0, 1"
                );
                fetchdata3(formData);
              } else {
                alert(
                  "Because the number of brands is 3, it cannot be converted into 2 columns"
                );
                numberColSelect.value = brandItem.numberCol || 3;
                deleteOptionLocation();
                for (let i = 0; i < brandItem.numberCol; i++) {
                  var optionElement = document.createElement("option");
                  optionElement.textContent = formatLocation3[i];
                  optionElement.value = i;

                  document
                    .getElementById("position")
                    .appendChild(optionElement);
                }
                positionSelect.value = brandItem.location - 1;
              }
            } else if (loc === brandItem.location - 1) {
              console.log("khong co thay doi nen push binh thuong");
              fetchdata2(formData);
            } else {
              changeCol = false;
              if (brandItem.numberCol === 2) {
                if (locationArr[posRowOld - 1].location.length > 1) {
                  console.log("hoan doi location voi brand con lai voi cot 2");
                  fetchdata2(formData);
                } else {
                  console.log("chuyen sang location moi trong cot 2");
                  fetchdata2(formData);
                }
              } else if (brandItem.numberCol === 3) {
                let isSearch = false;
                for (
                  let i = 0;
                  i < locationArr[posRowOld - 1].location.length;
                  i++
                ) {
                  if (locationArr[posRowOld - 1].location[i] === loc) {
                    isSearch = true;
                    break;
                  }
                }
                if (isSearch) {
                  console.log("doi location voi brand bi trung trong cot 3");
                  fetchdata2(formData);
                } else {
                  console.log("chuyen location la duoc trong cot 3");
                  fetchdata2(formData);
                }
              }
            }
          }
        }

        function handleChangeCol(event) {
          var selectedOption = this.value;
          const numberSelect = parseInt(selectedOption);
          const posRow = parseInt(brandItem.positonRow);
          if (numberSelect === 2) {
            console.log("Bạn đã chọn 2");
            deleteOptionLocation();
            for (let i = 0; i < formatLocation2.length; i++) {
              var optionElement = document.createElement("option");
              optionElement.textContent = formatLocation2[i];
              optionElement.value = i;

              document.getElementById("position").appendChild(optionElement);
            }
            positionSelect.value = 0;
          } else if (numberSelect === 3) {
            console.log("Bạn đã chọn 3");
            deleteOptionLocation();
            for (let i = 0; i < formatLocation3.length; i++) {
              var optionElement = document.createElement("option");
              optionElement.textContent = formatLocation3[i];
              optionElement.value = i;

              document.getElementById("position").appendChild(optionElement);
            }
            //neu chi chuyen so cot thi
            positionSelect.value = brandItem.location - 1;
          }
        }

        function handleChangeLoc(event) {
          var selectedOption = this.value;
          const numberSelect = parseInt(selectedOption);
          const posRow = parseInt(brandItem.positonRow);
          const partCol = parseInt(numberColSelect.value);

          if (partCol === 2) {
            if (numberSelect === 0) {
              positionSelect.value = 0;
              console.log("Bạn đã chọn left");
            } else if (numberSelect === 1) {
              positionSelect.value = 1;
              console.log("Bạn đã chọn right");
            }
          } else if (partCol === 3) {
            if (numberSelect === 0) {
              positionSelect.value = 0;
              console.log("Bạn đã chọn left");
            } else if (numberSelect === 1) {
              positionSelect.value = 1;
              console.log("Bạn đã chọn center");
            } else if (numberSelect === 2) {
              positionSelect.value = 2;
              console.log("Bạn đã chọn right");
            }
            //neu chi chuyen so cot thi
          }
        }

        //hoan doi location vs brand con lai o col 2
        function fetchdata2(formData) {
          const rowIndex = parseInt(brandItem.positonRow) - 1;

          // URL của Firebase Realtime Database
          const firebaseUrl = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}.json`;

          fetch(firebaseUrl)
            .then((response) => response.json())
            .then((data) => {
              const keys = Object.keys(data);

              console.log("Các key trong Firebase Database:");
              keys.forEach((key) => {
                console.log(
                  "day la location cua tung key ",
                  data[key].location,
                  brandItem.id
                );
                if (key !== brandItem.id) {
                  if (data[key].location === formData.location) {
                    console.log(
                      "brand bi chiem cho doi sang vi tri ",
                      brandItem.location
                    );
                    //chinh sua brand bi chiem cho
                    fetch(
                      `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}/${key}.json`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({
                          location: brandItem.location,
                        }),
                      }
                    )
                      .then((response) => response.json())
                      .then((data) => {
                        console.log(
                          "chinh sua location cua brand bi chiem cho success"
                        );
                      })
                      .catch((error) => {
                        console.error(
                          "Đã xảy ra lỗi khi cập nhật dữ liệu trên Firebase:",
                          error
                        );
                      });
                  }
                }
              });
              //dat brand can chinh vao cho da chiem
              fetch(
                `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}/${brandItem.id}.json`,
                {
                  method: "PUT",
                  body: JSON.stringify(formData),
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  alert("Save Edit Brand Success!!!");
                  window.location.href = "/index.html";
                })
                .catch((error) => {
                  console.error(
                    "Đã xảy ra lỗi khi gửi dữ liệu lên Firebase:",
                    error
                  );
                  // Xử lý lỗi nếu cần
                });
            })
            .catch((error) => {
              console.error("Đã xảy ra lỗi:", error);
            });
        }

        //chuyen col 2 sang 3 hoac nguoc lai ma khong thay doi location
        function fetchdata3(formData) {
          const rowIndex = parseInt(brandItem.positonRow) - 1;

          // URL của Firebase Realtime Database
          const firebaseUrl = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}.json`;

          fetch(firebaseUrl)
            .then((response) => response.json())
            .then((data) => {
              const keys = Object.keys(data);

              console.log("Các key trong Firebase Database:");
              keys.forEach((key) => {
                console.log(
                  "day la location cua tung key ",
                  data[key].location,
                  brandItem.id
                );
                console.log("key !== brandItem.id", key !== brandItem.id);
                if (key !== brandItem.id) {
                  //chinh sua tat ca brand thanh col 3 hoac nguoc lai
                  console.log(brandItem.location);
                  fetch(
                    `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}/${key}.json`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        numberCol: formData.numberCol,
                      }),
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(
                        "thay tat ca brand col sang 3 hoac nguoc lai roi luu brand vao vi tri moi"
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Đã xảy ra lỗi khi cập nhật dữ liệu trên Firebase:",
                        error
                      );
                    });
                }
                console.log(
                  "data[key].location === formData.location",
                  data[key].location === formData.location
                );

                if (data[key].location === formData.location) {
                  console.log(brandItem.location, formData.numberCol);
                  fetch(
                    `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}/${key}.json`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        location: brandItem.location,
                        numberCol: formData.numberCol,
                      }),
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(
                        "thay tat ca brand col sang 3 hoac nguoc lai va doi location bi trung"
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Đã xảy ra lỗi khi cập nhật dữ liệu trên Firebase:",
                        error
                      );
                    });
                } else if (data[key].location === 3) {
                  //neu nam o vi tri right cot 3
                  let idLoc = 1;
                  if (formData.location === 1) {
                    idLoc = 2;
                  }
                  fetch(
                    `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}/${key}.json`,
                    {
                      method: "PATCH",
                      body: JSON.stringify({
                        location: idLoc,
                        numberCol: formData.numberCol,
                      }),
                    }
                  )
                    .then((response) => response.json())
                    .then((data) => {
                      console.log(
                        "thay tat ca brand col sang 3 hoac nguoc lai va doi location bi trung"
                      );
                    })
                    .catch((error) => {
                      console.error(
                        "Đã xảy ra lỗi khi cập nhật dữ liệu trên Firebase:",
                        error
                      );
                    });
                }
              });
              //dat brand can chinh vao cho da chiem
              fetch(
                `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${rowIndex}/${brandItem.id}.json`,
                {
                  method: "PUT",
                  body: JSON.stringify(formData),
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  alert("Save Edit Brand Success!!!");
                  window.location.href = "/index.html";
                })
                .catch((error) => {
                  console.error(
                    "Đã xảy ra lỗi khi gửi dữ liệu lên Firebase:",
                    error
                  );
                  // Xử lý lỗi nếu cần
                });
            })
            .catch((error) => {
              console.error("Đã xảy ra lỗi:", error);
            });
        }

        //form data khi gui len server
        document
          .getElementById("saveEditButton")
          .addEventListener("click", function (event) {
            event.preventDefault();

            var brandName = document.getElementById("brand-name").value;
            var name = document.getElementById("name").value;
            var year = document.getElementById("year").value;
            var type = document.getElementById("type").value;
            var positonRow = document.getElementById("position-row").value;
            var numberColumns = document.getElementById("number-columns").value;
            var position = document.getElementById("position").value;
            var studio = document.getElementById("studio").value;
            var role = document.getElementById("role").value;
            var responsibilities =
              document.getElementById("responsibilities").value;
            var describe = document.getElementById("describe").value;
            var images = [];
            for (var i = 0; i < imageUrls.length; i++) {
              var obj = {
                alt: brandName,
                url: imageUrls[i],
              };
              images.push(obj);
            }
            const row = parseInt(positonRow) + 1;
            const col = parseInt(numberColumns);
            const loc = parseInt(position);
            var formData = {
              alt: brandName,
              brandName: brandName,
              detail: {
                studio: studio,
                role: role,
                Responsibilities: responsibilities,
                describe: describe,
                images: images,
                name: name,
              },
              id: brandItem.id,
              image: imageUrls[0],
              positonRow: row.toString(),
              numberCol: parseInt(numberColumns),
              location: parseInt(position) + 1,
              name: name,
              year: year,
              type: type,
            };

            console.log("gia tri cuoi cung ", row, col, loc);
            if (
              (isNaN(formData.positonRow) &&
                formData.positonRow === "-- Line selection --") ||
              isNaN(formData.numberCol) ||
              isNaN(formData.location)
            ) {
              alert("Please select the full range of brand locations");
            } else {
              logicChange(row, col, loc, formData);
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

    var imageUrls = [];
    if (brandItem.detail?.images) {
      brandItem.detail.images.forEach((imageItem) => {
        var newRow = document.createElement("tr");

        var imageCell = document.createElement("td");
        var nameCell = document.createElement("td");
        nameCell.className = "display-none";
        var actionCell = document.createElement("td");

        var imageElement = document.createElement("img");
        imageElement.src = imageItem.url;
        imageElement.className = "image-test";
        imageElement.alt = imageItem.alt;

        imageCell.appendChild(imageElement);

        nameCell.textContent = imageItem.alt;

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

        imageUrls.push(imageItem.url);
      });
    }

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

    if (imageUrls.length === 0) {
      var noData = createNoDataRow();
      document.querySelector("#image-table tbody").appendChild(noData);
    }

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
            document
              .querySelector("#image-table tbody")
              .appendChild(loadingRow);

            let folderName = "bethany";

            const imageUrl = await uploadImageToCloudinary(file, folderName);

            document
              .querySelector("#image-table tbody")
              .removeChild(loadingRow);

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

            var icon = document.createElement("i");
            icon.className = "ti-reload ti-spin";
            icon.style.color = "#57B657";

            loadingCell.appendChild(icon);
            loadingCell.appendChild(
              document.createTextNode(" Loading image...")
            );

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

    document
      .querySelector("#image-table")
      .addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
          var row = event.target.closest("tr");
          var index = Array.from(row.parentElement.children).indexOf(row); // Lấy chỉ số của dòng trong bảng
          imageUrls.splice(index, 1);
          row.remove();
          console.log(imageUrls);
          if (imageUrls.length === 0) {
            document.querySelector("#image-table tbody").appendChild(noData);
          }
        }
      });

    //put data

    //xu ly push data
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
