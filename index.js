// Load last ID from localStorage or start with 1 if not set
var id = parseInt(localStorage.getItem('lastFetchedId') || '1', 10);
var removed = JSON.parse(localStorage.getItem('removedPosts') || '[]');
var allPosts = JSON.parse(localStorage.getItem('allPosts') || '[]');
var isShowingDeleted = false;
window.addEventListener('load', function () {
    if (allPosts.length > 0) {
        allPosts.forEach(function (post) {
            addDataToPage(post);
        });
    }
});
var fetchbtn = document.getElementById('fetch-btn');
fetchbtn === null || fetchbtn === void 0 ? void 0 : fetchbtn.addEventListener('click', function () {
    fetch("https://jsonplaceholder.typicode.com/posts/".concat(id))
        .then(function (response) { return response.json(); })
        .then(function (data) {
        addDataToPage(data);
        allPosts.push(data);
        localStorage.setItem('allPosts', JSON.stringify(allPosts));
        localStorage.setItem('lastFetchedId', (id++).toString()); // Increment and store new ID
    })
        .catch(function (error) {
        console.log(error);
    });
});
function addDataToPage(data) {
    var addData = document.getElementById('data');
    var elementToAdd = document.createElement('div');
    elementToAdd.className = 'box';
    elementToAdd.innerHTML = "\n        <button class=\"delete-btn\" onclick=\"openModal(this.parentElement)\">&#10006</button>\n        <h2>".concat(data.title, "</h2>\n        <p>").concat(data.body, "</p>\n    ");
    addData === null || addData === void 0 ? void 0 : addData.appendChild(elementToAdd);
    elementToAdd.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}
function deletePost(element) {
    var _a, _b;
    var title = ((_a = element.querySelector('h2')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
    var body = ((_b = element.querySelector('p')) === null || _b === void 0 ? void 0 : _b.textContent) || '';
    removed.push({ id: id, title: title, body: body });
    localStorage.setItem('removedPosts', JSON.stringify(removed));
    allPosts = allPosts.filter(function (post) { return post.title !== title || post.body !== body; });
    localStorage.setItem('allPosts', JSON.stringify(allPosts));
    element.remove();
}
function deletePostPermanently(element) {
    var _a;
    var title = ((_a = element.querySelector('h2')) === null || _a === void 0 ? void 0 : _a.textContent) || '';
    removed = removed.filter(function (post) { return post.title !== title; });
    localStorage.setItem('removedPosts', JSON.stringify(removed));
    element.remove();
}
var modal = document.getElementById("myModal");
var selectedTaskToDelete;
function openModal(task) {
    modal.style.display = "block";
    selectedTaskToDelete = task;
}
var closeSpan = document.getElementsByClassName("close")[0];
closeSpan.onclick = function () {
    modal.style.display = "none";
};
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};
var okButton = document.getElementsByClassName("ok")[0];
okButton.onclick = function () {
    if (isShowingDeleted) {
        deletePostPermanently(selectedTaskToDelete);
    }
    else {
        deletePost(selectedTaskToDelete);
    }
    modal.style.display = "none";
};
var deletedPostButton = document.getElementById('bin');
deletedPostButton === null || deletedPostButton === void 0 ? void 0 : deletedPostButton.addEventListener('click', toggleDeletedData);
function toggleDeletedData() {
    var addData = document.getElementById('data');
    var deletedData = document.getElementById('deleted-data');
    var fetchbtn = document.getElementById('fetch-btn');
    if (!isShowingDeleted) {
        // Show deleted posts, hide fetch button, and add Close button
        deletedData.innerHTML = "<h2 class=\"subheading\">Deleted Data</h2>";
        var closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.className = 'close-deleted';
        closeButton.onclick = toggleDeletedData;
        removed.forEach(function (post) {
            var elementToAdd = document.createElement('div');
            elementToAdd.className = 'box';
            elementToAdd.innerHTML = "\n                <button class=\"delete-btn\" onclick=\"openModal(this.parentElement)\">&#10006</button>\n                <h2>".concat(post.title, "</h2>\n                <p>").concat(post.body, "</p>\n            ");
            deletedData === null || deletedData === void 0 ? void 0 : deletedData.appendChild(elementToAdd);
        });
        deletedData.style.display = 'flex';
        addData.style.display = 'none';
        fetchbtn.style.display = 'none';
        deletedPostButton.style.display = 'none';
        deletedData.appendChild(closeButton); // Add Close button to deletedData container
    }
    else {
        // Show all posts and make fetch button visible
        deletedData.style.display = 'none';
        addData.style.display = 'flex';
        fetchbtn.style.display = 'block';
        deletedPostButton.style.display = 'block';
        deletedData.innerHTML = ''; // Clear deletedData to remove old elements
    }
    isShowingDeleted = !isShowingDeleted;
}
