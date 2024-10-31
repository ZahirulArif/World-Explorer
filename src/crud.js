const form = document.getElementById("myForm");
const imgInput = document.querySelector(".img");
const regionInput = document.getElementById("Region");
const capitalCityInput = document.getElementById("CapitalCity");
const timezonesInput = document.getElementById("Timezones");
const languagesInput = document.getElementById("Languages");
const startDateInput = document.getElementById("sDate");
const itemsInput = document.getElementById("Items");
const budgetInput = document.getElementById("Budget");
const submitBtn = document.querySelector(".submit");
const userInfo = document.getElementById("data");
const modal = document.getElementById("userForm");
const modalTitle = document.querySelector("#userForm .modal-title");
const newUserBtn = document.querySelector(".newUser");
const countrySearch = document.getElementById("countrySearch");
const countryList = document.getElementById("countryList");

// State management
let getData = JSON.parse(localStorage.getItem("userProfile")) || [];
let isEdit = false;
let editId = null;
let selectedFlag = "./image/Profile Icon.webp";
let countriesCache = null;

// Initialize
showInfo();

// Fetch countries data with caching and debounce
async function fetchCountries() {
    if (countriesCache) return countriesCache;
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        countriesCache = (await response.json()).sort((a, b) =>
            a.name.common.localeCompare(b.name.common)
        );
        return countriesCache;
    } catch (error) {
        console.error("Error fetching countries:", error);
        return [];
    }
}

const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
};

// Country search and selection with debounce
countrySearch.addEventListener(
    "input",
    debounce(async (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const countries = await fetchCountries();
        const filtered = countries.filter((country) =>
            country.name.common.toLowerCase().includes(searchTerm)
        );

        countryList.innerHTML = "";
        countryList.classList.remove("d-none");

        filtered.forEach((country) => {
            const div = document.createElement("div");
            div.className = "country-item";
            div.innerHTML = `
                <img src="${country.flags.png}" alt="${country.name.common} flag">
                <span>${country.name.common}</span>
            `;
            div.addEventListener("click", () => {
                selectedFlag = country.flags.png;
                imgInput.src = selectedFlag;
                countryList.classList.add("d-none");
                countrySearch.value = country.name.common;
            });
            countryList.appendChild(div);
        });
    }, 300)
);

// Close country list when clicking outside
document.addEventListener("click", (e) => {
    if (!countryList.contains(e.target) && e.target !== countrySearch) {
        countryList.classList.add("d-none");
    }
});

// Reset form for new user
newUserBtn.addEventListener("click", resetForm);

// Display user information
function showInfo() {
    userInfo.innerHTML = getData
        .map(
            (user, index) => `
        <tr>
            <td>${index + 1}</td>
            <td><img src="${user.picture}" alt="" width="50" height="50"></td>
            <td>${user.region}</td>
            <td>${user.capitalCity}</td>
            <td>${user.timezones}</td>
            <td>${user.languages}</td>
            <td>${user.startDate}</td>
            <td>${user.items}</td>
            <td>${user.budget}</td>
            <td>
                <button class="btn btn-success" onclick="readInfo(${index})" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>
                <button class="btn btn-primary" onclick="editInfo(${index})" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>
                <button class="btn btn-danger" onclick="deleteInfo(${index})"><i class="bi bi-trash"></i></button>
            </td>
        </tr>`
        )
        .join("");
}

// Create Itineraries
form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userInfo = {
        picture: selectedFlag,
        region: regionInput.value,
        capitalCity: capitalCityInput.value,
        timezones: timezonesInput.value,
        languages: languagesInput.value,
        startDate: startDateInput.value,
        items: itemsInput.value,
        budget: budgetInput.value,
    };

    if (isEdit) {
        getData[editId] = userInfo;
    } else {
        getData.push(userInfo);
    }

    localStorage.setItem("userProfile", JSON.stringify(getData));
    showInfo();
    resetForm();
    bootstrap.Modal.getInstance(modal).hide();
    alert("Form submitted successfully!");
});

// Read Info
function readInfo(index) {
    const user = getData[index];
    document.querySelector('.showImg').src = user.picture;
    document.getElementById('showRegion').value = user.region;
    document.getElementById('showCapitalCity').value = user.capitalCity;
    document.getElementById("showTimezones").value = user.timezones;
    document.getElementById("showLanguages").value = user.languages;
    document.getElementById("showsDate").value = user.startDate;
    document.getElementById("showItems").value = user.items;
    document.getElementById("showBudget").value = user.budget;
}


// Update Info
function editInfo(index) {
    isEdit = true;
    editId = index;
    const user = getData[index];

    // Set the current image without allowing edits
    selectedFlag = user.picture; // Lock the selectedFlag to the existing image
    imgInput.src = selectedFlag; // Display the locked image
    countrySearch.disabled = true; // Disable country selection during edit

    regionInput.value = user.region;
    capitalCityInput.value = user.capitalCity;
    timezonesInput.value = user.timezones;
    languagesInput.value = user.languages;
    startDateInput.value = user.startDate;
    itemsInput.value = user.items;
    budgetInput.value = user.budget;

    submitBtn.innerText = "Update";
    modalTitle.innerText = "Update the Form";
}

// Reset form and selections
function resetForm() {
    form.reset();
    selectedFlag = "./image/Profile Icon.webp";
    imgInput.src = selectedFlag;
    countrySearch.value = "";
    countrySearch.disabled = false; // Re-enable country selection for new user
    modalTitle.innerText = "Fill the Form";
    submitBtn.innerText = "Submit";
    isEdit = false;
}

// Delete Info
function deleteInfo(index) {
    if (confirm("Are you sure you want to delete?")) {
        getData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(getData));
        showInfo();
    }
}

// Form validation
function validateForm() {
    if (!regionInput.value || !capitalCityInput.value || !timezonesInput.value || !languagesInput.value || !startDateInput.value || !itemsInput.value || !budgetInput.value) {
        alert("Please fill in all fields");
        return false;
    }
    return true;
}

//Navigation button
function toggleMenu() {
    const dropdown = document.getElementById("dropdownMenu");
    dropdown.classList.toggle("active");
  }
