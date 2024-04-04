const tbody = document.querySelector(".table tbody");
var circleLoadRow = document.createElement("tr");

var circleLoadCell = document.createElement("td");
circleLoadCell.colSpan = 5;
circleLoadCell.style.textAlign = "center";
circleLoadCell.style.height = "60vh";

var circleDiv = document.createElement("div");
circleDiv.classList.add("circle-loader");

circleLoadCell.appendChild(circleDiv);
circleLoadRow.appendChild(circleLoadCell);
tbody.appendChild(circleLoadRow);

fetch("https://bethany-eb426-default-rtdb.firebaseio.com/brands.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const dataArray = [];

    data.forEach((brand) => {
      for (const key in brand) {
        dataArray.push(brand[key]);
      }
    });

    dataArray.forEach((data) => {
      const row = document.createElement("tr");

      const imageCell = document.createElement("td");
      const image = document.createElement("img");
      image.src = data.image;
      image.alt = data.brandName;
      image.className = "image-test";
      imageCell.appendChild(image);
      row.appendChild(imageCell);

      const brandNameCell = document.createElement("td");
      brandNameCell.textContent = data.name;
      row.appendChild(brandNameCell);

      const typeCell = document.createElement("td");
      typeCell.textContent = data.type;
      row.appendChild(typeCell);

      const yearCell = document.createElement("td");
      yearCell.textContent = data.year;
      row.appendChild(yearCell);

      const actionCell = document.createElement("td");
      const a = document.createElement("a");
      a.href = "edit.html?id=" + data.id;
      a.className = "btn btn-warning btn-icon-text";
      a.textContent = "Edit";
      actionCell.appendChild(a);
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });
    tbody.removeChild(circleLoadRow);
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
