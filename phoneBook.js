window.onload = function() {

    // Notes, this code without any libraries or plugins, just pure javascript.

    //Main Buttons
    var mainAddBtn = document.getElementById('mainAdd');
    var mainSearchBtn = document.getElementById('mainSearch');
    var booktable = document.querySelector('.booktable');
    var pageDiv = document.querySelector('.pageDiv');

    // Addtion Form Fields
    var addFormDiv = document.querySelector('.addForm');
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    var addBtn = document.getElementById('add');
    var cancelBtn = document.getElementById('cancel');

    // Search Form Fields
    var searchFormDiv = document.querySelector('.searchForm');
    var searchCriteria = document.getElementById('searchBy');
    var searchBtn = document.getElementById('search');
    var cancelSrchBtn = document.getElementById('cancelSearch');
    var currentSearchTerm = ""; // The query represents a contact name or a contact phone number used in search

    // By default on loading the page hide the addition and search sections.
    addFormDiv.style.display = "none";
    searchFormDiv.style.display = "none";

    //Clear all fields
    function clearForm() {
        var formFields = document.querySelectorAll('.formFields');
        for (var i in formFields) {
            formFields[i].value = '';
        }
    }

    // Click Add phone Book button to show the addition form and fill fields with your data.
    mainAddBtn.addEventListener("click", function() {
        searchFormDiv.style.display = "none";
        addFormDiv.style.display = "block";
        clearForm();
    });

    // Click Search button to show the search form and enter your search criteria.
    mainSearchBtn.addEventListener("click", function() {
        addFormDiv.style.display = "none";
        searchFormDiv.style.display = "block";
        searchCriteria.value = '';
    });

    // Click cancel button to hide the addition section
    cancelBtn.addEventListener("click", function() {
        addFormDiv.style.display = "none";
    });

    // Click cancel button to hide the search section
    cancelSrchBtn.addEventListener("click", function() {
        searchFormDiv.style.display = "none";
    });


    //PhoneBook Costructor Function
    var PhoneBook = function() {
        var self = this;

        //set contacts with contacts data of contacts array from mockData.json file
        self.contacts = contacts;

        //initially filterd contacts array equal to original contacts array.
        self.filteredContacts = this.contacts;
    };

    PhoneBook.prototype = {
        //Add a single contact.
        add: function(contactInfo) {
            if (validate()) {

                this.contacts.push(contactInfo);

                clearForm();

                this.search(currentSearchTerm);
            }
        },
        remove: function(e) { //Remove a single contact

            if (e.target.classList.contains('deleteButton')) {

                var id = e.target.getAttribute('data-id');

                 var index = parseInt(id);

                this.contacts.splice(index, 1);

                this.search(currentSearchTerm);
            }
        },
        search: function(searchTerm) {
            currentSearchTerm = searchTerm;

            if (currentSearchTerm !== "") {
                this.filteredContacts = this.contacts.filter(function(contact) {
                    var searchData = contact.name.toLowerCase() + " " + contact.phone;

                    return searchData.indexOf(currentSearchTerm.toLowerCase()) !== -1;
                });
            } else {
                this.filteredContacts = this.contacts;
            }

            totalPages = Math.ceil(this.filteredContacts.length / currentPageSize);

            currentPage = (currentPage >= totalPages || currentPage < 0) ? (totalPages - 1) : currentPage;

            drawPagination();

            drawPhoneBook();
        }
    };

    //Declaration
    var myPhoneBook = new PhoneBook(); //instantiate object from constructor function PhoneBook;
    var currentPage = 0;  // on loading page currentpage = 0 by default.
    var currentPageSize = 20;  //number of contacts per page.
    var totalPages = Math.ceil(myPhoneBook.filteredContacts.length / currentPageSize); //total number of pages


    var dropDown = document.getElementById('pageSize');

    // by selectin page size from drop down list fire event to show contact list based on value you select
    //and drow paganation bar dynamically
    dropDown.addEventListener("change", function() {
        currentPageSize = parseInt(dropDown.value);

        totalPages = Math.ceil(myPhoneBook.contacts.length / currentPageSize);

        if (currentPage > totalPages) { //if total pages is 10 pages and the current page is 11
            currentPage = totalPages;  // the set or equal current page by total pages
        }
        drawPhoneBook();
        drawPagination();

        return true;
    });



    //aftert entering name, phone, and emial click Add button to insert new contact.
    addBtn.addEventListener("click", function() {

        //The phone book can hold up to 10,000 contacts.
        if(myPhoneBook.contacts.length <= 10000){
            //event handler call add method of myPhoneBook Object.
            myPhoneBook.add({
                    name: nameInput.value,
                    phone: phoneInput.value,
                    email: emailInput.value
                });
        }else{
            alert('Addion Canceled, you reach maximum Number of Contacts (10,000 contacts)');
        }
    });

    //Clich Search button to filter contact List.
    searchBtn.addEventListener("click", function() {
        //search term is either name or phone number getting it from searchCriteria.value.
        //event handler call search method of myPhoneBook Object.
        myPhoneBook.search(searchCriteria.value);
    });

    //To Delete record from contact list click red delete button on the right side of list.
    booktable.addEventListener("click", function(e) {
        //event handler call search method of myPhoneBook Object.
        myPhoneBook.remove(e);

    });

    pageDiv.addEventListener("click", function(e) {
        if (e.target.classList.contains('page-number')) {
            currentPage = e.target.getAttribute('data-number');

            drawPhoneBook();
        }
    });

    var contactInfo = {
        name: String, // less than 100 character
        phone: String, // xx-xxx-xxxx
        email: String // valid email Formate
    }

    function validate() {
        if ((nameInput.value).trim() == '') {
            alert("Please enter contact name");
            nameInput.focus();
            return false;
        }

        var phoneExp = /^[0-9]{2}-[0-9]{3}-\d{4}$/;
        var mailExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        var phone = phoneInput.value.match(phoneExp);
        var mail = mailExp.test(emailInput.value);

        if ((nameInput.value).length > 100) {
            alert("Name should be less than 100 characters!");
            nameInput.focus();
            return false;
        }

        if ((phoneInput.value).trim() == '') {
            alert("Please enter phone number.");
            phoneInput.focus();
            return false;
        }

        if (phone == null || !phone) {
            alert('You have entered an invalid phone number!');
            phoneInput.focus();
            return false;
        }


        if (!mail) {
            alert("You have entered an invalid email address!")
            emailInput.focus();
            return false;
        }
        return true;
    }

    //Drow Paganation bar
    function drawPagination() {
        var pageButtons = '';

        pageDiv.innerHTML = '';

        for (var i = 0; i < totalPages; i++) {
            var pageButton = '<button class="page-number" data-number="' + i + '">' + (i + 1) + '</button>';
            pageDiv.innerHTML += pageButton;
        }
    }

    //Drow Contacts list according to number of contact per page (pageSize) and page number
    function drawPhoneBook() {
        var startIndex = currentPageSize * currentPage;
        var endIndex = ((currentPageSize + startIndex) <= myPhoneBook.filteredContacts.length) ? (currentPageSize + startIndex) : myPhoneBook.filteredContacts.length;

        //Sort contacts list alphabetically by Name
        var sortedContacts = myPhoneBook.filteredContacts.sort(function(a, b) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
         });

        var page = myPhoneBook.filteredContacts.slice(startIndex, endIndex);

        booktable.innerHTML = '';

        for (var i = 0; i < page.length; i++) {
            var str = '<div class="entry">';
            str += '<div class="name"><span>' + page[i].name + '</span></div>';
            str += '<div class="phone"><span>' + page[i].phone + '</span></div>';
            str += '<div class="email"><span>' + page[i].email + '</span></div>';
            str += '<div class="del"><a href="#" class="deleteButton" data-id="' + page.indexOf(page[i]) + '">Delete</a></div>';
            str += '</div>';

            booktable.innerHTML += str;
        }
    }

    drawPhoneBook();
    drawPagination();
}